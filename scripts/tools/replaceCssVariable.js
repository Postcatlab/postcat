const path = require('path');
const fs = require('fs');
const util = require('util');
const replaceSuccess = [];
const otherVariable = [];
const fsReaddir = util.promisify(fs.readdir);
const fsLstat = util.promisify(fs.lstat);
// Using recursion, we find every file with the desired extention, even if its deeply nested in subfolders.
async function getFilesInDirectoryAsync(dir, ext) {
  let files = [];
  const filesFromDirectory = await fsReaddir(dir).catch(err => {
    throw new Error(err.message);
  });
  for (let file of filesFromDirectory) {
    const filePath = path.join(dir, file);
    const stat = await fsLstat(filePath);

    // If we hit a directory, apply our function to that dir. If we hit a file, add it to the array of files.
    if (stat.isDirectory()) {
      const nestedFiles = await getFilesInDirectoryAsync(filePath, ext);
      files = files.concat(nestedFiles);
    } else {
      if (!ext || path.extname(file) === ext) {
        files.push(filePath);
      }
    }
  }

  return files;
}
function sortByKeylength(data) {
  const result = {};
  const keyArray = Object.keys(data);
  keyArray.sort();
  keyArray.forEach(item => {
    result[item] = data[item];
  });
  return result;
}
async function searchFilesInDirectoryAsync(dirs, filter, ext) {
  let targetFileArr = [];
  for (var i = 0; i < dirs.length; i++) {
    const dir = dirs[i];
    targetFileArr = [...targetFileArr, ...(await getFilesInDirectoryAsync(dir, ext))];
  }
  for (file of targetFileArr) {
    replaceFileContent(file, filter);
  }
}
function replaceFileContent(file, filter) {
  fs.readFile(file, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }
    let result = data;
    for (const key in filter) {
      const v = filter[key];
      const regex = new RegExp(key, 'g');
      let content = result.replace(regex, v);
      //Log succes replace
      if (content !== result && !replaceSuccess.includes(key)) {
        replaceSuccess.push(key);
      }
      result = content;
    }

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}
const variables = {
  '--NAVBAR_BG': '--layout-header-background-color',
  '--TIPS_TEXT_COLOR': '--text-secondary-color',
  '--MASK': '--modal-mask-background-color',
  '--GREEN_NORMAL': '--success-color',
  '--YELLOW_NORMAL': '--warning-colo',
  '--BLUE_NORMAL': '--info-color',
  '--SCROLL_BAR_BG': '--scrollbar-track-background-color',
  '--SCROLL_BAR': '--scrollbar-thumb-background-color',
  '--DEFAULT_BORDER_RADIUS': '--border-radius',
  '--BORDER': '--border-color',
  '--ICONPARK_SIZE': '--icon-size',
  '--BTN_SEC_BG_HOVER': '--bar-background-color',
  '--BAR_BG_COLOR': '--bar-background-color',
  '--DISABLE_BG': '--disabled-background-color',
  '--DISABLE_TEXT': '--disabled-text-color',
  '--MAIN_DISABLED_TEXT': '--disabled-text-color',
  '--MAIN_DISABLED_BORDER': '--disabled-border-color',
  '--MAIN_DISABLED_BG': '--disabled-background-color',
  '--MAIN_THEME_COLOR': '--primary-color',
  '--MAIN_TEXT': '--text-color',
  '--HOVER_BG': '--item-hover-background-color',
  '--BTN_LIGHT_BG_HOVER': '--item-hover-background-color',
  '--MAIN_BG': '--background-color',
  '--DIVIDER': '--divider-color',
  '--BTN_SEC_TEXT': '--button-default-text-color',
  '--BTN_SEC_BG_HOVER': '--bar-background-color',
  '--BTN_SEC_BG': '--button-default-background-color',
  '--BTN_TEXT': '--button-primary-text-color',
  '--BTN_TEXT_RED': '--button-danger-text-color',
  '--BTN_PRIMARY_TEXT': '--button-primary-text-color',
  '--BTN_PRIMARY_BG_HOVER': '--primary-hover-color:',
  '--BTN_PRIMARY_BG': '--button-primary-background-color',
  '--BTN_LIGHT_BG': '--primary-color',
  '--RED_NORMAL': '--danger-color',
  '--MODAL_SHADOW': '--modal-mask-background-color',
  '--NAVBAR_BTN_BG_HOVER': '--item-hover-background-color',
  '--NAVBAR_BTN_BG': '--item-active-background-color',
  '--NAV_BOTTOM': '--menu-item-border-width',
  '--PADDING_X': '--padding-x',
  '--PADDING_Y': '--padding-y',
  '--PADDING': '--padding',
  '--MARGIN': '--margin',
  '--MR_ICON': '--button-icon-margin'
};
searchFilesInDirectoryAsync(['../src/browser/src'], sortByKeylength(variables));
//Lazy to await
setTimeout(() => {
  console.log('Replaced Success!\n', replaceSuccess);
}, 1000);
