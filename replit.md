# BiznesYordam - Marketplace Fulfillment Platform

## Overview

BiznesYordam is a comprehensive marketplace fulfillment platform designed for e-commerce partners in Uzbekistan. The application provides a complete solution for managing marketplace operations, including product management, fulfillment requests, pricing optimization, and analytics. Built as a full-stack web application, it serves partners looking to optimize their marketplace presence across platforms like Uzum, Wildberries, and Yandex Market.

The platform features role-based access control with admin and partner user types, comprehensive product and order management, real-time analytics, and automated pricing calculations. It's designed to help businesses streamline their marketplace operations and maximize profitability through data-driven insights.

## User Preferences

- Preferred communication style: Simple, everyday language (O'zbek tilida)
- Platform language: Uzbek only (Russian language support removed)
- Project status: Ready for production deployment (cleaned from development-specific code)

## System Architecture

### Frontend Architecture
The client-side application is built using React 18 with TypeScript, leveraging modern React patterns and hooks for state management. The UI is constructed using shadcn/ui components built on top of Radix UI primitives, providing a consistent and accessible design system. Styling is handled through Tailwind CSS with a custom design token system for theming and responsive design.

The frontend follows a component-based architecture with clear separation between presentational and container components. React Query (TanStack Query) manages server state and caching, while a custom authentication context provides user session management across the application. Routing is implemented using Wouter for lightweight client-side navigation.

### Backend Architecture
The server-side application uses Express.js with TypeScript in an ESM environment. The architecture follows a modular approach with separate concerns for routing, database operations, and business logic. Authentication is handled through Express sessions with PostgreSQL-backed session storage, providing persistent login states across browser sessions.

The API layer implements RESTful endpoints with role-based access control middleware. Request validation is performed using Zod schemas, ensuring type safety from the database layer through to the frontend. The server includes comprehensive logging and error handling middleware for production reliability.

### Database Layer
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The database schema is designed with proper normalization and includes tables for users, partners, products, fulfillment requests, pricing tiers, and analytics. Database migrations are managed through Drizzle Kit with automatic schema generation.

The data layer implements a storage abstraction pattern, providing a clean interface between business logic and database operations. This design allows for easy testing and potential database provider changes while maintaining type safety throughout the application stack.

### Authentication & Authorization
Session-based authentication is implemented using express-session with PostgreSQL storage via connect-pg-simple. The system supports role-based access control with admin and partner user types, each having specific permissions and access levels. Authentication state is managed through a React context provider with automatic session validation.

Password security is handled using bcryptjs for hashing, and session cookies are configured for production security including httpOnly and secure flags. The authentication flow includes registration, login, logout, and automatic session restoration across browser sessions.

### State Management
Client-side state management follows a hybrid approach using React Query for server state and React Context for application state. This pattern minimizes prop drilling while maintaining clear data flow and enabling efficient caching of API responses. Form state is managed locally within components using controlled inputs and validation schemas.

The application implements optimistic updates for better user experience, with proper error handling and rollback mechanisms. Loading states and error boundaries provide comprehensive user feedback during asynchronous operations.

## Replit Environment Setup

### Current Configuration
- **Development Mode**: Using SQLite database for development (PostgreSQL will be used in production)
- **Port Configuration**: Server runs on port 5000 (both frontend and backend)
- **Environment**: NODE_ENV=development
- **Session Secret**: Configured via Replit Secrets
- **HMR (Hot Module Replacement)**: Disabled in Replit environment to avoid WebSocket issues (use manual refresh)
- **Default Development Credentials** (⚠️ DEVELOPMENT ONLY - will NOT be created in production):
  - Admin: username `admin`, password `BiznesYordam2024!`
  - Partner: username `testpartner`, password `Partner2024!`

### Production Security
⚠️ **IMPORTANT**: Test credentials and seed data are ONLY created in development mode (NODE_ENV !== 'production'). In production:
- No default users are created automatically
- All user accounts must be created through the registration API
- Admin accounts should be created manually with strong, unique passwords
- Seed data is completely skipped to prevent security vulnerabilities

### Deployment Setup
- **Deployment Type**: Autoscale (for production)
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Required Secrets for Production**:
  - `SESSION_SECRET`: Session encryption key
  - `DATABASE_URL`: PostgreSQL connection string (for production)

## External Dependencies

### Database Services
- **PostgreSQL**: Primary database engine for production with full ACID compliance
- **SQLite**: Development database with automatic seeding

### UI Framework & Components
- **Radix UI**: Comprehensive component library providing accessible, unstyled UI primitives
- **shadcn/ui**: Curated component library built on Radix UI with Tailwind CSS styling
- **Tailwind CSS**: Utility-first CSS framework for responsive design and consistent styling

### Development & Build Tools
- **Vite**: Fast build tool and development server with hot module replacement
- **TypeScript**: Static type checking for enhanced developer experience and code reliability
- **Drizzle ORM**: Type-safe database toolkit with automatic migrations and schema management
- **React Query**: Server state management with caching, synchronization, and background updates

### Authentication & Security
- **bcryptjs**: Password hashing library for secure credential storage
- **express-session**: Session management middleware with PostgreSQL persistence
- **connect-pg-simple**: PostgreSQL session store for Express sessions

### Validation & Forms
- **Zod**: TypeScript-first schema validation library for runtime type checking
- **React Hook Form**: Performant forms library with minimal re-renders and validation integration

### Development Environment
- **Replit**: Cloud-based development environment with integrated deployment and collaboration features
- **ESBuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution environment for development server