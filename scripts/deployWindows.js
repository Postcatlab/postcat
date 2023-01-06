console.log('确实执行了');

const { Client } = require('ssh2');

const conn = new Client();
conn
  .on('ready', () => {
    console.log('Client :: ready');
    conn.shell((err, stream) => {
      if (err) throw err;

      stream
        .on('close', () => {
          console.log('stream CLOSED');
          conn.end();
          process.exit();
        })
        .on('data', data => {
          console.log(data.toString());
        })
        .end(['set TERM=msys', 'd:', `cd \\git\\postcat`, 'nvm ls', 'exit'].join('\r\n'));
    });
  })
  .connect({
    host: '10.8.0.130',
    username: 'root',
    password: '520123'
  });
