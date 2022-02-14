<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="https://raw.githubusercontent.com/eolinker/eoapi/main/src/assets/icons/128x128.png">
  </a>
</p>

<h1 align="center">EOAPI</h1>
<div align="center">
简单易用的开源 API 管理工具
</div>

![](https://raw.githubusercontent.com/eolinker/eoapi/main/wiki/preview_1.png?token=GHSAT0AAAAAABRGKRUBJ634JVP7XL7KWAECYP3J36Q)

[English](README.md)｜[简体中文](README.zh-cn.md)

# 安装

你可以访问 [Releases](https://github.com/eolinker/eoapi/releases) 下载 Windows，macOS 版本的安装包。

# 源码运行/构建

## 环境

- Node.js，版本大于 14.17.x

## 运行

```
npm ci
npm start
```

如果想提高开发效率，可以安装 Angular 官方提供的命令行 Angular-cli 快速生成组件、服务等模板。

```
npm install -g @angular/cli
```

## 命令

### 运行

| 命令                     | 描述                                 |
| ------------------------ | ------------------------------------ |
| `npm start`              | 开发模式下，同时运行在浏览器和桌面端 |
| `npm run ng:serve`       | 仅运行在浏览器                       |
| `npm run electron:serve` | 仅运行在桌面端                       |

### 打包

| 命令                         | 描述                         |
| ---------------------------- | ---------------------------- |
| `npm run electron:build`     | 各系统打包 Electron 应用     |
| `npm run electron:build:win` | windows 打包定制化安装包应用 |

### 测试

| 命令           | 描述          |
| -------------- | ------------- |
| `npm run test` | 执行单元测试  |
| `npm run e2e`  | 执行 E2E 测试 |
