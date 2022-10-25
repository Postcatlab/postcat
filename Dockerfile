FROM nginx:alpine as production

ENV NODE_ENV production

COPY /src/workbench/browser/dist/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
