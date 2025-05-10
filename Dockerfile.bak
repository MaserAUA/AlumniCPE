# Build React app
FROM node:18 as build
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

# Serve using a basic static file server
FROM node:18-alpine
WORKDIR /app
RUN npm install -g http-server
COPY --from=build /app/dist ./dist
EXPOSE 5173
CMD ["http-server", "dist", "-p", "5173"]
