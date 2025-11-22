import type { Request, Response } from "express";
import { db } from "./db";
import { users } from "@shared/schema";
import os from "os";

export async function healthCheck(req: Request, res: Response) {
  try {
    // Database connection check with timing
    const dbStart = Date.now();
    await db.select().from(users).limit(1);
    const dbDuration = Date.now() - dbStart;
    
    // System metrics
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    const usedMemory = totalMemory - freeMemory;
    const memoryUsagePercent = (usedMemory / totalMemory) * 100;
    
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.1',
      uptime: Math.floor(process.uptime()),
      checks: {
        database: {
          status: dbDuration < 1000 ? 'pass' : 'warn',
          responseTime: `${dbDuration}ms`,
        },
        memory: {
          status: memoryUsagePercent < 80 ? 'pass' : memoryUsagePercent < 90 ? 'warn' : 'fail',
          usage: `${memoryUsagePercent.toFixed(2)}%`,
        },
        session: {
          status: req.session ? 'pass' : 'warn',
          active: !!req.session,
        },
      },
      metrics: {
        memory: {
          total: Math.floor(totalMemory / 1024 / 1024),
          free: Math.floor(freeMemory / 1024 / 1024),
          used: Math.floor(usedMemory / 1024 / 1024),
          usagePercent: memoryUsagePercent.toFixed(2),
        },
        process: process.memoryUsage(),
        cpu: {
          loadAverage: os.loadavg(),
          cores: os.cpus().length,
        },
      },
    };

    res.status(200).json(health);
  } catch (error) {
    console.error('Health check failed:', error);
    
    const health = {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      version: process.env.npm_package_version || '2.0.1',
      uptime: Math.floor(process.uptime()),
      checks: {
        database: {
          status: 'fail',
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      error: error instanceof Error ? error.message : 'Unknown error',
    };

    res.status(503).json(health);
  }
}

// Readiness check for container orchestration
export async function readinessCheck(req: Request, res: Response) {
  try {
    await db.select().from(users).limit(1);
    res.status(200).json({ status: 'ready' });
  } catch (error) {
    res.status(503).json({ status: 'not ready' });
  }
}

// Liveness check for container orchestration
export function livenessCheck(req: Request, res: Response) {
  res.status(200).json({ status: 'alive', uptime: process.uptime() });
}