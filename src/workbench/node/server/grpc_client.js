const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');

const genProto = (name, code) => fs.writeFileSync(path.join(__dirname, `./${name}.proto`), code);

const deleteProto = (name) => fs.unlinkSync(path.join(__dirname, `./${name}.proto`));

const grpcFunc = ({ PROTO_PATH, name, url, params }, { next }) => {
  return new Promise((resolve) => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const targetClient = name
      .split('.')
      .reduce((prev, curr) => prev[curr], grpc.loadPackageDefinition(packageDefinition));
    // service OpenDlpService{
    //   // API文档中的敏感API扫描
    //   rpc SensitiveAPIScan(SensitiveAPIScanRequest) returns (SensitiveAPIScanResponse) {};
    // }

    const client = new targetClient.OpenDlpService(url, grpc.credentials.createInsecure());
    if (next) {
      next(client, resolve);
      return;
    }
  });
};

const grpcClient = async ({ url, name, proto, params }, func) => {
  const random = Date.now();
  genProto(`./${random + name}`, proto);
  const [res, err] = await grpcFunc(
    {
      PROTO_PATH: path.join(__dirname, `./${random + name}.proto`),
      url,
      name,
      params,
    },
    func
  );
  if (err) {
    deleteProto(`./${random + name}`);
    return [null, err];
  }
  deleteProto(`./${random + name}`);
  return res;
};

module.exports = grpcClient;
