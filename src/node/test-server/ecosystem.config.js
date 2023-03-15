module.exports = {
  apps: [
    {
      name: 'http-server',
      script: 'server/main.js',
      watch: '.'
    },
    {
      name: 'websocket-server',
      script: 'server/socketio.js',
      watch: '.'
    }
  ],
  deploy: {
    production: {}
  }
};
