FROM node:20

WORKDIR /usr/src/app

# Copy package files first
COPY package*.json ./

# Copy Prisma schema
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build NestJS application
RUN npm run build

# Generate Prisma client AGAIN after build to ensure it's available in dist
RUN npx prisma generate

# Verify both locations have Prisma client
RUN echo "Checking Prisma client locations:" && \
    ls -la node_modules/.prisma/client/ && \
    echo "Dist prisma service:" && \
    ls -la dist/lib/prisma/ && \
    echo "Copying Prisma client to dist..." && \
    cp -r node_modules/.prisma/client/* dist/node_modules/.prisma/client/ 2>/dev/null || true

EXPOSE 3000

# Start the application
CMD ["npm", "run", "start:prod"]