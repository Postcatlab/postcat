const IO = require('socket.io');
const WebSocket = require('ws');

const socket = (port = 4301) => {
  const io = new IO.Server(port);
  io.on('connection', (socket) => {
    // send a message to the client
    socket.emit('ws-client', 'link success');
    let ws = null;

    // receive a message from the client
    socket.on('ws-server', ({ type, content }) => {
      if (type === 'connect') {
        return;
      }
      if (type === 'ws-disconnect') {
        ws = null;
        return;
      }
      if (type === 'ws-connect') {
        const { request } = content;
        // console.log(request?.requestHeaders);
        // try {
        //   new WebSocket(request.uri);
        // } catch (error) {
        //   console.log('try to get the error', error);
        // }
        try {
          ws = new WebSocket(request.protocol + request.uri, {
            headers: request?.requestHeaders
              ?.filter((it) => it.name && it.value)
              .reduce(
                (total, { name, value }) => ({
                  ...total,
                  [name]: value,
                }),
                {}
              ),
          });
          ws.on('error', (err) => {
            socket.emit('ws-client', { type: 'ws-connect-back', status: -1, content: err });
          });
        } catch (error) {
          socket.emit('ws-client', { type: 'ws-connect-back', status: -1, content: error });
          ws = null;
          return;
        }

        const reqHeader = ws._req.getHeaders();
        // console.log(ws);

        // 打开WebSocket连接后立刻发送一条消息:
        ws.on('open', () => {
          // console.log(`[CLIENT] open()`);
        });
        ws.on('upgrade', (res) => {
          const { headers: resHeader } = res;
          socket.emit('ws-client', { type: 'ws-connect-back', status: 0, content: { reqHeader, resHeader } });
        });

        ws.on('message', (message) => {
          socket.emit('ws-client', {
            type: 'ws-message-back',
            status: 0,
            content: message,
          });
        });

        ws.on('close', () => {
          socket.emit('ws-client', {
            type: 'ws-message-back',
            status: 1,
            content: 'Server disconnected',
          });
        });
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

module.exports = socket;
