const { spawn } = require('child_process');

const decoder = new TextDecoder('gbk');

const ls = spawn('yarn', ['wininstaller'], {
  // 仅在当前运行环境为 Windows 时，才使用 shell
  shell: process.platform === 'win32'
});

ls.stdout.on('data', data => {
  if (decoder.decode(data).includes('请按任意键继续')) {
    console.log(12);
  }
});
