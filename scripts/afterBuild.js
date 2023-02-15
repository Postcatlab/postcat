const fs = require('fs');
const glob = require('glob');
const { resolve } = require('path');

glob.sync(resolve('./release', './*.exe.*')).forEach((item, i) => {
  const newName = item.replace(/ /g, '-');
  fs.rename(item, newName, err => {
    if (err) throw err;
    console.log('Rename complete!');
  });
});
