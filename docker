FROM node:14-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy app source code
COPY . .

# Expose the port the app runs on (adjust if needed)
EXPOSE 8080

# Start the application
CMD ["npm", "server.js"]