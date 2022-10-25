FROM node:lts-alpine as builder

RUN mkdir /test-server

WORKDIR /test-server

COPY /src/workbench/node /test-server

RUN yarn install

EXPOSE 4201

CMD ["yarn", "dev"]


FROM nginx:alpine as production

ENV NODE_ENV production

COPY /src/workbench/browser/dist/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
