FROM node:lts-alpine as builder

WORKDIR /test-server

# api 测试服务端口
ENV NODE_SERVER_PORT 4201
# websocket 测试服务端口
ENV EOAPI_WEBSOCKET_POST 4202

COPY /src/workbench/node /test-server

RUN npm config set registry https://registry.npmmirror.com
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn install

EXPOSE 4201 4202

CMD ["yarn", "start:all"]


FROM nginx:alpine as production

ENV NODE_ENV production

COPY ./src/workbench/browser/dist/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
