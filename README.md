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

# Install

You can download it for Windows, macOS on [Releases](https://github.com/eolinker/eoapi/releases)

# Build and run from source

## Prerequisites

- Node.js,version ^14.17

## Run

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

### Test

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run test` | Execute unit tests       |
| `npm run e2e`  | Execute end to end tests |
