# Use Node.js 18 Alpine for smaller image size
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Install serve globally
RUN npm install -g serve

# Expose port
EXPOSE $PORT

# Start the app
CMD serve dist -s -l $PORT --single 