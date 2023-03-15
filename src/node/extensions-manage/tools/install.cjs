const fs = require('fs');
const config = {
  url: 'https://postcat.com',
  appId: 'postcat-node-server',
  // Postcat backend appKey
  appKey: ''
};
fs.writeFile(
  require('path').join(__dirname, '../config.json'),
  JSON.stringify(config),
  {
    flag: 'w'
  },
  err => {
    if (err) {
      console.error(err);
      return;
    }
  }
);
