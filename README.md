# Verilog OJ 前端

## 开发

```sh
cd frontend
```


```sh
npm install . # once
```

```sh
npm run serve
```

会弹出 Webpack 的分析界面（端口 8888），这并不是我们的前端界面

前端界面通过 `http://localhost:8080/` 访问

## 部署

- 第一次部署
    - `sudo docker-compose up --detach`
        - `--detach` Detached mode: Run containers in the background, print new container names.
- 非第一次部署（更新网站内容）
    - `git pull && sudo docker-compose up --detach --build`
        - `--build` Build images before starting containers. 重新构建依赖的images
        - `--detach` Detached mode: Run containers in the background, print new container names.
