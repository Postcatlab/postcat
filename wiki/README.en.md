<p align="center">
  <a href="https://github.com/eolinker/eoapi">
    <img width="200" src="./images/logo.png">
  </a>
</p>
<h1 align="center">Eoapi</h1>
<div align="center">
A lightweight, extensible API tool
</div>

![](./images/preview_1.png)

English | [简体中文](README.md)

# Getting started

- Try the [live demo](https://demo.eoapi.io/)

- You can download it on [Releases](https://github.com/eolinker/eoapi/releases) available for macOS, Windows

- Read our [document](https://www.eoapi.io/) for more features

# Featue

📃 API Documentation

- HTTP protocol
- Various formats of request body: FormData, XML, JSON, Raw

⚡ API Test

- Quickly test the API
- Test local API

🌐 Test environment management

📶 Available offline

🌱 Extension Marketplace

# Preview Features

💻 Collaboration

🎭 Mock Servers

# Build and run

## Prerequisites

- Node.js >= 14.17.x
- pnpm >= 7.0.0

## Running the code

We use pnpm as a package management tool for development and building, and it is highly recommended that you do the same, but if you want to use npm it's perfectly fine, it just might take a little more time to install dependencies.

```
pnpm install
pnpm start
```

If you want to improve Angular development efficiency, you can install the command-line Angular-cli officially provided by Angular to quickly generate templates such as components and services.

```
pnpm add @angular/cli --global
```

## Command

### Run

| Command               | Description                                                          |
| --------------------- | -------------------------------------------------------------------- |
| `pnpm start`          | In development mode, running on browser and desktop at the same time |
| `pnpm serve:web`      | only runs in the web                                                 |
| `pnpm electron:serve` | only runs in the desktop                                             |

### Build

| Command      | Description                                       |
| ------------ | ------------------------------------------------- |
| `pnpm build` | Packaging Electron applications for each platform |

### Running the tests

| Command     | Description        |
| ----------- | ------------------ |
| `pnpm test` | Execute unit tests |

# License

This project is licensed under the Apache-2.0 License - see the [LICENSE.md](LICENSE) file for details

# Contact us

If you'd like to contact us, please create a [Github issue](https://github.com/eolinker/eoapi/issues). Thank you!
