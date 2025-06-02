# Use the official Node.js 18 image as the base image
FROM node:18-alpine AS base

# Set the working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY next.config.js ./
COPY next-i18next.config.js ./
COPY tsconfig.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code
COPY public ./public
COPY src ./src

# Build the application
RUN npm run build

# Use a smaller image for the final container
FROM node:18-alpine AS runner
WORKDIR /app

# Copy necessary files from the builder stage
COPY --from=base /app/next.config.js ./
COPY --from=base /app/package.json ./
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public
COPY --from=base /app/node_modules ./node_modules

# Expose the port the app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV production
ENV PORT 3000
ENV HOSTNAME 0.0.0.0

# Start the application
CMD ["npm", "start"]
