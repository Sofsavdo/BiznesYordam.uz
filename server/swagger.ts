import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'BiznesYordam API',
    version: '2.0.1',
    description: 'Professional Marketplace Fulfillment Platform API Documentation',
    contact: {
      name: 'BiznesYordam Support',
      email: 'support@biznesyordam.uz',
      url: 'https://biznesyordam.uz',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Development server',
    },
    {
      url: 'https://biznesyordam.uz',
      description: 'Production server',
    },
  ],
  components: {
    securitySchemes: {
      sessionAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'connect.sid',
        description: 'Session-based authentication',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          message: {
            type: 'string',
            description: 'Error message',
          },
          code: {
            type: 'string',
            description: 'Error code',
          },
          timestamp: {
            type: 'string',
            format: 'date-time',
            description: 'Error timestamp',
          },
        },
      },
      User: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          username: { type: 'string' },
          email: { type: 'string', format: 'email' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          role: { type: 'string', enum: ['admin', 'partner', 'customer'] },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Partner: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          userId: { type: 'string' },
          businessName: { type: 'string' },
          businessCategory: { type: 'string' },
          pricingTier: { type: 'string' },
          commissionRate: { type: 'string' },
          isApproved: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Product: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          partnerId: { type: 'string' },
          name: { type: 'string' },
          category: { type: 'string' },
          description: { type: 'string' },
          price: { type: 'string' },
          costPrice: { type: 'string' },
          sku: { type: 'string' },
          barcode: { type: 'string' },
          currentStock: { type: 'integer' },
          isActive: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
        },
      },
      Analytics: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          partnerId: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          revenue: { type: 'string' },
          orders: { type: 'integer' },
          profit: { type: 'string' },
          commissionPaid: { type: 'string' },
          marketplace: { type: 'string' },
          category: { type: 'string' },
        },
      },
    },
  },
  tags: [
    {
      name: 'Authentication',
      description: 'Authentication endpoints',
    },
    {
      name: 'Partners',
      description: 'Partner management endpoints',
    },
    {
      name: 'Products',
      description: 'Product management endpoints',
    },
    {
      name: 'Analytics',
      description: 'Analytics and reporting endpoints',
    },
    {
      name: 'Admin',
      description: 'Admin-only endpoints',
    },
    {
      name: 'Chat',
      description: 'Chat and messaging endpoints',
    },
    {
      name: 'Inventory',
      description: 'Inventory management endpoints',
    },
    {
      name: 'Orders',
      description: 'Order management endpoints',
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./server/routes.ts', './server/swagger-docs.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);
