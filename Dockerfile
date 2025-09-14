# Use official Node.js 20 image as base
FROM node:20

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy env file into container
COPY .env .env

# Copy Prisma schema first for better caching
COPY prisma ./prisma

# Generate Prisma client using env
RUN npx prisma generate

# Copy the rest of the project
COPY . .

# Build NestJS project
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
