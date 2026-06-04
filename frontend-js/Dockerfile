# Step 1: Build stage
FROM node:20 AS build
WORKDIR /app

# Copy ONLY the package files first
COPY package.json ./

# Install dependencies (This will now correctly download Linux binaries)
RUN npm install

# Copy the rest of the source code
COPY . .

# Run the build
RUN npm run build

# Step 2: Production stage
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]