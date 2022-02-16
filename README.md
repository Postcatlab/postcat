<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="https://raw.githubusercontent.com/eolinker/eoapi/main/src/assets/icons/128x128.png">
  </a>
</p>
<h1 align="center">EOAPI</h1>
<div align="center">
Easy-to-use API Manage desktop tool
</div>

![](https://raw.githubusercontent.com/eolinker/eoapi/main/wiki/preview_1.png)

[English](README.md)｜[简体中文](README.zh-cn.md)

# Featue

- API Test : Quick API can be tested after installation.
- API management : Management API with zero learning cost.
- Test environment management
- Available offline

# Getting started

<!-- - Try the [live demo](http://eoapi.dev.eolink.com/) -->
- You can download it for Windows, macOS on [Releases](https://github.com/eolinker/eoapi/releases)

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
