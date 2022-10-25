

FROM nginx:alpine as production

COPY ${webWorkdir}/dist/ /usr/share/nginx/html
COPY ${workdir}/nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
