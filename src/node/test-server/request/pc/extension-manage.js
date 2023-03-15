var spawn = require('child_process').spawn;
const extensionMap = new Map();
const path = require('path');
const isElectron = !!process.versions['electron'];
const axios = require('axios');

const operateExtension = (name, version = 'latest', operate = 'install') => {
  const args = operate === 'install' ? ['i', '--no-save', `${name}@${version}`] : ['uninstall', '--no-save', name];
  return new Promise(resolve => {
    //TODO install locally at user home dir
    const ls = spawn('npm', args);
    ls.on('close', function (code) {
      // console.log(`child process exited with code :${code}`);
      return resolve(true);
    });
    ls.stderr.on('data', function (data) {
      console.log(`data :${data}`);
      return resolve(true);
    });
    ls.stderr.on('error', function (err) {
      console.log(`stderr :${err}`);
      return resolve(false);
    });
  });
};
let time = 0;
const loadExtension = async ({ name, version = 'latest' }) => {
  //* Chek latest version
  const allExtensionRes = await axios.get('https://extensions.postcat.com/list').catch(error => {});
  const extensionPkgInfo = allExtensionRes?.data?.data.find(val => val.name === name);
  version = extensionPkgInfo.version || version;

  // * Is extension in Map cache ?
  //TODO save version at extensionMap
  const hasIt = extensionMap.has(`${name}:${version}`);

  // * If true, then get the function.
  if (hasIt) {
    return [extensionMap.get(`${name}:${version}`, null)];
  }
  let cache = {};

  // * If false, then install the extension and save to map cache then get the function.
  if (!hasIt) {
    //TODO Remote/Local Node Union
    //* Install Locally in Electron
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

    //* Install in Remote Node
    const isOk = await operateExtension(name, version);
    if (!isOk) {
      return [null, `Install Extension #${name} Failed`];
    }
    try {
      //! Delete require cache
      delete require.cache[require.resolve(name)];

      //* Get the extension pkg instance
      const extPkg = require(`${path.dirname(require.resolve(name))}/package.json`);
      const extension = require(name);
      cache = {
        extension: extension,
        packageJson: extPkg
      };
      extensionMap.set(`${name}:${version}`, cache);
      return [cache, null];
    } catch (e) {
      return [null, `Import Extension #${name} Failed: ${e}`];
    }
  }
};
module.exports = { loadExtension };
