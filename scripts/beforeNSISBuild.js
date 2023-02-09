const fs = require('fs');
const path = require('path');

// 模板文件
const inputPath = path.join(__dirname, '../build/SetupScripts/nim/nim_setup.template.nsi');
// 输出文件
const outputPath = path.join(__dirname, '../build/SetupScripts/nim/nim_setup.nsi');

const version = process.env.npm_package_version;

fs.readFile(inputPath, 'utf8', (err, data) => {
  if (err) {
    return console.error('before NSIS build readFile', err);
  }

  let text = data.toString();

  const versionArr = version.split('-');
  versionArr[0] = versionArr[0] + '.0';
  const _version = versionArr.join('-');

  text = text.replace('#{PRODUCT_VERSION}', _version);
  text = text.replace('#{INSTALL_OUTPUT_NAME}', version);

  fs.writeFile(outputPath, text, { flag: 'w', encoding: 'utf8' }, err => {
    if (err) {
      console.error('before NSIS build writeFile', err);
    }
  });
});
