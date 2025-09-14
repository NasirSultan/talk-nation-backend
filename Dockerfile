# Use official Node.js 20 image as base
FROM node:20

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# This helps Docker cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy Prisma schema separately first (important for caching)
COPY prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Copy the rest of the project (src, tsconfig, etc.)
COPY . .

# Build NestJS project
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
