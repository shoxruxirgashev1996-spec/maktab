# Backend Dockerfile for production

FROM node:18-alpine as builder

WORKDIR /app

# Copy package files
COPY backend/package*.json ./backend/
COPY package*.json ./

# Install dependencies
RUN cd backend && npm ci

# Copy backend source
COPY backend/src ./backend/src
COPY backend/tsconfig.json ./backend/

# Build TypeScript
RUN cd backend && npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy only production dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm ci --only=production

# Copy compiled code from builder
COPY --from=builder /app/backend/dist ./backend/dist

# Copy Firebase config
COPY backend/firebase-applet-config.json ./backend/

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start server
CMD ["node", "backend/dist/src/server.js"]
