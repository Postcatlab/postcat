const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const fs = require('fs');

const genProto = (name, code) => fs.writeFileSync(`./${name}.proto`, code);

const deleteProto = (name) => fs.unlinkSync(`./${name}.proto`);

const grpcFunc = ({ PROTO_PATH, name, url, params }, { next }) => {
  return new Promise((resolve) => {
    const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    });

    const targetClient = grpc.loadPackageDefinition(packageDefinition)[name];
    const client = new targetClient.Greeter(url, grpc.credentials.createInsecure());
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
      PROTO_PATH: `./${random + name}.proto`,
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
