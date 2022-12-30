FROM node:lts-alpine as builder

WORKDIR /test-server

# api 测试服务端口
ENV NODE_SERVER_PORT 4201
# websocket 测试服务端口
ENV EOAPI_WEBSOCKET_PORT 4202

COPY /src/workbench/node /test-server

RUN npm config set registry https://registry.npmmirror.com
RUN yarn config set registry https://registry.npmmirror.com
RUN yarn install

EXPOSE $NODE_SERVER_PORT $EOAPI_WEBSOCKET_PORT

CMD ["yarn", "start:all"]


FROM nginx:alpine as production

ENV NODE_ENV production
# 远程服务端口
ENV EOAPI_SERVER_PORT 3000
# api 测试服务端口
ENV NODE_SERVER_PORT 4201
# websocket 测试服务端口
ENV EOAPI_WEBSOCKET_PORT 4202

COPY ./src/workbench/browser/dist/ /usr/share/nginx/html
COPY ./default.conf.template /etc/nginx/templates/

EXPOSE $NODE_SERVER_PORT $EOAPI_WEBSOCKET_PORT
