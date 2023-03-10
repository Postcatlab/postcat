const { execSync } = require('child_process');
// get root folder of global node modules
const root = execSync('npm root -g').toString().trim();

const qiniu = require(`${root}/qiniu`);
const package = require('../package.json');
const { AK, SK, bucket } = require('./qiniu_env.js');

qiniu.conf.ACCESS_KEY = AK;
qiniu.conf.SECRET_KEY = SK;

const toLatest = name => name.replace(/\d+\.\d+\.\d+/, 'latest');
const onlyName = name => name.replace(/build\/|release\//, '');

// * 构建客户端实例
const client = new qiniu.rs.Client();

// * 删除单个文件
const removeFile = (spaceName, file) =>
  new Promise(resolve => {
    client.remove(spaceName, file, (err, ret) => (err ? resolve(false) : resolve(true)));
  });

// * 拷贝单个文件
const cpFile = (fromFile, toFile) =>
  new Promise(resolve => {
    client.copy(bucket, fromFile, bucket, toFile, err => (err ? resolve(false) : resolve(true)));
  });

// * If you need to revert, change the version, such as v0.3.0
const version = package.version;
const fileList = [
  'release/Postcat-Setup-?.exe',
  'release/Postcat Setup ?.exe.blockmap',
  'release/Postcat-?-arm64.dmg',
  'release/Postcat-?-arm64-mac.zip',
  'release/Postcat-?.dmg',
  'release/Postcat-?-mac.zip',
  'release/Postcat-?.AppImage',
  'release/latest.yml',
  'release/latest-linux.yml',
  'release/latest-mac.yml'
].map(it => it.replace(/\?/, `${version}`));

const main = async () => {
  const deleteResult = await Promise.all(
    fileList.map(async it => {
      const isOK = await removeFile(bucket, `download/latest/${toLatest(onlyName(it))}`);
      return Promise.resolve(isOK || false);
    })
  );
  console.log('删除latest文件结果', deleteResult);
  const copyFile = await Promise.all(
    fileList.map(async it => {
      const isOK = await cpFile(`download/${version}/${onlyName(it)}`, `download/latest/${toLatest(onlyName(it))}`);
      return Promise.resolve(isOK || false);
    })
  );
  console.log('拷贝latest文件结果', copyFile);
  const copyYml = await Promise.all(
    fileList.map(async it => {
      const isOK = await cpFile(`download/${version}/${onlyName(it)}`, `download/latest/${onlyName(it)}`);
      return Promise.resolve(isOK || false);
    })
  );
  console.log('拷贝版本文件结果', copyYml);
};

main();
