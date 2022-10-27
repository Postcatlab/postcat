FROM node:lts-alpine as builder

<<<<<<< .merge_file_a23948
ENV 

WORKDIR /eoapi-web

RUN npm set registry https://registry.npmmirror.com

# cache step
COPY package.json /sf-vue-admin/package.json
RUN yarn install
# build
COPY ./ /sf-vue-admin
RUN npm run build:prod

FROM nginx as production
RUN mkdir /web
COPY --from=builder /sf-vue-admin/dist/ /web
COPY --from=builder /sf-vue-admin/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
=======
WORKDIR /test-server

# api 测试服务端口
ENV NODE_SERVER_PORT 4201
# websocket 测试服务端口
ENV EOAPI_WEBSOCKET_POST 4202

COPY /src/workbench/node /test-server

RUN yarn install

EXPOSE 4201
EXPOSE 4202

CMD ["yarn", "start:all"]


FROM nginx:alpine as production

ENV NODE_ENV production

COPY /src/workbench/browser/dist/ /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
>>>>>>> .merge_file_a10144
