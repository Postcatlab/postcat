<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="https://raw.githubusercontent.com/eolinker/eoapi/main/src/assets/icons/128x128.png">
  </a>
</p>

<h1 align="center">EOAPI</h1>
<div align="center">
一个轻量的开源 API 工具
</div>

![](https://raw.githubusercontent.com/eolinker/eoapi/main/wiki/preview_1.png?token=GHSAT0AAAAAABRGKRUBJ634JVP7XL7KWAECYP3J36Q)

[简体中文](README.md)｜[English](README.en.md)

# 功能

⚡ API 测试

- 快速对 API 发起测试
- 支持本地测试

📃 API 管理

- HTTP 协议
- 各种格式请求体：FormData、XML、JSON、Raw

📶 可离线使用

🌐 测试环境管理

🌱 插件集市

# 快速开始

- 访问 [在线示例](https://demo.eoapi.io/) 快速体验产品特性

- 查看 [官方文档](https://www.eoapi.io/docs/about.html) 了解更多功能

- 访问 [Releases](https://github.com/eolinker/eoapi/releases) 下载 Windows、macOS 安装包。

# 源码运行/构建

## 环境

- Node.js，版本大于 14.17.x

## 运行代码

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

### 打包构建

| 命令                         | 描述                         |
| ---------------------------- | ---------------------------- |
| `npm run electron:build`     | 各系统打包 Electron 应用     |
| `npm run electron:build:win` | windows 打包定制化安装包应用 |

### 运行测试

| 命令           | 描述          |
| -------------- | ------------- |
| `npm run test` | 执行单元测试  |
| `npm run e2e`  | 执行 E2E 测试 |

# 协议

This project is licensed under the Apache-2.0 License - see the [LICENSE.md](LICENSE) file for details

# Contact us

If you'd like to contact us, please create a [Github issue](https://github.com/eolinker/eoapi/issues). Thank you!
