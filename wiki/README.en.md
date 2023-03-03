# Postcat API Client

![Postcat API Client](http://data.eolinker.com/course/QbLMSaJ7f3dcd0b075a7031b31f8acb486e0a090f1bdc8d.jpeg)

<p align="center"><a href="wiki/README.en.md">English</a> | <span>简体中文</span></p>
<p align="center">
  <a href="https://github.com/Postcatlab/postcat"><img src="https://img.shields.io/github/license/Postcatlab/postcat?sanitize=true" alt="License"></a>
  <a href="https://github.com/Postcatlab/postcat/releases"><img src="https://img.shields.io/github/v/release/Postcatlab/postcat?sanitize=true" alt="Version"></a>
  <a href="https://github.com/Postcatlab/postcat/releases"><img src="https://img.shields.io/github/downloads/Postcatlab/postcat/total?sanitize=true" alt="Downloads"></a>
  <a href="https://discord.gg/W3uk39zJCR"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true" alt="Chat"></a>
</p>

![Postcat UI](https://data.eolink.com/snmSmmg05ae7207eb2ca050d88dc05d1f642136d7d43d5e)

Postcat is a powerful open source, cross-platform (Windows, Mac, Linux, Browsers...) **API development and testing tool** that supports REST, Websocket and other protocols (soon to support GraphQL, gRPC, TCP, UDP), helping you speed up the completion of API Development and testing work.


While ensuring that Postcat is light and flexible, we also designed a powerful plug-in system for Postcat, allowing you to use plug-ins with one click to enhance Postcat's functions.

![Postcat Extensions](https://data.eolink.com/GTTMrJr09aec744ea0f4fa281466fa986ef2ea9a7ce660b)

Therefore, Postcat is theoretically an API product with infinite possibilities. We also visually added a cape to Postcat's cat, representing its infinite possibilities.

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

Learn more：[Github Project](https://github.com/orgs/Postcatlab/projects/3)


</br>

## Bug and Feature Request

If you'd like to contact us, please create a [Github issue](https://github.com/Postcatlab/postcat/issues). Thank you!

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
