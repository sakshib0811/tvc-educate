# Multi-stage build for production (Backend Only)
FROM node:18-alpine AS base

# Install curl for healthcheck
RUN apk add --no-cache curl

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app/server

# Copy only server package files
COPY server/package*.json ./

# Install only production dependencies
RUN npm ci --only=production --ignore-scripts

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app/server

# Copy dependencies
COPY --from=deps /app/server/node_modules ./node_modules

# Copy source code
COPY server/ ./

# Production image
FROM base AS runner
WORKDIR /app/server

ENV NODE_ENV=production
ENV PORT=5000

# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

# Copy application code + node_modules
COPY --from=builder /app/server ./

# Set ownership for logs
RUN mkdir -p ./logs && chown -R nextjs:nodejs ./logs

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Start the app
CMD ["npm", "start"]
