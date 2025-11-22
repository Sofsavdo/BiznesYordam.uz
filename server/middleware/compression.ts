import compression from 'compression';
import { Request, Response } from 'express';

// Compression middleware with custom filter
export const compressionMiddleware = compression({
  // Only compress responses that are larger than 1kb
  threshold: 1024,
  
  // Compression level (0-9, where 9 is maximum compression)
  level: 6,
  
  // Custom filter function
  filter: (req: Request, res: Response) => {
    // Don't compress if client doesn't support it
    if (req.headers['x-no-compression']) {
      return false;
    }
    
    // Don't compress WebSocket upgrade requests
    if (req.headers.upgrade === 'websocket') {
      return false;
    }
    
    // Don't compress already compressed files
    const contentType = res.getHeader('Content-Type') as string;
    if (contentType) {
      const compressedTypes = [
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/',
        'audio/',
        'application/zip',
        'application/gzip',
      ];
      
      if (compressedTypes.some(type => contentType.includes(type))) {
        return false;
      }
    }
    
    // Use compression's default filter for everything else
    return compression.filter(req, res);
  },
});
