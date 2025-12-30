FROM node:20

# Set the working directory
WORKDIR /app/backend

# Copy package files and install dependencies
# COPY package*.json tsconfig.json prisma ./   
COPY package*.json ./
RUN npm install

COPY . .

# Copy env
COPY ./.env.example ./.env

RUN npm run build
RUN npx prisma generate

# Expose the port used by your application
ENV PORT=3000

EXPOSE 3000


# RUN npm run start
CMD ["npm", "run", "start"]
# Start the application in development mode
# CMD ["npm", "run", "dev"]
