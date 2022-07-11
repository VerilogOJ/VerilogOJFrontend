# 开一个node的image 在`/app/`下用`npm run build`得到`/app/dist/` 可以用于直接部署
FROM node:10.23-alpine AS vuebuild
LABEL maintainer_name="Yang-Xijie"
LABEL maintainer_email="564197835@qq.com"

WORKDIR /app
COPY ./ /app

ARG USE_NPM_MIRROR=no
ARG DELETE_NPM_LOCK=no
ENV DEBIAN_FRONTEND noninteractive

RUN test ${DELETE_NPM_LOCK} = yes \
       && \
       (rm /app/package-lock.json) \
       || \
       (echo "package-lock.json untouched."); \
    test ${USE_NPM_MIRROR} = yes \
       && \
       (npm install . --registry=https://registry.npm.taobao.org --disturl=https://npm.taobao.org/dist) \
       || \
       (echo 'Skipping NPM mirror replacement' && npm install .) \
    && npm run build

# 再开一个nginx的image 将当前目录下的nginx-frontend.conf复制到nginx的配置文件夹下 这样就开始监听端对应口了
FROM nginx:stable-alpine

COPY nginx-frontend.conf /etc/nginx/conf.d/default.conf
# 拷贝到的路径需要和nginx-frontend.conf中的root一致
COPY --from=vuebuild /app/dist/ /usr/share/nginx/html/
