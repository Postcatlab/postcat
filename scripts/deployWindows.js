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
          if (data.toString().includes('Windows 打包发布完成!')) {
            conn.end();
            process.exit();
          }
        })
        .end(
          [
            'set TERM=msys',
            `export GITHUB_TOKEN=${process.env.GITHUB_TOKEN}`,
            `cd d:/git/postcat`,
            'git reset --hard',
            'git checkout build/windows',
            ...Array.from({ length: 5 }).map(_ => 'git pull'),
            'nvm install 16.19.1',
            'nvm use 16.19.1',
            `
            cat>./scripts/qiniu_env.js<<EOF
            ${process.env.QINIU_ENV_JS}
EOF
            `,
            'yarn install',
            'yarn release',
            'nvm use 12.22.10',
            'echo Windows 打包发布完成!'
          ].join('\r\n')
        );
    });
  })
  .connect({
    host: process.env.SSH_WINDOWS_IP,
    username: process.env.SSH_WINDOWS_USERNAME,
    password: process.env.SSH_WINDOWS_PASSWORD
  });
