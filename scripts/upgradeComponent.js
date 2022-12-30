//If stuck,check yarn.lock file,maybe has conflict
// upgrade.js 
const child_process = require("child_process");
const pkg = require("../src/workbench/browser/package.json");
const filterRegex = /eo-ng-.*/;

const dependencies = pkg["dependencies"];

const dependencyList = Object.keys(dependencies).filter((dependency) => filterRegex.test(dependency));
child_process.execSync(`cd ../src/workbench/browser&&yarn upgrade ${dependencyList.join('@latest ')}`);