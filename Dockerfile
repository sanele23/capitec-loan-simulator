# -------- Stage 1: Build --------
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (for caching)
COPY package.json package-lock.json ./

RUN npm install

# Copy rest of project
COPY . .

# Build production bundle
RUN npm run build


# -------- Stage 2: Serve --------
FROM nginx:stable-alpine

# Remove default nginx static files
RUN rm -rf /usr/share/nginx/html/*

# Copy built files from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]