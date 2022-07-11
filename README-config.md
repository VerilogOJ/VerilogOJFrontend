# 项目配置

- 设置后端接口地址
    - 修改`nginx-frontend.conf`中的`location ^~ /oj/api/`段的`proxy_pass`修改为后端的部署地址
