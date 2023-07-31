import { Configuration } from 'electron-builder';

import { COMMON_APP_CONFIG } from '../src/environment';

export const ELECTRON_BUILD_CONFIG: Configuration = {
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
    'src/browser/dist/**/*',
    'out/browser/src/**/*.js*',
    'out/node/test-server/**/*.js*',
    'out/app/common/**/*',
    '!**/*.ts'
  ],
  publish: [
    'github',
    {
      provider: 'generic',
      url: COMMON_APP_CONFIG.BASE_DOWNLOAD_URL
    }
  ],
  generateUpdatesFilesForAllChannels: true,
  nsis: {
    // 指定guid，此guid会存放在注册表中，如果没有指定则系统会自动生成
    guid: 'Postcat',
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
  portable: {
    splashImage: 'src/app/common/images/postcat.bmp'
  },
  dmg: {
    sign: false
  },
  afterSign: 'scripts/notarize.js',
  linux: {
    icon: 'src/app/common/images/',
    target: ['AppImage']
  },
  mac: {
    icon: 'src/app/common/images/512x512.png',
    hardenedRuntime: true,
    category: 'public.app-category.productivity',
    gatekeeperAssess: false,
    entitlements: 'scripts/entitlements.mac.plist',
    entitlementsInherit: 'scripts/entitlements.mac.plist',
    target: [
      {
        target: 'default',
        arch: ['x64', 'arm64']
      }
    ]
  }
};
