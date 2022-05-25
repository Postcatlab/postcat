<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="./wiki/images/logo.png">
  </a>
</p>
</p>

<h1 align="center">Eoapi</h1>
<div align="center">
一个轻量、可拓展的 API 工具
</div>

![](./wiki/images/preview_1.png)

[English](wiki/README.en.md)｜简体中文

# 快速开始

- 访问 [在线示例](https://demo.eoapi.io/) 快速体验产品特性

- 查看 [官方文档](https://www.eoapi.io/docs/about.html) 了解更多功能

- 访问 [Releases](https://github.com/eolinker/eoapi/releases) 下载 Windows、macOS 安装包。

# 功能

📃 API 文档

- HTTP 协议
- 各种格式请求体：FormData、XML、JSON、Raw

⚡ API 测试

- 快速对 API 发起测试
- 支持本地测试

📶 可离线使用

🌐 测试环境管理

🌱 插件集市

# 功能预告

💻 多人协作

🎭 Mock 服务

# 源码运行/构建

## 环境

- Node.js >= 14.17.x
- pnpm >= 7.0.0

## 运行代码

我们在开发和构建时使用 [pnpm](https://pnpm.io) 作为包管理工具，强烈建议你也这么做，但如果您希望使用 npm 也完全没问题，只是在安装依赖时可能需要多花一些时间。

```
pnpm install
pnpm start
```

如果想提高开发效率，可以安装 Angular 官方提供的命令行 Angular-cli 快速生成组件、服务等模板。

```
pnpm add @angular/cli --global
```

## 命令

### 运行

| 命令                  | 描述                                 |
| --------------------- | ------------------------------------ |
| `pnpm start`          | 开发模式下，同时运行在浏览器和桌面端 |
| `pnpm serve:web`      | 仅运行在浏览器                       |
| `pnpm electron:serve` | 仅运行在桌面端                       |

### 打包构建

| 命令              | 描述                     |
| ----------------- | ------------------------ |
| `sudo pnpm build` | 各系统打包 Electron 应用 |

### 运行测试

| 命令        | 描述         |
| ----------- | ------------ |
| `pnpm test` | 执行单元测试 |

# 协议

本项目采用 Apache-2.0 协议，可查看 [LICENSE.md](LICENSE) 了解更详细内容。

# 联系我们

如果想要反馈 Bug、提供产品意见，可以创建一个 [Github issue](https://github.com/eolinker/eoapi/issues) 联系我们，十分感谢！
