const IO = require('socket.io');
const WebSocket = require('ws');
const grpcClient = require('./grpc_client.js');

process.on('uncaughtException', err => {
  console.error('uncaughtException', err);
});
const _post = process.env.EOAPI_WEBSOCKET_PORT || 13928;
const socket = (port = _post) => {
  const io = new IO.Server(port, {
    transports: ['websocket']
  });
  console.log(`Websocket Server is running at port ${port} ...`);
  io.on('connection', socket => {
    // * send a message to the client
    socket.emit('ws-client', 'link success');
    let ws = null;

    const unlisten = () => {
      if (!ws) return null;
      ws.on('close', () => null);
      ws.on('upgrade', () => null);
      ws.on('message', () => null);
      ws = null;
    };
    socket.on('grpc-server', async data => {
      // * 创建 grpc 客户端发起请求
      // 端口管理、编译文件、运行插件代码、销毁服务
      const [res, err] = await grpcClient(data);
      socket.emit('grpc-client', [res, err]);
    });
    // receive a message from the client
    socket.on('ws-server', ({ type, content }) => {
      if (type === 'connect') {
        return;
      }
      if (type === 'ws-disconnect') {
        ws.close();
        ws = null;
        return;
      }
      if (type === 'ws-connect') {
        const { request } = content;
        const link = /^(wss:\/{2})|(ws:\/{2})\S+$/m.test(request.uri.trim())
          ? request.uri.trim()
          : request.protocol + '://' + request.uri.trim().replace('//', '');
        try {
          ws = new WebSocket(link, {
            headers: request?.requestParams.headerParams
              ?.filter(it => it.name && it.paramAttr?.example)
              .reduce(
                (total, { name, paramAttr }) => ({
                  ...total,
                  [name]: paramAttr.example
                }),
                {}
              )
          });
        } catch (error) {
          socket.emit('ws-client', { type: 'ws-connect-back', status: -1, content: error });
        }

        ws.on('error', err => {
          socket.emit('ws-client', { type: 'ws-connect-back', status: -1, content: err });
          unlisten();
        });

        const reqHeader = ws._req.getHeaders();

        // 打开WebSocket连接后立刻发送一条消息:
        ws.on('open', () => {
          // console.log(`[CLIENT] open()`);
        });
        ws.on('upgrade', ({ headers: resHeader }) => {
          socket.emit('ws-client', { type: 'ws-connect-back', status: 0, content: { reqHeader, resHeader } });
        });

        ws.on('message', message => {
          socket.emit('ws-client', {
            type: 'ws-message-back',
            status: 0,
            content: message?.toString() || message
          });
        });

        // ws.on('close', () => {
        //   socket.emit('ws-client', {
        //     type: 'ws-connect-back',
        //     status: -1,
        //     content: 'Server disconnected'
        //   });
        //   unlisten();
        // });
      }
      if (type === 'ws-message') {
        const { message } = content;
        if (!message) {
          console.log('发送内容为空');
        }
        ws.send(message);
      }
    });
  });
};

socket(_post);
module.exports = socket;
