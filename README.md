# Postcat API 客户端（Client）

![Postcat API Client](http://data.eolinker.com/course/QbLMSaJ7f3dcd0b075a7031b31f8acb486e0a090f1bdc8d.jpeg)
<p align="center"><a href="wiki/README.en.md">English</a> | <span>简体中文</span></p>

Postcat 是一个强大的开源、跨平台（Windows、Mac、Linux、Browsers...）的 API 开发测试工具，支持 REST、Websocket 等协议（即将支持 GraphQL、gRPC、TCP、UDP），帮助你加速完成API开发和测试工作。

我们在保证 Postcat 轻巧灵活的同时，还为 Postcat 设计了一个强大的插件系统，让你一键使用其他人开发好的插件来增强 Postcat 的功能，或者自行开发 Postcat 插件，因此 Postcat 理论上是一个拥有无限可能的 API 产品，我们也形象地为 Postcat 的猫咪加上了一件披风，代表它的无限可能。

</br>

![Postcat UI](http://data.eolinker.com/course/7UYEmJb7b87f58cc42b9528058c673ff41bd96da6a77d71.png)

![Postcat Extensions](http://data.eolinker.com/course/Q9jIAtIc498a3fa46199654df2ffb7b4fdb48b2ebb88ba3.png)

## 下载和在线使用

Postcat 现在已经支持 Windows、Mac、Linux等系统，你可以通过以下地址访问并下载。同时我们也提供了 Web 端，方便你在任何浏览器上使用。

**[https://postcat.com/](https://postcat.com//)**

如果你试用之后觉得不错，请给我们的猫咪一个 Star 和 Fork~ 你的支持是我们不断改进产品的动力！

## 功能特性和迭代计划（Roadmap）

- 🚀 多协议支持
-- 已实现：HTTP REST、Websocket
-- 即将实现：GraphQL、TCP、UDP、gRPC
- 📕 API 文档
- ✨ API 设计
- ⚡ API 测试
- 🎭 Mock
- 🙌 团队协作
- 🎈 文档分享
- 🗺 环境
- 🧶 全局变量
- 🧩 自定义主题风格
- 🌐 多语言支持：中文、English

了解更多具体迭代计划：[Github Project](https://github.com/orgs/eolinker/projects/1/views/16)

## Bug 和需求反馈

如果想要反馈 Bug、提供产品意见，可以创建一个 [Github issue](https://github.com/eolinker/postcat/issues) 联系我们，十分感谢！

如果你希望和 Postcat 团队近距离交流，讨论产品使用技巧以及了解更多产品最新进展，欢迎加入以下渠道。

- QQ群号码：981965807
- QQ群链接：[加入Postcat 用户群](https://jq.qq.com/?_wv=1027&k=Kej1qTUy)

- 微信群：

![](http://data.eolinker.com/course/NKhRRF668370911c8b8ea8a0887b5d62e71b0f1a22ad76a.png)

## 文档

[Postcat 文档](https://docs.postcat.com/)

## 开发 Postcat

<details>
<summary>运行代码</summary>

</br>

请确保你已经部署好所需的开发环境：

- Node.js >= 14.17.x
- yarn >= 1.22.x

我们在开发和构建时使用 yarn 作为包管理工具，强烈建议你也这么做，但如果您希望使用 npm 也完全没问题，只是在安装依赖时可能需要多花一些时间。

### 运行桌面端程序

```shell
yarn install
yarn start
```

### 运行浏览器程序

```shell
cd src/workbench&&npm install
yarn start
```

### 提高效率

如果想提高开发效率，可以安装 Angular 官方提供的命令行 Angular-cli 快速生成组件、服务等模板。

```
yarn add @angular/cli --global
```

</details>

<details>
<summary>内置命令</summary>

### 运行命令

|命令				|描述									|
| ------------ | ------------ |
|yarn start			|开发模式下，同时运行在浏览器和桌面端	|
|yarn start:web		|仅运行在浏览器,同时开启后端代理		|
|yarn start:electron|仅运行在桌面端							|

### 打包构建

|命令			|描述						|
| ------------ | ------------ |
|sudo yarn build|各系统打包 Electron 应用	|

### 运行测试

|命令		|描述			|
| ------------ | ------------ |
|yarn test	|执行单元测试	|

</details>
