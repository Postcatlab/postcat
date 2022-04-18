const fs = require('fs');
const path = require('path');
const _ = require('lodash');

function main(data) {
  // console.log(JSON.stringify(data, null, 2));
  data.forEach(({ block, cases }) => {
    cases.forEach((item) => {
      const _path = path.join(__dirname, `./cases/${_.snakeCase(block.title + ' ' + item.title)}.t`);
      fs.writeFile(_path, item.content, (err) => {
        if (err) {
          return console.log(err);
        }
        console.log(`The file was saved: ${_path}`);
      });
    });
  });
}

module.exports = main;
