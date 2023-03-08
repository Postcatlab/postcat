const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const genProto = (name, code) => fs.writeFileSync(`./${name}.proto`, code);

const deleteProto = name => fs.unlinkSync(`./${name}.proto`);

const grpcFunc = ({ PROTO_PATH, packages, service, method, url, params }) => {
  return new Promise(resolve => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true
    });
    const targetClient = packages.split('.').reduce((prev, curr) => prev[curr], grpc.loadPackageDefinition(packageDefinition));

    const client = new targetClient[service](url, grpc.credentials.createInsecure());
    client[method](params, (err, response) => {
      if (err) {
        return resolve([null, err]);
      } else {
        return resolve([response, null]);
      }
    });
  });
};

const grpcClient = async ({ url, packages, service, proto, method, params }) => {
  const random = `${Date.now()}Proto`;
  genProto(random, proto);
  const [res, err] = await grpcFunc({
    PROTO_PATH: `./${random}.proto`,
    url,
    packages,
    params,
    method,
    service
  });
  if (err) {
    deleteProto(random);
    return [null, err];
  }
  deleteProto(random);
  return [res, null];
};

module.exports = grpcClient;
