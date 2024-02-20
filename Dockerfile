# Stage 1: Build an Angular Docker Image
FROM node:16.13.0 as build
WORKDIR /app
COPY package*.json /app/
RUN npm install --legacy-peer-deps
COPY . /app
ARG configuration=production
RUN npm run build -- --outputPath=./dist/out --configuration $configuration
# Stage 2, use the compiled app, ready for production with Nginx
FROM nginx
COPY --from=build /app/dist/out/ /usr/share/nginx/html/issuance
COPY /deps/nginx.conf /etc/nginx/conf.d/default.conf
