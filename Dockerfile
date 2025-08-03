# Multi-stage build for production
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY client/package*.json ./client/
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci --only=production --ignore-scripts
RUN cd client && npm ci --only=production --ignore-scripts
RUN cd server && npm ci --only=production --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/client/node_modules ./client/node_modules
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy source code
COPY . .

# Build client
WORKDIR /app/client
RUN npm run build:prod

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built application
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/build ./client/build

# Copy package files for production dependencies
COPY --from=deps /app/server/package*.json ./server/
COPY --from=deps /app/server/node_modules ./server/node_modules

# Create logs directory
RUN mkdir -p /app/server/logs && chown -R nextjs:nodejs /app/server/logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Set working directory to server
WORKDIR /app/server

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the application
CMD ["npm", "start"] 