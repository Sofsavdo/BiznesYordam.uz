# Build stage
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including devDependencies for build)
RUN npm ci --no-audit --no-fund

# Copy source code
COPY . .

# Build the application
RUN echo "🏗️  Building client..." && \
    npm run build:client && \
    echo "✅ Client build done" && \
    ls -la dist/public && \
    echo "🏗️  Building server..." && \
    npm run build:server && \
    echo "✅ Server build done" && \
    ls -la dist/

# Runtime stage
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy package files
COPY --from=builder /app/package*.json ./

# Install production dependencies only
RUN npm ci --omit=dev --no-audit --no-fund && \
    npm rebuild better-sqlite3 || true

# Copy built files from builder
COPY --from=builder /app/dist ./dist

# Verify build artifacts exist
RUN echo "📂 Checking build artifacts..." && \
    ls -la dist/ && \
    if [ ! -d "dist/public" ]; then \
      echo "❌ ERROR: dist/public not found!"; \
      exit 1; \
    fi && \
    if [ ! -f "dist/index.js" ]; then \
      echo "❌ ERROR: dist/index.js not found!"; \
      exit 1; \
    fi && \
    echo "✅ All build artifacts present"

EXPOSE 5000
CMD ["node", "dist/index.js"]