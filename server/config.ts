import { z } from 'zod';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Define environment schema
const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  DATABASE_AUTO_SETUP: z.string().optional().default('true'),
  
  // Server
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('5000'),
  HOST: z.string().default('0.0.0.0'),
  
  // Session
  SESSION_SECRET: z.string().min(32, 'SESSION_SECRET must be at least 32 characters'),
  
  // CORS
  FRONTEND_ORIGIN: z.string().optional(),
  CORS_ORIGIN: z.string().optional(),
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.string().default('900000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().default('200'),
  
  // File Upload
  MAX_FILE_SIZE: z.string().default('10485760'),
  UPLOAD_PATH: z.string().default('./uploads'),
  
  // WebSocket
  WS_HEARTBEAT_INTERVAL: z.string().default('30000'),
  WS_MAX_CONNECTIONS: z.string().default('1000'),
  
  // Email (Optional)
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Admin Defaults
  ADMIN_USERNAME: z.string().optional().default('admin'),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  
  // API URLs
  VITE_API_URL: z.string().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'http', 'debug']).optional(),
});

// Parse and validate environment variables
let config: z.infer<typeof envSchema>;

try {
  config = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error('❌ Environment validation failed:');
    error.errors.forEach((err) => {
      console.error(`  - ${err.path.join('.')}: ${err.message}`);
    });
    process.exit(1);
  }
  throw error;
}

// Export typed config
export const appConfig = {
  // Database
  database: {
    url: config.DATABASE_URL,
    autoSetup: config.DATABASE_AUTO_SETUP === 'true',
  },
  
  // Server
  server: {
    env: config.NODE_ENV,
    port: parseInt(config.PORT, 10),
    host: config.HOST,
    isDevelopment: config.NODE_ENV === 'development',
    isProduction: config.NODE_ENV === 'production',
    isTest: config.NODE_ENV === 'test',
  },
  
  // Session
  session: {
    secret: config.SESSION_SECRET,
  },
  
  // CORS
  cors: {
    origin: config.CORS_ORIGIN?.split(',').map(o => o.trim()) || [
      config.FRONTEND_ORIGIN || 'http://localhost:5000'
    ],
  },
  
  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(config.RATE_LIMIT_WINDOW_MS, 10),
    maxRequests: parseInt(config.RATE_LIMIT_MAX_REQUESTS, 10),
  },
  
  // File Upload
  upload: {
    maxFileSize: parseInt(config.MAX_FILE_SIZE, 10),
    uploadPath: config.UPLOAD_PATH,
  },
  
  // WebSocket
  websocket: {
    heartbeatInterval: parseInt(config.WS_HEARTBEAT_INTERVAL, 10),
    maxConnections: parseInt(config.WS_MAX_CONNECTIONS, 10),
  },
  
  // Email
  email: {
    enabled: !!(config.SMTP_HOST && config.SMTP_USER && config.SMTP_PASS),
    host: config.SMTP_HOST,
    port: config.SMTP_PORT ? parseInt(config.SMTP_PORT, 10) : 587,
    user: config.SMTP_USER,
    pass: config.SMTP_PASS,
  },
  
  // Admin
  admin: {
    username: config.ADMIN_USERNAME,
    password: config.ADMIN_PASSWORD,
    email: config.ADMIN_EMAIL,
  },
  
  // Logging
  logging: {
    level: config.LOG_LEVEL || (config.NODE_ENV === 'production' ? 'info' : 'debug'),
  },
};

// Log configuration (without sensitive data)
console.log('✅ Configuration loaded:', {
  environment: appConfig.server.env,
  port: appConfig.server.port,
  database: appConfig.database.url.includes('postgresql') ? 'PostgreSQL' : 'SQLite',
  emailEnabled: appConfig.email.enabled,
  corsOrigins: appConfig.cors.origin,
});

export default appConfig;
