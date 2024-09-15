# FROM bigpapoo/r5a05-nginx:latest

# COPY /ClubMaster-APP/dist/ /usr/share/nginx/html/

FROM nginx:alpine

COPY /ClubMaster-APP/dist/ /usr/share/nginx/html/