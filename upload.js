const qiniu = require('qiniu');
const package = require('./package.json');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'Q0fr4zgFbp58VmA-vK6PXDVf56c-zCPzJVPTFjiH';
qiniu.conf.SECRET_KEY = 'W2Ju6kTzrHtM4Vq3Vs0aDsrazacPDLWwvAH1cdvQ';

//要上传的空间
const bucket = 'eoapi-database';
//上传到七牛后保存的文件名
// const key = "latest/logo675.png";
//要上传文件的本地路径
// const filePath = "./dist/mac-1.0.0.png";

//构建上传策略函数
const uptoken = (bucket, key) => new qiniu.rs.PutPolicy(bucket + ':' + key).token();

const toLatest = (name) => name.replace(/\d+\.\d+\.\d+/, 'latest');
const onlyName = (name) => name.replace(/dist\//, '');

// 构建客户端实例
const client = new qiniu.rs.Client();

// * 上传单个文件
const uploadFile = (token, file, localFile) =>
  new Promise((resolve) => {
    const extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(token, file, localFile, extra, (err) => {
      return err ? resolve(false) : resolve(true);
    });
  });

// * 删除单个文件
const removeFile = (file) =>
  new Promise((resolve) => {
    client.remove(bucket, file, (err, ret) => {
      return err ? resolve(false) : resolve(true);
    });
  });

// * 拷贝单个文件
const cpFile = (fromFile, toFile) =>
  new Promise((resolve) => {
    client.copy(bucket, fromFile, bucket, toFile, (err) => {
      return err ? resolve(false) : resolve(true);
    });
  });

const version = package.version;
const fileList = ['release/eoapi.Setup.?.exe', 'release/eoapi-?.dmg', 'release/eoapi-?-arm64.dmg'].map((it) =>
  it.replace(/\?/, `${version}`)
);

const app = async () => {
  const uploadResult = await Promise.all(
    fileList.map(async (it) => {
      // * 生成上传 Token
      const token = uptoken(bucket, `${version}/${it.replace(/dist\//, '')}`);
      const isOK = await uploadFile(token, `${version}/${it.replace(/dist\//, '')}`, it);
      return Promise.resolve(isOK || false);
    })
  );
  console.log('上传结果：', uploadResult);
  const deleteResult = await Promise.all(
    fileList.map(async (it) => {
      const isOK = await removeFile(bucket, `latest/${toLatest(onlyName(it))}`);
      Promise.resolve(isOK || false);
    })
  );
  console.log('删除结果：', deleteResult);
  const copyResult = await Promise.all(
    fileList.map(async (it) => {
      const isOK = await cpFile(`${version}/${onlyName(it)}`, `latest/${toLatest(onlyName(it))}`);
      Promise.resolve(!!isOK);
    })
  );
  console.log('拷贝结果', copyResult);
};

app();

// 调用 uploadFile 上传
// uploadFile(
//   uptoken(bucket, "latest/logo675.png"),
//   "latest/logo675.png",
//   filePath
// );
// removeFile(bucket, "latest/logo675.png");
// cpFile("logo.png", "latest/logo.png");
