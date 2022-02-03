# EOAPI

离线可用的 API 测试桌面端工具

[English](README.md)｜[简体中文](README.zh-cn.md)

[快速体验]
[下载安装]

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

| 命令                       | 描述                 |
| ------------------------ | ------------------ |
| `npm start`              | 开发模式下，同时运行在浏览器和桌面端 |
| `npm run ng:serve`       | 仅运行在浏览器            |
| `npm run electron:serve` | 仅运行在桌面端            |

### 打包

| 命令                           | 描述                  |
| ---------------------------- | ------------------- |
| `npm run electron:build`     | 各系统打包 Electron 应用   |
| `npm run electron:build:win` | windows 系统打包主题安装包应用 |
| `npm run web:build`          | 打包 Web 代码           |

### 测试

| 命令             | 描述       |
| -------------- | -------- |
| `npm run test` | 执行单元测试   |
| `npm run e2e`  | 执行 E2E测试 |
