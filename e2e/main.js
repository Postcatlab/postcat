const fs = require('fs');
const _ = require('lodash');

function main(data) {
  // console.log(JSON.stringify(data, null, 2));
  data.forEach(({ block, cases }) => {
    cases.forEach((item) => {
      fs.writeFileSync(`./test/${_.snakeCase(block.title + ' ' + item.title)}.t`, item.content);
    });
  });
}

module.exports = main;
