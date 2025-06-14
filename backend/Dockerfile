# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the application
RUN npm run build

# Use a smaller image for the final container
FROM node:18-alpine AS runner
WORKDIR /app

# Install dependencies for production
ENV NODE_ENV=production

# Copy necessary files from the builder stage
COPY --from=base /app/package*.json ./
COPY --from=base /app/node_modules ./node_modules
COPY --from=base /app/dist ./dist

# Expose the port the app runs on
EXPOSE 3001

# Set environment variables
ENV NODE_ENV production
ENV PORT 3001

# Start the application
CMD ["node", "dist/index.js"]
