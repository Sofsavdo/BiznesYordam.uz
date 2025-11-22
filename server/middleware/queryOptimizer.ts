import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger';

// Query performance monitoring middleware
export function queryPerformanceMonitor(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  let queryCount = 0;

  // Track database queries
  const originalQuery = (req as any).db?.query;
  if (originalQuery) {
    (req as any).db.query = function(...args: any[]) {
      queryCount++;
      return originalQuery.apply(this, args);
    };
  }

  // Log on response finish
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    if (queryCount > 10) {
      logger.warn('High query count detected', {
        path: req.path,
        method: req.method,
        queryCount,
        duration: `${duration}ms`,
      });
    }
    
    if (duration > 1000) {
      logger.warn('Slow request detected', {
        path: req.path,
        method: req.method,
        queryCount,
        duration: `${duration}ms`,
      });
    }
  });

  next();
}

// Database query optimization helpers
export class QueryOptimizer {
  /**
   * Batch load related entities to avoid N+1 queries
   * Example: Load all users for a list of partners in one query
   */
  static async batchLoad<T, K extends keyof T>(
    items: T[],
    foreignKey: K,
    loader: (ids: any[]) => Promise<any[]>,
    localKey: string = 'id'
  ): Promise<T[]> {
    if (items.length === 0) return items;

    // Extract unique foreign keys
    const foreignKeys = [...new Set(items.map(item => item[foreignKey]))];
    
    // Load related entities in one query
    const relatedEntities = await loader(foreignKeys);
    
    // Create lookup map
    const entityMap = new Map(
      relatedEntities.map(entity => [entity[localKey], entity])
    );
    
    // Attach related entities to items
    return items.map(item => ({
      ...item,
      [foreignKey]: entityMap.get(item[foreignKey]) || null,
    }));
  }

  /**
   * Prefetch related data using joins
   * This is more efficient than separate queries
   */
  static async prefetchRelations<T>(
    query: any,
    relations: string[]
  ): Promise<T[]> {
    // This would use Drizzle's with() or leftJoin() methods
    // Example implementation would depend on your specific schema
    return query;
  }

  /**
   * Paginate results efficiently
   */
  static paginate(page: number = 1, limit: number = 20) {
    const offset = (page - 1) * limit;
    return {
      limit,
      offset,
    };
  }

  /**
   * Add query hints for database optimization
   */
  static addQueryHints(query: any, hints: string[]) {
    // PostgreSQL-specific query hints
    // Example: USE INDEX, FORCE INDEX, etc.
    return query;
  }
}

// Example usage in routes:
/*
// BAD: N+1 query problem
const partners = await db.select().from(partners);
for (const partner of partners) {
  partner.user = await db.select().from(users).where(eq(users.id, partner.userId));
}

// GOOD: Single query with join
const partners = await db.select()
  .from(partners)
  .leftJoin(users, eq(partners.userId, users.id));

// GOOD: Batch loading
const partners = await db.select().from(partners);
const userIds = partners.map(p => p.userId);
const users = await db.select().from(users).where(inArray(users.id, userIds));
const userMap = new Map(users.map(u => [u.id, u]));
partners.forEach(p => p.user = userMap.get(p.userId));
*/

// Query result caching decorator
export function cacheQuery(ttl: number = 300) {
  const cache = new Map<string, { data: any; expires: number }>();

  return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function(...args: any[]) {
      const cacheKey = `${propertyKey}:${JSON.stringify(args)}`;
      const cached = cache.get(cacheKey);

      if (cached && Date.now() < cached.expires) {
        logger.debug(`Cache hit for ${propertyKey}`);
        return cached.data;
      }

      const result = await originalMethod.apply(this, args);
      cache.set(cacheKey, {
        data: result,
        expires: Date.now() + ttl * 1000,
      });

      return result;
    };

    return descriptor;
  };
}

// Database connection pooling helper
export class ConnectionPool {
  private connections: any[] = [];
  private maxConnections: number;
  private activeConnections: number = 0;

  constructor(maxConnections: number = 20) {
    this.maxConnections = maxConnections;
  }

  async acquire(): Promise<any> {
    if (this.activeConnections < this.maxConnections) {
      this.activeConnections++;
      // Return a connection from pool or create new one
      return this.connections.pop() || this.createConnection();
    }
    
    // Wait for available connection
    return new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (this.activeConnections < this.maxConnections) {
          clearInterval(checkInterval);
          this.activeConnections++;
          resolve(this.connections.pop() || this.createConnection());
        }
      }, 100);
    });
  }

  release(connection: any): void {
    this.activeConnections--;
    this.connections.push(connection);
  }

  private createConnection(): any {
    // Create new database connection
    // This would use your database driver
    return {};
  }

  getStats() {
    return {
      total: this.maxConnections,
      active: this.activeConnections,
      idle: this.connections.length,
    };
  }
}
