# Multi-stage build for production (Backend Only)
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy only server package files
COPY server/package*.json ./server/

# Install only server dependencies
RUN cd server && npm ci --only=production --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy server dependencies
COPY --from=deps /app/server/node_modules ./server/node_modules

# Copy only server source code
COPY server/ ./server/

# Production image, copy all the files and run the app
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy only server application
COPY --from=builder /app/server ./server

# Copy package files for production dependencies
COPY --from=deps /app/server/package*.json ./server/
COPY --from=deps /app/server/node_modules ./server/node_modules

# Create logs directory
RUN mkdir -p ./server/logs && chown -R nextjs:nodejs ./server/logs

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