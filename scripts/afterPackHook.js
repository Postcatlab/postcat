//If stuck,check yarn.lock file,maybe has conflict
// upgrade.js
const child_process = require('child_process');
const os = require('os');

exports.default = async function (context) {
  //windows
  if (os.type() == 'Windows_NT') {
    child_process.execSync(`yarn wininstaller`);
  }
};
