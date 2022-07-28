// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/oj/" : "/",

  assetsDir: "",
  // Used to forward API requests to Django
  // 开发时指定的后端端口 注意不要和正式部署的后端混淆
  devServer: {
    proxy: {
      "/oj/api": {
        target: "http://127.0.0.1/oj/api",
        changeOrigin: true,
        pathRewrite: {
          "^/oj/api": "/",
        },
      },
    },
  },
};
