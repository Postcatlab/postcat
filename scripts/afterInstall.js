const fs = require('fs');
const path = require('path');

// 输入文件
const inputPath = path.join(__dirname, '../patches/windowsCodeSign.js');
// 输出文件
const outputPath = path.join(__dirname, '../node_modules/app-builder-lib/out/codeSign/windowsCodeSign.js');

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    return console.error(err);
  }

  fs.writeFile(outputPath, data, { flag: 'w', encoding: 'utf8' }, err => {
    if (err) {
      console.error('app-builder-lib writeFile', err);
    }
  });
});
