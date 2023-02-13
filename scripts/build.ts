import { sign, doSign } from 'app-builder-lib/out/codeSign/windowsCodeSign';
import { build, CliOptions, Packager, Platform, PublishManager } from 'electron-builder';
import type { Configuration } from 'electron-builder';
import minimist from 'minimist';

import { execSync, exec, spawn } from 'node:child_process';
import { copyFileSync } from 'node:fs';
import path from 'node:path';
import { exit, platform } from 'node:process';

// 当前 postcat 版本
const version = process.env.npm_package_version;
// 保存签名时的参数，供签名后面生成的 自定义安装界面 安装包
let signOptions: Parameters<typeof sign>;
// 打包的参数
let buildOptions: CliOptions;
// 参数同 electron-builder cli 命令行参数
const argv = minimist(process.argv.slice(2));
// https://nodejs.org/docs/latest/api/util.html#util_class_util_textdecoder
const decoder = new TextDecoder('gbk');

// 删除 minimist 解析后默认带的 _ 属性，防止 electron-builder 执行报错
Reflect.deleteProperty(argv, '_');

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
    // 'github',
    {
      provider: 'generic',
      url: 'http://192.168.31.196:8080'
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
    // artifactName: '${productName}-${version}.${ext}',
    signDlls: false,
    certificateSubjectName: 'OID.1.3.6.1.4.1.311.60.2.1.3=CN, OID.2.5.4.15=Private Organization',
    target: ['nsis', 'portable'],
    sign(configuration, packager) {
      // console.log('configuration', configuration);
      signOptions = [configuration, packager!];
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
    // target: ['dmg', 'zip']
    target: [
      {
        target: 'default',
        arch: ['x64', 'arm64']
      }
    ]
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

// 要打包的目标平台
const targetPlatform: Platform = {
  darwin: Platform.MAC,
  win32: Platform.WINDOWS,
  linux: Platform.LINUX
}[platform];

// 针对 Windows 签名
const signWindows = async () => {
  // https://docs.github.com/zh/actions/learn-github-actions/variables#default-environment-variables
  if (process.platform !== 'win32' || process.env.GITHUB_ACTIONS) return;

  // 给卸载程序签名
  signOptions[0] = {
    ...signOptions[0],
    path: 'D:\\git\\postcat\\build\\Uninstall Postcat.exe'
  };
  await sign(...signOptions);

  copyFileSync(
    path.join(__dirname, '../build', 'Uninstall Postcat.exe'),
    path.join(__dirname, '../release/win-unpacked', 'Uninstall Postcat.exe')
  );

  const ls = spawn('yarn', ['wininstaller'], {
    // 仅在当前运行环境为 Windows 时，才使用 shell
    shell: process.platform === 'win32'
  });

  ls.stdout.on('data', async data => {
    console.log(decoder.decode(data));
    if (decoder.decode(data).includes('请按任意键继续')) {
      // 给自定义安装包签名
      signOptions[0] = {
        ...signOptions[0],
        path: `D:\\git\\postcat\\release\\Postcat-Setup-${version}.exe`
      };
      await sign(...signOptions);

      // const packager = new Packager(buildOptions);
      // const publishManager = new PublishManager(packager, buildOptions);

      // const publishConfigurations = await publishManager.getGlobalPublishConfigurations();

      // if (publishConfigurations) {
      //   for (const publishConfiguration of publishConfigurations) {
      //     // @ts-ignore
      //     publishManager.scheduleUpload(
      //       publishConfiguration,
      //       {
      //         file: `D:\\git\\postcat\\release\\Postcat-Setup-${version}.exe`,
      //         arch: null
      //       },
      //       packager.appInfo
      //     );
      //   }
      // }
      execSync(`node ./scripts/afterBuild.js`);

      console.log('\x1b[32m', '打包完成🎉🎉🎉你要的都在 release 目录里🤪🤪🤪');
      exit();
    }
  });
};

console.log('打包参数', argv);

Promise.all([
  build({
    config,
    targets: targetPlatform.createTarget(),
    ...argv
  })
])
  .then(async () => {
    await signWindows();
    if (process.platform !== 'win32') {
      exit();
    }
  })
  .catch(error => {
    console.log('\x1b[31m', '打包失败，错误信息：', error);
  });
