<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="https://raw.githubusercontent.com/eolinker/eoapi/main/src/assets/icons/128x128.png">
  </a>
</p>
<h1 align="center">Eoapi</h1>
<div align="center">
A lightweight open source API tool.
</div>

![](https://raw.githubusercontent.com/eolinker/eoapi/main/wiki/preview_1.png)

English | [简体中文](README.zh_CN.md)

# Featue

⚡ API Test

- Quickly test the API
- Test local API

📃 API management

- HTTP protocol
- Various formats of request body: FormData, XML, JSON, Raw

🌐 Test environment management

📶 Available offline

🌱 Extension Marketplace

# Getting started

- Try the [live demo](https://demo.eoapi.io/)

- You can download it on [Releases](https://github.com/eolinker/eoapi/releases) available for macOS, Windows

- Read our [document](https://www.eoapi.io/) for more features

# Build and run from source

## Prerequisites

- Node.js,version ^14.17

## Running the code

```
npm ci
npm start
```

If you want to improve development efficiency, you can install the command-line Angular-cli officially provided by Angular to quickly generate templates such as components and services.

```
npm install -g @angular/cli
```

## Command

### Run

| Command                  | Description                                                          |
| ------------------------ | -------------------------------------------------------------------- |
| `npm start`              | In development mode, running on browser and desktop at the same time |
| `npm run ng:serve`       | only runs in the browser                                             |
| `npm run electron:serve` | only runs in the desktop                                             |

### Build

| Command                      | Description                                                   |
| ---------------------------- | ------------------------------------------------------------- |
| `npm run electron:build`     | Packaging Electron applications for each platform             |
| `npm run electron:build:win` | Packaging install customized installation package for windows |

### Running the tests

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run test` | Execute unit tests       |
| `npm run e2e`  | Execute end to end tests |

# License

This project is licensed under the Apache-2.0 License - see the [LICENSE.md](LICENSE) file for details

# Contact us

If you'd like to contact us, please create a [Github issue](https://github.com/eolinker/eoapi/issues). Thank you!
