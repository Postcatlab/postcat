module.exports = {
  // 指定浏览器尺寸
  windowSize: [1280, 920],
  // 用于指定浏览器，默认 chromium
  use: ['chromium'],
  // 用于指定是否无 UI，默认为 false
  headless: false,
  // 是否打开开发者工具？默认为 false
  devtools: false,
  // 用于指定截图保存的位置
  captureUrl: './imgs',
  // 用于指定视频输出的位置
  video: false,
  videoUrl: './videos',
  // 用于指定 Gif 输出的位置
  gifUrl: './gif',
  successDoc: false,
  // 用于指定是否生成失败的操作文档，会包括描述和截图
  failDoc: false,
  elements: {
    img: ['eo-iconpark-icon']
  }
};
