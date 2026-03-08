FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files first to leverage Docker cache
COPY package.json package-lock.json* ./

# Install dependencies (including devDependencies for tests)
RUN npm install --no-audit --no-fund

# Copy the rest of the project
COPY . .

# Default command (can be overridden by docker-compose)
CMD ["npm", "run", "test:run"]
