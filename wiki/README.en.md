<p align="center">
  <a href="https://github.com/eolinker/postcat">
    <img width="200" src="./images/logo.png">
  </a>
</p>
<div align="center">
A extensible API tool,Core Lightweight & Open Source API Ecosystem
</div>
<hr>
<p align="center">
  <a href="https://github.com/eolinker/postcat"><img src="https://img.shields.io/github/license/eolinker/postcat?sanitize=true" alt="License"></a>
  <a href="https://github.com/eolinker/postcat/releases"><img src="https://img.shields.io/github/v/release/eolinker/postcat?sanitize=true" alt="Version"></a>
  <a href="https://github.com/eolinker/postcat/releases"><img src="https://img.shields.io/github/downloads/eolinker/postcat/total?sanitize=true" alt="Downloads"></a>
  <a href="https://discord.gg/W3uk39zJCR"><img src="https://img.shields.io/badge/chat-on%20discord-7289da.svg?sanitize=true" alt="Chat"></a>
</p>

English | [简体中文](README.md)

![](https://docs.postcat.com/images/postcat-demo-en.png)

# Try it!

[https://postcat.com](https://postcat.com/)

The data will be stored locally(indexedb) on the web page.I suggest that you should install and try it out for the best demo experience.

# Getting started

- You can download it on [Releases](https://github.com/eolinker/postcat/releases) available for macOS, Windows

- Read our [User Manual](https://docs.postcat.com) for more features
- Read our [developer documentation](https://developer.postcat.com) to develop extensions

# Featue

📃 API Documentation

- HTTP,Websocket protocol
- Various formats of request body: FormData, XML, JSON, Raw,Binary

⚡ API Test

- Quickly test the API
- Test local API

🎭 Mock

- Mock API document response

🌐 Test environment management

📶 Available offline

🌱 Extension Marketplace

🌐 Internationalization

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

# License

This project is licensed under the Apache-2.0 License - see the [LICENSE.md](LICENSE) file for details

# Contact us

If you'd like to contact us, please create a [Github issue](https://github.com/eolinker/postcat/issues). Thank you!
