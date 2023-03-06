const qiniu = require('qiniu');
const { promises } = require('fs');
const { AK, SK, bucket } = require('./qiniu_env.js');
const package = require('../package.json');

qiniu.conf.ACCESS_KEY = AK;
qiniu.conf.SECRET_KEY = SK;

// * 构建上传策略函数
const uptoken = (bucket, key) => new qiniu.rs.PutPolicy(bucket + ':' + key).token();

const toLatest = name => name.replace(/\d+\.\d+\.\d+/, 'latest');
const onlyName = name => name.replace(/build\/|release\//, '');

// * 检测文件是否存在
const isExists = async filePath =>
  await promises
    .access(filePath)
    .then(() => true)
    .catch(_ => false);

// * 构建客户端实例
const client = new qiniu.rs.Client();

// * 上传单个文件
const uploadFile = (token, file, localFile) =>
  new Promise(resolve => {
    const extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, file, localFile, extra, err => {
      console.log(err ? err : 'success');
      return err ? resolve(false) : resolve(true);
    });
  });

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
// const fileList = ['releass/postcat-Setup-?.png', 'releass/postcat-?.png', 'releass/postcat-?-arm64.png'].map((it) =>
//   it.replace(/\?/, `${version}`)
// );

const main = async () => {
  const uploadResult = await Promise.all(
    fileList
      .filter(async it => await isExists(it))
      .map(async it => {
        // * 生成上传 Token
        const token = uptoken(bucket, `download/${version}/${onlyName(it)}`);
        const isOK = await uploadFile(token, `download/${version}/${onlyName(it)}`, it);
        return Promise.resolve(isOK || false);
      })
  );
  console.log('上传结果：', uploadResult);
};

main();
