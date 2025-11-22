import { Request, Response, NextFunction } from 'express';

// Simple in-memory cache
class MemoryCache {
  private cache: Map<string, { data: any; expires: number }> = new Map();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Cleanup expired entries every 5 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanup();
    }, 5 * 60 * 1000);
  }

  set(key: string, data: any, ttl: number): void {
    const expires = Date.now() + ttl * 1000;
    this.cache.set(key, { data, expires });
  }

  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    if (Date.now() > entry.expires) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expires) {
        this.cache.delete(key);
      }
    }
  }

  destroy(): void {
    clearInterval(this.cleanupInterval);
    this.clear();
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    };
  }
}

// Create cache instance
export const cache = new MemoryCache();

// Cache middleware factory
export function cacheMiddleware(ttl: number = 300) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Skip caching for authenticated requests (unless explicitly allowed)
    if (req.session?.user && !req.query.allowCache) {
      return next();
    }

    // Generate cache key
    const cacheKey = `${req.originalUrl || req.url}`;
    
    // Try to get from cache
    const cachedData = cache.get(cacheKey);
    
    if (cachedData) {
      res.setHeader('X-Cache', 'HIT');
      return res.json(cachedData);
    }

    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to cache response
    res.json = function(data: any) {
      cache.set(cacheKey, data, ttl);
      res.setHeader('X-Cache', 'MISS');
      return originalJson(data);
    };

    next();
  };
}

// Cache invalidation middleware
export function invalidateCache(pattern?: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (pattern) {
      // Invalidate specific pattern
      const stats = cache.getStats();
      stats.keys.forEach(key => {
        if (key.includes(pattern)) {
          cache.delete(key);
        }
      });
    } else {
      // Clear all cache
      cache.clear();
    }
    next();
  };
}

// Browser caching headers
export function browserCache(maxAge: number = 3600) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (req.method === 'GET') {
      res.setHeader('Cache-Control', `public, max-age=${maxAge}`);
      res.setHeader('Expires', new Date(Date.now() + maxAge * 1000).toUTCString());
    }
    next();
  };
}

// No cache headers
export function noCache(req: Request, res: Response, next: NextFunction) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
}

// ETag support
export function etag(req: Request, res: Response, next: NextFunction) {
  const originalJson = res.json.bind(res);

  res.json = function(data: any) {
    const content = JSON.stringify(data);
    const hash = require('crypto').createHash('md5').update(content).digest('hex');
    
    res.setHeader('ETag', `"${hash}"`);
    
    // Check if client has cached version
    if (req.headers['if-none-match'] === `"${hash}"`) {
      return res.status(304).end();
    }
    
    return originalJson(data);
  };

  next();
}

// Cache warming function
export async function warmCache(routes: Array<{ url: string; ttl: number }>) {
  for (const route of routes) {
    try {
      // TODO: Implement cache warming logic
      // This would make internal requests to populate cache
      console.log(`Warming cache for ${route.url}`);
    } catch (error) {
      console.error(`Failed to warm cache for ${route.url}`, error);
    }
  }
}

// Export cache stats endpoint handler
export function cacheStatsHandler(req: Request, res: Response) {
  const stats = cache.getStats();
  res.json({
    cacheSize: stats.size,
    cachedRoutes: stats.keys.length,
    keys: stats.keys,
  });
}
