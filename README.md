# Verilog OJ 前端

> 以`Ubuntu server 20.04`为例

## 开发

```sh
sudo apt update && sudo apt upgrade # once
sudo apt install nodejs npm # once
```

```sh
git clone git@git.tsinghua.edu.cn:eeverilogoj/verilogojfrontend.git
cd verilogojfrontend
```

```sh
npm install . # once
```

```sh
npm run serve
```

会弹出 Webpack 的分析界面（端口 8888），这并不是我们的前端界面

前端界面通过 `http://localhost:8080/` 访问

## 生产

### 设置

在`nginx-frontend.conf`中 `location ^~ /oj/api/`字段 `proxy_pass`处填写后端的api路径

### 部署

- 第一次部署
    - `sudo docker-compose up --detach`
        - `--detach` Detached mode: Run containers in the background, print new container names.
- 非第一次部署（更新网站内容）
    - `git pull && sudo docker-compose up --detach --build`
        - `--build` Build images before starting containers. 重新构建依赖的images
        - `--detach` Detached mode: Run containers in the background, print new container names.

### 成功部署

- 访问<http://166.111.223.67:80/>即可看到网页
- `sudo docker ps` 可以看到有image为`verilogojfrontend_web`的容器在跑

## Open Source Projects

- [YAVGroup/Verilog-OJ](https://github.com/YAVGroup/Verilog-OJ) [AGPL-3.0 license](https://github.com/YAVGroup/Verilog-OJ/blob/master/LICENSE)
- [libreliu/pyDigitalWaveTools](https://github.com/libreliu/pyDigitalWaveTools) [MIT license](https://github.com/libreliu/pyDigitalWaveTools/blob/master/LICENSE)
