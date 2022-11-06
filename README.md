<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="./wiki/images/logo.png">
  </a>
</p>
</p>

<h1 align="center">Eoapi</h1>
<div align="center">
一个可拓展的 API 工具，简单（Easy） & 开源（OpenSource）的 API 生态系统
</div>

![](https://docs.eoapi.io/images/eoapi-demo.png)

[English](wiki/README.en.md)｜简体中文

# 快速开始

- 访问 [在线示例](https://eoapi.io/) 快速体验产品特性

- 访问 [Releases](https://github.com/eolinker/eoapi/releases) 下载 Windows、macOS 安装包。

- 查看 [用户使用文档](https://docs.eoapi.io) 了解功能

- 查看 [开发者文档](https://developer.eoapi.io) 开发插件

# 功能

📃 API 文档

- HTTP 协议
- 各种格式请求体：FormData、XML、JSON、Raw

⚡ API 测试

- 快速对 API 发起测试
- 支持本地测试

🎭 Mock
- 模拟文档接口返回值

📶 可离线使用

🌐 测试环境管理

🌱 插件集市

💻  [多人协作](https://docs.eoapi.io/docs/collaborate.html)
- 通过部署云端服务实现多人协作

# 源码运行/构建

## 环境

- Node.js >= 14.17.x
- yarn >= 1.22.x

## 运行代码

我们在开发和构建时使用 [yarn](https://yarnpkg.com/) 作为包管理工具，强烈建议你也这么做，但如果您希望使用 npm 也完全没问题，只是在安装依赖时可能需要多花一些时间。

```
yarn install
yarn start
```

如果想提高开发效率，可以安装 Angular 官方提供的命令行 Angular-cli 快速生成组件、服务等模板。

```
yarn add @angular/cli --global
```

## 命令

### 运行

| 命令                  | 描述                                 |
| --------------------- | ------------------------------------ |
| `yarn start`          | 开发模式下，同时运行在浏览器和桌面端 |
| `yarn serve:web`      | 仅运行在浏览器                       |
| `yarn electron:serve` | 仅运行在桌面端                       |

### 打包构建

| 命令              | 描述                     |
| ----------------- | ------------------------ |
| `sudo yarn build` | 各系统打包 Electron 应用 |

### 运行测试

| 命令        | 描述         |
| ----------- | ------------ |
| `yarn test` | 执行单元测试 |

# 协议

本项目采用 Apache-2.0 协议，可查看 [LICENSE.md](LICENSE) 了解更详细内容。

# 支持我们

如果你觉得项目还不错，记得 Star 支持一下噢！你们的支持对 Eoapi 真的很重要！

# 联系我们

如果想要反馈 Bug、提供产品意见，可以创建一个 [Github issue](https://github.com/eolinker/eoapi/issues) 联系我们，十分感谢！
