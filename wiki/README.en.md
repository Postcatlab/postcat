<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="./images/logo.png">
  </a>
</p>
<h1 align="center">Eoapi</h1>
<div align="center">
A extensible API tool,Easy & Open Source API Ecosystem
</div>

![](https://docs.eoapi.io/images/eoapi-demo-en.png)

English | [简体中文](README.md)

# Getting started

- Try the [live demo](https://demo.eoapi.io/)

- You can download it on [Releases](https://github.com/eolinker/eoapi/releases) available for macOS, Windows

- Read our [User Manual](https://docs.eoapi.io) for more features
- Read our [developer documentation](https://developer.eoapi.io) to develop extensions

# Featue

📃 API Documentation

- HTTP protocol
- Various formats of request body: FormData, XML, JSON, Raw

⚡ API Test

- Quickly test the API
- Test local API

🎭 Mock
- Mock document interface return value

🌐 Test environment management

📶 Available offline

🌱 Extension Marketplace

💻  [Collaboration](https://docs.eoapi.io/docs/collaborate.html)
- Collaboration via [self-hosted cloud server](https://github.com/eolinker/eoapi-remote-server)

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

If you'd like to contact us, please create a [Github issue](https://github.com/eolinker/eoapi/issues). Thank you!
