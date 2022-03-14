"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appendFile = exports.ensureFile = exports.ensureDir = exports.fileExists = exports.writeFile = exports.readFile = exports.readJson = exports.writeJson = void 0;
var fs = require("fs");
var path = require("path");
/**
 * Write object data into json file.
 * @param file
 * @param data
 */
var writeJson = function (file, data) {
    return (0, exports.writeFile)(file, JSON.stringify(data));
};
exports.writeJson = writeJson;
/**
 * Read json file, then return object.
 * @param file
 */
var readJson = function (file) {
    var data = (0, exports.readFile)(file);
    if ('' === data) {
        return null;
    }
    return JSON.parse(data);
};
exports.readJson = readJson;
/**
 * Read data from file.
 * @param file
 */
var readFile = function (file) {
    try {
        return fs.readFileSync(file).toString();
    }
    catch (e) {
        return '';
    }
};
exports.readFile = readFile;
/**
 * Write data into file.
 * @param file
 * @param data
 */
var writeFile = function (file, data) {
    // check and create dir.
    var dir = path.dirname(file);
    (0, exports.ensureDir)(dir);
    try {
        fs.writeFileSync(file, data);
        return true;
    }
    catch (e) {
        return false;
    }
};
exports.writeFile = writeFile;
/**
 * Check file exists.
 * @param file
 */
var fileExists = function (file) {
    return fs.existsSync(file);
};
exports.fileExists = fileExists;
/**
 * Ensure dir exists and create if not exist.
 * @param name
 */
var ensureDir = function (name) {
    if (fs.existsSync(name)) {
        return true;
    }
    else {
        if ((0, exports.ensureDir)(path.dirname(name))) {
            fs.mkdirSync(name);
            return true;
        }
    }
};
exports.ensureDir = ensureDir;
/**
 * Ensure file exists and create if not exist.
 * @param file
 */
var ensureFile = function (file) {
    try {
        if (!(0, exports.fileExists)(file)) {
            fs.closeSync(fs.openSync(file, 'w'));
        }
    }
    catch (e) {
        throw e;
    }
};
exports.ensureFile = ensureFile;
/**
 * Append data into file.
 * @param file
 * @param data
 */
var appendFile = function (file, data) {
    try {
        fs.appendFileSync(file, data);
    }
    catch (e) {
        throw e;
    }
};
exports.appendFile = appendFile;
//# sourceMappingURL=file.js.map