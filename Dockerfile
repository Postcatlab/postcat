FROM nginx:alpine as production

ENV NODE_ENV production

COPY ./src/workbench/browser/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
