![](https://raw.githubusercontent.com/eolinker/eoapi/main/src/assets/icons/128x128.png?token=GHSAT0AAAAAABRGKRUA6EOYNPFMLMC747IQYP3KNNA)

<h1 align="center">EOAPI</h1>
<div align="center">
Easy-to-use API testing desktop tool
</div>

![](https://raw.githubusercontent.com/eolinker/eoapi/main/wiki/preview_1.png?token=GHSAT0AAAAAABRGKRUA6EOYNPFMLMC747IQYP3KNNA)

[English](README.md)｜[简体中文](README.zh-cn.md)

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
| `npm run web:build`          | Packaging Web applications                                    |

### Test

| Command        | Description              |
| -------------- | ------------------------ |
| `npm run test` | Execute unit tests       |
| `npm run e2e`  | Execute end to end tests |

![](https://raw.githubusercontent.com/eolinker/eoapi/main/src/assets/icons/128x128.png?token=GHSAT0AAAAAABRGKRUAKZLRZZKLCCWSV7GAYP3JYZA)

<h1 align="center">EOAPI</h1>
<div align="center">
Open source API Test desktop tool
</div>

![](https://raw.githubusercontent.com/eolinker/eoapi/main/wiki/preview_1.png?token=GHSAT0AAAAAABRGKRUBJ634JVP7XL7KWAECYP3J36Q)

[English](README.md)｜[简体中文](README.zh-cn.md)

# 源码运行/构建

## 环境

- Node.js，版本大于 14.17.x

## 运行

```
npm ci
npm start
```

如果想提高开发效率，可以安装 Angular 官方提供的命令行 Angular-cli 快速生成组件、服务等模板。

```
npm install -g @angular/cli
```

## 命令

### 运行

| 命令                     | 描述                                 |
| ------------------------ | ------------------------------------ |
| `npm start`              | 开发模式下，同时运行在浏览器和桌面端 |
| `npm run ng:serve`       | 仅运行在浏览器                       |
| `npm run electron:serve` | 仅运行在桌面端                       |

### 打包

| 命令                         | 描述                         |
| ---------------------------- | ---------------------------- |
| `npm run electron:build`     | 各系统打包 Electron 应用     |
| `npm run electron:build:win` | windows 打包定制化安装包应用 |
| `npm run web:build`          | 打包 Web 代码                |

### 测试

| 命令           | 描述          |
| -------------- | ------------- |
| `npm run test` | 执行单元测试  |
| `npm run e2e`  | 执行 E2E 测试 |
