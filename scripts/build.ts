import { sign, doSign, CustomWindowsSign } from 'app-builder-lib/out/codeSign/windowsCodeSign';
import { build, Platform } from 'electron-builder';
import type { Configuration, BuildResult } from 'electron-builder';

import { exec, spawn } from 'node:child_process';
import fs, { copyFileSync } from 'node:fs';
import path from 'node:path';
import { exit, platform } from 'node:process';

let signOptions: Parameters<CustomWindowsSign>;

const runCmd = (cmd, args, callback) => {
  const child = spawn(cmd, args);
  let resp = '';

  child.stdout.on('data', buffer => {
    resp += buffer.toString();
  });
  child.stdout.on('end', () => {
    callback(resp);
  });
};

// mac 系统删除 release 目录
if (process.platform === 'darwin') {
  exec(`rm -r ${path.resolve(__dirname, '../release')}`);
}

// window 系统删除 release 目录
if (process.platform === 'win32') {
  exec(`rd/s/q ${path.resolve(__dirname, '../release')}`);
}

const config: Configuration = {
  appId: '.postcat.io',
  productName: 'Postcat',
  asar: true,
  directories: {
    output: 'release/'
  },
  files: [
    'out/app/**/*.js*',
    'out/platform/**/*.js*',
    'out/environment.js',
    'out/shared/**/*.js*',
    'src/workbench/browser/dist/**/*',
    'out/workbench/browser/src/**/*.js*',
    'out/workbench/node/**/*.js*',
    'out/app/common/**/*',
    '!**/*.ts'
  ],
  publish: [
    'github',
    {
      provider: 'generic',
      url: 'https://packages.postcat.com'
    }
  ],
  generateUpdatesFilesForAllChannels: true,
  nsis: {
    oneClick: false,
    allowElevation: true,
    allowToChangeInstallationDirectory: true,
    // for win - 将协议写入主机的脚本
    include: 'scripts/urlProtoco.nsh'
  },
  protocols: [
    // for macOS - 用于在主机注册指定协议
    {
      name: 'eoapi',
      schemes: ['eoapi']
    }
  ],
  win: {
    icon: 'src/app/common/images/logo.ico',
    verifyUpdateCodeSignature: false,
    signingHashAlgorithms: ['sha256'],
    signDlls: false,
    certificateSubjectName: 'OID.1.3.6.1.4.1.311.60.2.1.3=CN, OID.2.5.4.15=Private Organization',
    target: ['nsis'],
    sign(configuration, packager) {
      console.log('configuration', configuration);
      signOptions = [configuration, packager];
      return doSign(configuration, packager!);
    }
  },
  portable: {
    splashImage: 'src/app/common/images/postcat.bmp'
  },
  mac: {
    icon: 'src/app/common/images/512x512.png',
    hardenedRuntime: true,
    category: 'public.app-category.productivity',
    gatekeeperAssess: false,
    entitlements: 'scripts/entitlements.mac.plist',
    entitlementsInherit: 'scripts/entitlements.mac.plist',
    target: ['dmg', 'zip']
  },
  dmg: {
    sign: false
  },
  afterSign: 'scripts/notarize.js',
  linux: {
    icon: 'src/app/common/images/',
    target: ['AppImage']
  }
};
const targetPlatform: Platform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX
}[platform];

Promise.all([
  build({
    config,
    targets: targetPlatform.createTarget()
  })
])
  .then(async () => {
    console.log('\x1b[32m', '打包完成🎉🎉🎉你要的都在 release 目录里🤪🤪🤪');

    signOptions[0] = {
      ...signOptions[0],
      path: 'D:\\git\\postcat\\build\\Uninstall Postcat.exe'
    };
    // @ts-ignore
    await sign(...signOptions);

    copyFileSync(
      path.join(__dirname, '../build', 'Uninstall Postcat.exe'),
      path.join(__dirname, '../release/win-unpacked', 'Uninstall Postcat.exe')
    );

    exec(`yarn wininstaller`);
    setTimeout(async () => {
      signOptions[0] = {
        ...signOptions[0],
        path: 'D:\\git\\postcat\\release\\Postcat Setup 0.0.1-beta.exe'
      };
      // @ts-ignore
      await sign(...signOptions);
      exit();
    }, 60000);
  })
  .catch(error => {
    console.log('\x1b[31m', '打包失败，错误信息：', error);
  });
