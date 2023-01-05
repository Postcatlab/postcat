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
const variable = {
  '--NAVBAR_BG': '--nav-background-color',
  '--TIPS_TEXT_COLOR': '--text-secondary-color',
  '--MASK': '--modal-mask-background-color',
  '--SCROLL_BAR': '--scrollbar-thumb-background-color',
  '--SCROLL_BAR_BG': '--scrollbar-track-background-color',
  '--DEFAULT_BORDER_RADIUS': '--border-radius',
  '--BORDER': '--border-color',
  '--NAV_BOTTOM': '--nav-item-border-size',
  '--ICONPARK_SIZE': '--icon-size',
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
  '--BTN_SEC_BG': '--button-default-background-color',
  '--BTN_TEXT': '--button-primary-text-color',
  '--BTN_TEXT_RED': '--button-danger-text-color',
  '--BTN_PRIMARY_TEXT': '--button-primary-text-color',
  '--BTN_PRIMARY_BG': '--button-primary-background-color',
  '--BTN_PRIMARY_BG_HOVER': '--primary-hover-color:',
  '--BTN_LIGHT_BG': '--primary-color',
  '--BTN_LIGHT_BG_HOVER': '--item-hover-background-color',
  '--RED_NORMAL': '--danger-color',
  '--MODAL_SHADOW': '--modal-mask-background-color',
  '--NAVBAR_BTN_BG': '--item-active-background-color',
  '--NAVBAR_BTN_BG_HOVER': '--item-hover-background-color',
  '--NAV_BOTTOM': '--nav-item-border-size',
  '--PADDING': '--padding',
  '--PADDING_X': '--padding-x',
  '--PADDING_Y': '--padding-y',
  '--MARGIN': '--margin',
  '--MR_ICON': '--btn-icon-margin'
};
searchFilesInDirectoryAsync(['../src/workbench/browser/src'], variable);
//Lazy to
setTimeout(() => {
  console.log('Replaced Success!\n', replaceSuccess);
}, 1000);
