FROM node:20

# Set working directory
WORKDIR /app/frontend

# Copy package files and install dependencies
COPY package*.json ./   
RUN npm install         

# Copy Vite config and other source files
COPY . .       

# Expose the port used by Vite dev server
EXPOSE 5173

# Development mode: Start the Vite development server
# CMD ["npm", "run", "dev"]

# For production build:
# RUN npm run build                # Uncomment if deploying for production
# CMD ["npm", "run", "preview"]     # Uncomment for serving the build in production mode