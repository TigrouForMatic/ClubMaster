FROM nginx:alpine

COPY /ClubMaster-APP/dist/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf