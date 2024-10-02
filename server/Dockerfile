# Use the official Node.js image as the base image
FROM node:18-bullseye

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./


# install needed compilers
RUN apt-get update && \
    apt-get install -y \
    python3 \
    python3-pip \
    g++ \
    default-jdk


# Install the dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port the app runs on
EXPOSE 3001

# Define the command to run the app
CMD ["node", "index.js"]



