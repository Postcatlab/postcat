# Postcat API Client

![Postcat API Client](http://data.eolinker.com/course/QbLMSaJ7f3dcd0b075a7031b31f8acb486e0a090f1bdc8d.jpeg)
<p align="center"><span>English</span> | <a href="/README.md">简体中文</a></p>

Postcat is a powerful open source, cross-platform (Windows, Mac, Linux, Browsers...) API development and testing tool that supports REST, Websocket and other protocols (soon to support GraphQL, gRPC, TCP, UDP), helping you speed up the completion of API Development and testing work.

While ensuring that Postcat is light and flexible, we also designed a powerful plug-in system for Postcat, allowing you to use plug-ins developed by others to enhance Postcat's functions with one click, or develop Postcat plug-ins by yourself, so Postcat is theoretically a As an API product with infinite possibilities, we also visually added a cape to Postcat's cat, representing its infinite possibilities.

</br>

![Postcat UI](http://data.eolinker.com/course/7UYEmJb7b87f58cc42b9528058c673ff41bd96da6a77d71.png)

![Postcat Extensions](http://data.eolinker.com/course/Q9jIAtIc498a3fa46199654df2ffb7b4fdb48b2ebb88ba3.png)

## Download and use online

Postcat now supports Windows, Mac, Linux and other systems, you can access and download it through the following address. At the same time, we also provide a web terminal, which is convenient for you to use on any browser.

**[https://postcat.com/](https://postcat.com//)**

If you feel good after trying it out, please give our cat a Star and Fork~ Your support is our motivation to keep improving our products!

## Roadmap

- 🚀 Multi-protocol support
-- Implemented: HTTP REST, Websocket
-- Coming soon: GraphQL, TCP, UDP, gRPC
- 📕 API Documentation
- ✨ API Design
- ⚡ API Test
- 🎭 Mock
- 🙌 Collaboration
- 🎈 Document Sharing
- 🗺 Environment
- 🧶 Global variables
- 🧩 Custom theme style
- 🌐 Multilingual support: Chinese, English

Learn more：[Github Project](https://github.com/orgs/eolinker/projects/1/views/16)

## Bug and Feature Request

If you'd like to contact us, please create a [Github issue](https://github.com/eolinker/postcat/issues). Thank you!

## Document

[Postcat User Document](https://docs.postcat.com/)

# Build and run

## Prerequisites

- Node.js >= 14.17.x
- yarn >= 1.22.x

## Running the code

We use yarn as a package management tool for development and building, and it is highly recommended that you do the same, but if you want to use npm it's perfectly fine, it just might take a little more time to install dependencies.

```
yarn install
yarn start
```

If you want to improve Angular development efficiency, you can install the command-line Angular-cli officially provided by Angular to quickly generate templates such as components and services.

```
yarn add @angular/cli --global
```

## Command

### Run

| Command               | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `yarn start`          | In development mode, running on browser and desktop at the same time |
| `yarn serve:web`      | only runs in the web                                                 |
| `yarn electron:serve` | only runs in the desktop                                             |

### Build

| Command      | Description                                       |
| ------------ | ------------------------------------------------- |
| `yarn build` | Packaging Electron applications for each platform |

### Running the tests

| Command     | Description        |
| ----------- | ------------------ |
| `yarn test` | Execute unit tests |
