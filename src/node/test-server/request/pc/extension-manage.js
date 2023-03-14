var spawn = require('child_process').spawn;
const extensionMap = new Map();
const path = require('path');
const isElectron = !!process.versions['electron'];
//TODO install locally
const installExtension = (extension, version = 'latest') => {
  return new Promise(resolve => {
    const ls = spawn('npm', ['i', `${extension}@${version}`]);
    ls.on('close', function (code) {
      console.log('child process exited with code ' + code);
      return resolve(true);
    });
    ls.stderr.on('data', function (data) {
      console.log('stderr: ' + data);
      return resolve(true);
    });
    ls.stderr.on('error', function (err) {
      console.log('error: ' + err);
      return resolve(false);
    });
  });
};
const loadExtension = async ({ name, version = 'latest' }) => {
  // * Is extension in Map cache ?
  // * If true, then get the function.
  // * If false, then install the extension and save to map cache then get the function.
  const hasIt = extensionMap.has(`${name}:${version}`);
  let cache = {};
  if (!hasIt) {
    //TODO Remote/Local Node Union
    //Local Node
    if (isElectron) {
      const extPkg = require(path.join('/Users/qinyuanyuan/.postcat/node_modules/postcat-basic-auth', 'package.json'));
      cache = {
        extension: require('/Users/qinyuanyuan/.postcat/node_modules/postcat-basic-auth'),
        packageJson: extPkg
      };
      extensionMap.set(`${name}:${extPkg.version}`, cache);
      return [cache, null];
    }

    //Remote Node
    const isOk = await installExtension(name, version);
    if (!isOk) {
      return [null, 'Install Extension Failed'];
    }

    const extPkg = await import(`${name}/package.json`, {
      assert: {
        type: 'json'
      }
    });
    const extension = await import(name);
    cache = {
      extension: extension.default,
      packageJson: extPkg.default
    };
    extensionMap.set(`${name}:${extPkg.version}`, cache);
  }
  return [cache, null];
};
module.exports = { loadExtension };
