const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');
const path = require('path');

const genProto = (name, code) => fs.writeFileSync(path.join(__dirname, `./${name}.proto`), code);

const deleteProto = (name) => fs.unlinkSync(path.join(__dirname, `./${name}.proto`));

const grpcFunc = ({ PROTO_PATH, packages, method, url, params }) => {
  return new Promise((resolve) => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });
    const targetClient = packages
      .split('.')
      .reduce((prev, curr) => prev[curr], grpc.loadPackageDefinition(packageDefinition));

    const client = new targetClient.OpenDlpService(url, grpc.credentials.createInsecure());
    client[method](params, (err, response) => {
      if (err) {
        return resolve([null, err]);
      } else {
        return resolve([response, null]);
      }
    });
  });
};

const grpcClient = async ({ url, packages, proto, method, params }) => {
  const random = `${Date.now()}Proto`;
  genProto(random, proto);
  const [res, err] = await grpcFunc({
    PROTO_PATH: path.join(__dirname, `./${random}.proto`),
    url,
    packages,
    params,
    method,
  });
  if (err) {
    deleteProto(random);
    return [null, err];
  }
  deleteProto(random);
  return [res, null];
};

module.exports = grpcClient;
