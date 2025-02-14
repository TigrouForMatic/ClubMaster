# Utiliser Node 18 ou supérieur qui inclut crypto par défaut
FROM node:18-alpine as build
WORKDIR /app
COPY ./ClubMaster-APP/package*.json ./
RUN npm install
COPY ./ClubMaster-APP .
RUN npm run build

# Configuration Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf