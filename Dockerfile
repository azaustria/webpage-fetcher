# Use a Node.js base image
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port if your script listens on a specific port
# EXPOSE 8080

# Command to run your script
CMD [ "npm", "start" ]
