/**
 * Postcat function
 */
const loadExtension = require('./extension-manage.js');
const getRequestDataByAuth = async (authInfo = {}) => {
  switch (authInfo.authType) {
    case 'none': {
      break;
    }
    default: {
      const [{ extension, packageJson }, err] = await loadExtension({
        name,
        version
      });
      console.log(extension);
    }
  }
};

module.exports = {
  getRequestDataByAuth
};
