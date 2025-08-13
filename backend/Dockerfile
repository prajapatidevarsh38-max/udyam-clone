# Base image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files first for caching
COPY package*.json ./

# Copy Prisma schema before install (needed for postinstall script)
COPY prisma ./prisma

# Install dependencies (production only)
RUN npm ci --production

# Copy the rest of the application
COPY . .

# Expose backend port
EXPOSE 5000

# Start application
CMD ["node", "src/index.js"]
