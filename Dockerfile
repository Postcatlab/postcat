FROM node:lts-alpine as builder

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