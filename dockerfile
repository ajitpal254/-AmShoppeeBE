# Use the official Node.js image for building the application
FROM node:14-alpine as build

# Set the working directory inside the container
WORKDIR /app

# Copy dependency definitions
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy all application files
COPY . .

# Build the application (adjust the build command as needed)
RUN npm run build

# Use a lean Node.js image for the production environment
FROM node:14-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy only the necessary artifacts from the build stage
COPY --from=build /app ./

# Expose the port your backend listens on (adjust if needed)
EXPOSE 3000

# Start the application (adjust the command if necessary)
CMD [ "npm", "start" ]