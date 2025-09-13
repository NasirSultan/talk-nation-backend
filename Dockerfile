# Use official Node.js 20 image as base
FROM node:20

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first
# This helps Docker cache dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the project
COPY . .

# Generate Prisma client (if you add Prisma later)
RUN npm run postinstall

# Build NestJS project
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the app in production mode
CMD ["npm", "run", "start:prod"]
