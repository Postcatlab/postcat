var spawn = require('child_process').spawn;
const extensionMap = new Map();
const path = require('path');
const isElectron = !!process.versions['electron'];
//TODO install locally
const installExtension = (name, version = 'latest') => {
  return new Promise(resolve => {
    const ls = spawn('npm', ['i', '--no-save', `${name}@${version}`]);
    ls.on('close', function (code) {
      // console.log(`child process exited with code :${code}`);
      return resolve(true);
    });
    ls.stderr.on('data', function (data) {
      console.log(`stderr :${data}`);
      return resolve(true);
    });
    ls.stderr.on('error', function (err) {
      console.log(`error :${err}`);
      return resolve(false);
    });
  });
};
const loadExtension = async ({ name, version = 'latest' }) => {
  // * Is extension in Map cache ?
  // * If true, then get the function.
  // * If false, then install the extension and save to map cache then get the function.

  //TODO save version at extensionMap
  const hasIt = extensionMap.has(`${name}:${version}`);
  let cache = {};
  if (!hasIt) {
    //TODO Remote/Local Node Union

    //Install Locally in Electron
    if (isElectron) {
      const extPkg = require(path.join(`${global['__HOME_DIR']}/node_modules/${name}`, 'package.json'));
      const extension = require(`${global['__HOME_DIR']}/node_modules/${name}`);
      if (!extension) {
        return [null, 'Install Extension Failed'];
      }
      cache = {
        extension: extension,
        packageJson: extPkg
      };
      extensionMap.set(`${name}:${version}`, cache);
      return [cache, null];
    }

    //Install in Remote Node
    const isOk = await installExtension(name, version);
    if (!isOk) {
      return [null, 'Install Extension Failed'];
    }

    const extPkg = require(`${name}/package.json`);
    const extension = await import(name);
    cache = {
      extension: extension.default,
      packageJson: extPkg
    };
    extensionMap.set(`${name}:${version}`, cache);
  }
  return [cache, null];
};
module.exports = { loadExtension };
