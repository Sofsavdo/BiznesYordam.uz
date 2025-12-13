# Use Node.js LTS
FROM node:20-slim

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install ALL dependencies (including dev) for build
RUN npm ci

# Copy application code
COPY . .

# Build application (needs dev dependencies)
RUN npm run build

# Verify build output
RUN ls -la dist/ && ls -la dist/public/

# DON'T prune - keep all dependencies for production
# Some "dev" dependencies are needed at runtime

# Set environment
ENV NODE_ENV=production

# Railway will set PORT dynamically
EXPOSE 5000

# Start application
CMD ["npm", "start"]
