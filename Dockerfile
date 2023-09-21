# Use an official Node.js runtime as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

COPY *.js* .
COPY prisma ./prisma

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY src ./src
COPY public ./public
COPY start ./start.sh

# Expose the port your Next.js app will run on
EXPOSE 3000

RUN npm run build

# Make the start script executable
RUN chmod +x start.sh

CMD ["/bin/sh", "start.sh"]