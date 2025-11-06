import type { Request, Response } from "express";
import { db } from "./db";
import { users } from "@shared/schema";

export async function healthCheck(req: Request, res: Response) {
  try {
    // Database connection check
    await db.select().from(users).limit(1);
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'connected',
      session: req.session ? 'active' : 'inactive',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: process.env.npm_package_version || '2.0.0'
    };

    res.status(200).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      database: 'disconnected',
      session: req.session ? 'active' : 'inactive',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      error: error instanceof Error ? error.message : 'Unknown error',
      version: process.env.npm_package_version || '2.0.0'
    };

    res.status(503).json(health);
  }
}