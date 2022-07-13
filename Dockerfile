FROM beevelop/nodejs-python:v2021.06.1 as builder

WORKDIR /vue-ui

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build


FROM nginx:1.22.0-alpine as production-build
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /vue-ui/dist /usr/share/nginx/html

EXPOSE 80
ENTRYPOINT ["nginx", "-g", "daemon off;"]