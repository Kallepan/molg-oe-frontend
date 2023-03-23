# Stage 1
FROM node:18-alpine as node

WORKDIR /app

COPY . .

RUN npm install 
RUN npm run build --configuration=production

# Stage 2
FROM nginx:alpine

COPY --from=node /app/dist/frontend /usr/share/nginx/html

COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80