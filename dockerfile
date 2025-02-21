# Use Node.js official image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
RUN npm install

# Copy the entire app
COPY . .

# Expose port
EXPOSE 5000

# Start the server
CMD ["sh", "-c", "cd src && npx prisma migrate deploy && npx prisma generate && node scripts/seed.js && node index.js"]