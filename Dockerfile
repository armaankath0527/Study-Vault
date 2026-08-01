FROM node:20-alpine

WORKDIR /app

# Copy root and subfolder package configurations
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies for both backend and frontend
RUN npm run install:all

# Copy remaining application files
COPY . .

# Build frontend production assets
RUN npm run build:client

# Set default production environment variables
ENV NODE_ENV=production
ENV PORT=5000

EXPOSE 5000

# Start server
CMD ["npm", "start"]
