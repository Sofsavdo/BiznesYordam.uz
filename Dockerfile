# Build stage
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

# Runtime stage
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app
COPY --from=builder /app/package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund && npm rebuild better-sqlite3 || true
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/client/index.html ./client/index.html
COPY --from=builder /app/dist/public ./dist/public
EXPOSE 5000
CMD ["node", "dist/index.js"]