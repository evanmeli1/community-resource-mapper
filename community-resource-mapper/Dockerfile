# Use official Node.js runtime as base image
FROM node:18-alpine

# Set working directory inside container
WORKDIR /app

# Copy package files first (for better caching)
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including dev dependencies for build)
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the application code
COPY . .

# Create .env file with production defaults
RUN echo "# Production environment" > .env && \
    echo "NODE_ENV=production" >> .env && \
    echo "NEXTAUTH_URL=http://localhost:3000" >> .env && \
    echo "NEXTAUTH_SECRET=your-nextauth-secret-change-in-production" >> .env

# Build the Next.js application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Health check to ensure container is working
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/resources || exit 1

# Start the application
CMD ["npm", "start"]