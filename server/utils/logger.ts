// Production-ready logger utility
// Replaces console.log with proper logging

import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

// Create logger instance
export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'biznesyordam' },
  transports: [
    // Write all logs to console in development
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
      silent: false // Always show in development
    }),
    // Write all logs to file in production
    ...(isProduction ? [
      new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
      new winston.transports.File({ filename: 'logs/combined.log' })
    ] : [])
  ]
});

// Helper functions for common log patterns
export const log = {
  info: (message: string, meta?: any) => logger.info(message, meta),
  error: (message: string, error?: any) => logger.error(message, { error: error?.message, stack: error?.stack }),
  warn: (message: string, meta?: any) => logger.warn(message, meta),
  debug: (message: string, meta?: any) => logger.debug(message, meta),
  
  // Specific log types
  api: (method: string, path: string, status: number, duration?: number) => {
    logger.info('API Request', { method, path, status, duration });
  },
  
  db: (query: string, duration?: number) => {
    logger.debug('Database Query', { query, duration });
  },
  
  auth: (action: string, userId?: string, success: boolean = true) => {
    logger.info('Auth Event', { action, userId, success });
  },
  
  security: (event: string, details?: any) => {
    logger.warn('Security Event', { event, ...details });
  }
};

// Export default logger
export default logger;
