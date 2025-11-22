import { Router, Request, Response } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";

const router = Router();

/**
 * DEBUG ENDPOINTS - Remove in production after fixing
 */

// Check if admin exists
router.get("/debug/check-admin", async (req: Request, res: Response) => {
  try {
    const adminUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt
      })
      .from(users)
      .where(eq(users.role, "admin"));
    
    res.json({
      success: true,
      count: adminUsers.length,
      admins: adminUsers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// List all users (without passwords)
router.get("/debug/list-users", async (req: Request, res: Response) => {
  try {
    const allUsers = await db
      .select({
        id: users.id,
        username: users.username,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt
      })
      .from(users);
    
    res.json({
      success: true,
      count: allUsers.length,
      users: allUsers
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Force create admin user
router.post("/debug/create-admin", async (req: Request, res: Response) => {
  try {
    // Check if admin already exists
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.username, "admin"))
      .limit(1);
    
    if (existingAdmin.length > 0) {
      return res.json({
        success: true,
        message: "Admin already exists",
        admin: {
          id: existingAdmin[0].id,
          username: existingAdmin[0].username,
          email: existingAdmin[0].email
        }
      });
    }
    
    // Create admin
    const adminPassword = await bcrypt.hash("BiznesYordam2024!", 10);
    
    const [newAdmin] = await db.insert(users).values({
      id: nanoid(),
      username: "admin",
      email: "admin@biznesyordam.uz",
      password: adminPassword,
      firstName: "Admin",
      lastName: "BiznesYordam",
      phone: "+998901234567",
      role: "admin",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }).returning();
    
    res.json({
      success: true,
      message: "Admin created successfully",
      admin: {
        id: newAdmin.id,
        username: newAdmin.username,
        email: newAdmin.email
      },
      credentials: {
        username: "admin",
        password: "BiznesYordam2024!"
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

// Test password validation
router.post("/debug/test-login", async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username and password required"
      });
    }
    
    const user = await db
      .select()
      .from(users)
      .where(eq(users.username, username))
      .limit(1);
    
    if (user.length === 0) {
      return res.json({
        success: false,
        message: "User not found",
        username
      });
    }
    
    const isValid = await bcrypt.compare(password, user[0].password);
    
    res.json({
      success: true,
      userExists: true,
      passwordValid: isValid,
      user: {
        id: user[0].id,
        username: user[0].username,
        email: user[0].email,
        role: user[0].role,
        isActive: user[0].isActive
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
      stack: error.stack
    });
  }
});

export default router;
