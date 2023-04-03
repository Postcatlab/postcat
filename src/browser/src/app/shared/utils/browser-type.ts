/**
 * @description 获取用户浏览器版本及系统信息
 * @param {string='zh-Hans' | 'en'} lang 返回中文的信息还是英文的
 * @constructor
 */
export function getBrowserType() {
  // 权重：系统 + 系统版本 > 平台 > 内核 + 载体 + 内核版本 + 载体版本 > 外壳 + 外壳版本
  const ua = navigator.userAgent.toLowerCase();
  const testUa = regexp => regexp.test(ua);
  const testVs = regexp =>
    ua
      .match(regexp)
      ?.toString()
      .replace(/[^0-9|_.]/g, '')
      .replace(/_/g, '.');
  // 系统
  const system =
    new Map([
      [testUa(/windows|win32|win64|wow32|wow64/g), 'Windows'], // windows系统
      [testUa(/macintosh|macintel/g), 'Macos'], // macos系统
      [testUa(/x11/g), 'linux'], // linux系统
      [testUa(/android|adr/g), 'Android'], // android系统
      [testUa(/ios|iphone|ipad|ipod|iwatch/g), 'IOS'] // ios系统
    ]).get(true) || 'unknow';

  // 系统版本
  const systemVs =
    new Map([
      [
        'windows',
        new Map([
          [testUa(/windows nt 5.0|windows 2000/g), '2000'],
          [testUa(/windows nt 5.1|windows xp/g), 'xp'],
          [testUa(/windows nt 5.2|windows 2003/g), '2003'],
          [testUa(/windows nt 6.0|windows vista/g), 'vista'],
          [testUa(/windows nt 6.1|windows 7/g), '7'],
          [testUa(/windows nt 6.2|windows 8/g), '8'],
          [testUa(/windows nt 6.3|windows 8.1/g), '8.1'],
          [testUa(/windows nt 10.0|windows 10/g), '10']
        ]).get(true)
      ],
      ['macos', testVs(/os x [\d._]+/g)],
      ['android', testVs(/android [\d._]+/g)],
      ['ios', testVs(/os [\d._]+/g)]
    ]).get(system) || 'unknow';

  // 平台
  let platform = 'unknow';
  if (system === 'windows' || system === 'macos' || system === 'linux') {
    platform = $localize`Desktop`; // 桌面端
  } else if (system === 'android' || system === 'ios' || testUa(/mobile/g)) {
    platform = $localize`Mobile`; // 移动端
  }
  // 内核和载体
  const [engine = 'unknow', supporter = 'unknow'] = new Map([
    [
      testUa(/applewebkit/g),
      [
        'Webkit',
        new Map([
          // webkit内核
          [testUa(/safari/g), 'Safari'], // safari浏览器
          [testUa(/chrome/g), 'Chrome'], // chrome浏览器
          [testUa(/opr/g), 'Opera'], // opera浏览器
          [testUa(/edge/g), 'Edge'] // edge浏览器
        ]).get(true)
      ] || 'unknow'
    ], // [webkit内核, xxx浏览器]
    [testUa(/gecko/g) && testUa(/firefox/g), ['gecko', 'Firefox']], // [gecko内核,firefox浏览器]
    [testUa(/presto/g), ['presto', 'opera']], // [presto内核,opera浏览器]
    [testUa(/trident|compatible|msie/g), ['trident', 'IExplore']] // [trident内核,iexplore浏览器]
  ]).get(true) || ['unknow', 'unknow'];

  // 内核版本
  const engineVs =
    new Map([
      ['webkit', testVs(/applewebkit\/[\d._]+/g)],
      ['gecko', testVs(/gecko\/[\d._]+/g)],
      ['presto', testVs(/presto\/[\d._]+/g)],
      ['trident', testVs(/trident\/[\d._]+/g)]
    ]).get(engine) || 'unknow';

  // 载体版本
  const supporterVs =
    new Map([
      ['Firefox', testVs(/firefox\/[\d._]+/g)],
      ['Opera', testVs(/opr\/[\d._]+/g)],
      ['IExplore', testVs(/(msie [\d._]+)|(rv:[\d._]+)/g)],
      ['Edge', testVs(/edge\/[\d._]+/g)],
      ['Safari', testVs(/version\/[\d._]+/g)],
      ['Chrome', testVs(/chrome\/[\d._]+/g)]
    ]).get(supporter) || 'unknow';

  // 外壳和外壳版本
  const [shell = 'none', shellVs = 'unknow'] = new Map([
    [testUa(/micromessenger/g), ['wechat', testVs(/micromessenger\/[\d._]+/g)]], // [微信浏览器,]
    [testUa(/qqbrowser/g), ['qq', testVs(/qqbrowser\/[\d._]+/g)]], // [QQ浏览器,]
    [testUa(/ucbrowser/g), ['uc', testVs(/ucbrowser\/[\d._]+/g)]], // [UC浏览器,]
    [testUa(/qihu 360se/g), ['360', 'unknow']], // [360浏览器(无版本),]
    [testUa(/2345explorer/g), ['2345', testVs(/2345explorer\/[\d._]+/g)]], // [2345浏览器,]
    [testUa(/metasr/g), ['sougou', 'unknow']], // [搜狗浏览器(无版本),]
    [testUa(/lbbrowser/g), ['liebao', 'unknow']], // [猎豹浏览器(无版本),]
    [testUa(/maxthon/g), ['maxthon', testVs(/maxthon\/[\d._]+/g)]] // [遨游浏览器,]
  ]).get(true) || ['none', 'unknow'];

  return {
    [$localize`Engine`]: engine, // 内核: webkit gecko presto trident
    [$localize`Engine Version`]: engineVs, // 内核版本
    // 平台: platform, // 平台: desktop mobile
    [$localize`Platform`]: supporter, // 载体: chrome safari firefox opera iexplore edge
    [$localize`Platform Version`]: supporterVs, // 载体版本
    [$localize`System`]: system, // 系统: windows macos linux android ios
    [$localize`System Version`]: systemVs, // 系统版本

    ...(shell === 'none'
      ? {}
      : {
          [$localize`Shell`]: shell, // 外壳: wechat qq uc 360 2345 sougou liebao maxthon
          [$localize`Shell Version`]: shellVs // 外壳版本
        })
  };
}
