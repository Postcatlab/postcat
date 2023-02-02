const qiniu = require('qiniu');
const YAML = require('yaml');
const fs = require('fs');
const { AK, SK, bucket } = require('./qiniu_env.js');
const package = require('./package.json');

qiniu.conf.ACCESS_KEY = AK;
qiniu.conf.SECRET_KEY = SK;

// * 构建上传策略函数
const uptoken = (bucket, key) => new qiniu.rs.PutPolicy(bucket + ':' + key).token();

const toLatest = name => name.replace(/\d+\.\d+\.\d+/, 'latest');
const onlyName = name => name.replace(/release\//, '');

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
    client.remove(spaceName, file, (err, ret) => {
      return err ? resolve(false) : resolve(true);
    });
  });

// * 拷贝单个文件
const cpFile = (fromFile, toFile) =>
  new Promise(resolve => {
    client.copy(bucket, fromFile, bucket, toFile, err => {
      return err ? resolve(false) : resolve(true);
    });
  });

const version = package.version;
const fileList = [
  'release/Postcat-Setup-?.exe',
  'release/Postcat-?.dmg',
  'release/Postcat-?-arm64.dmg',
  'release/Postcat-?-mac.zip',
  'release/latest.yml',
  'release/latest-mac.yml'
].map(it => it.replace(/\?/, `${version}`));
// const fileList = ['releass/postcat-Setup-?.png', 'releass/postcat-?.png', 'releass/postcat-?-arm64.png'].map((it) =>
//   it.replace(/\?/, `${version}`)
// );

const app = async () => {
  const uploadResult = await Promise.all(
    fileList.map(async it => {
      let isOK;
      // * 生成上传 Token
      // try {
      //   if (it.endsWith('.yml')) {
      //     const ymlObj = YAML.parse(fs.readFileSync(it, 'utf8'));
      //     ymlObj.files.forEach(n => (n.url = `${ymlObj.version}/${n.url}`));
      //     ymlObj.path = `${ymlObj.version}/${ymlObj.path}`;
      //     fs.writeFileSync(it, YAML.stringify(ymlObj));
      //     await removeFile(bucket, onlyName(it));
      //     const token = uptoken(bucket, onlyName(it));
      //     isOK = await uploadFile(token, onlyName(it), it);
      //   } else {
      const token = uptoken(bucket, `${version}/${it.replace(/release\//, '')}`);
      isOK = await uploadFile(token, `${version}/${it.replace(/release\//, '')}`, it);
      // }
      // } catch (error) {
      //   console.log('error', error);
      // }
      return Promise.resolve(isOK || false);
    })
  );
  console.log('上传结果：', uploadResult);
  const deleteResult = await Promise.all(
    fileList.map(async it => {
      const isOK = await removeFile(bucket, `latest/${toLatest(onlyName(it))}`);
      Promise.resolve(isOK || false);
    })
  );
  console.log('删除结果：', deleteResult);
  const copyResult = await Promise.all(
    fileList.map(async it => {
      const isOK = await cpFile(`${version}/${onlyName(it)}`, `latest/${toLatest(onlyName(it))}`);
      Promise.resolve(isOK || false);
    })
  );
  console.log('拷贝结果', copyResult);
};

app();
