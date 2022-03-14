"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MODULE_DIR = exports.DATA_DIR = exports.HOME_DIR = void 0;
var electron_1 = require("electron");
var path = require("path");
var home = electron_1.app.getPath('home');
var HOME_DIR = path.join(home, '.eo');
exports.HOME_DIR = HOME_DIR;
var DATA_DIR = path.join(HOME_DIR, 'data');
exports.DATA_DIR = DATA_DIR;
var MODULE_DIR = HOME_DIR;
exports.MODULE_DIR = MODULE_DIR;
//# sourceMappingURL=main.js.map