"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModuleHandler = void 0;
var path = require("path");
var cross_spawn_1 = require("cross-spawn");
var util_1 = require("../../common/util");
/**
 * 本地模块管理器
 * @class ModuleHandler
 */
var ModuleHandler = /** @class */ (function () {
    function ModuleHandler(options) {
        this.baseDir = options.baseDir;
        this.registry = options.registry;
        this.proxy = options.proxy;
        var packageJsonFile = path.join(this.baseDir, 'package.json');
        if (!(0, util_1.fileExists)(packageJsonFile)) {
            var data = {
                name: 'eoapi-modules',
                description: 'EOAPI modules package',
                dependencies: {}
            };
            (0, util_1.writeJson)(packageJsonFile, data);
        }
    }
    /**
     * 获取模块package.json信息
     * @param {string} name 模块名称
     */
    ModuleHandler.prototype.info = function (name) {
        var main = (0, util_1.resolveModule)(name, this.baseDir);
        var baseDir = path.dirname(main);
        var moduleInfo = (0, util_1.readJson)(path.join(baseDir, 'package.json'));
        // 这里要加上判断或try catch，避免异常读取不到文件，或格式错误
        moduleInfo.main = main;
        moduleInfo.baseDir = baseDir;
        if (moduleInfo.preload && moduleInfo.preload.length > 0) {
            moduleInfo.preload = path.join(baseDir, moduleInfo.preload);
        }
        if (moduleInfo.logo && moduleInfo.logo.length > 0 && !moduleInfo.logo.startsWith('http')) {
            moduleInfo.logo = path.join(baseDir, moduleInfo.logo);
        }
        return moduleInfo;
    };
    /**
     * 安装模块
     * @param modules 模块名称数组
     * @param isLocal 本地安装用link
     */
    ModuleHandler.prototype.install = function (modules, isLocal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execCommand(isLocal ? 'link' : 'install', modules)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 更新模块
     * @param {...string[]} modules 模块名称数组
     */
    ModuleHandler.prototype.update = function () {
        var modules = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            modules[_i] = arguments[_i];
        }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execCommand('update', modules)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 卸载模块
     * @param {string[]} modules 模块名称数组
     * @param isLocal 本地卸载用unlink
     */
    ModuleHandler.prototype.uninstall = function (modules, isLocal) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.execCommand(isLocal ? 'unlink' : 'uninstall', modules)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    /**
     * 获取已安装模块列表
     */
    ModuleHandler.prototype.list = function () {
        var modules = [];
        var packageInfo = (0, util_1.readJson)(path.join(this.baseDir, 'package.json'));
        if (packageInfo) {
            // @ts-ignore
            modules = Object.keys(packageInfo.dependencies || {});
        }
        return modules;
        ;
    };
    /**
     * 运行模块管理器
     * @param command
     * @param modules
     */
    ModuleHandler.prototype.execCommand = function (command, modules) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, new Promise(function (resolve) {
                            var args = [command].concat(modules).concat('--color=always').concat('--save');
                            if (!['link', 'unlink', 'uninstall'].includes(command)) {
                                if (_this.registry) {
                                    args = args.concat("--registry=".concat(_this.registry));
                                }
                                if (_this.proxy) {
                                    args = args.concat("--proxy=".concat(_this.proxy));
                                }
                            }
                            var npm = (0, cross_spawn_1.default)('npm', args, { cwd: _this.baseDir });
                            var output = '';
                            // @ts-ignore
                            npm.stdout.on('data', function (data) {
                                output += data;
                            }).pipe(process.stdout);
                            // @ts-ignore
                            npm.stderr.on('data', function (data) {
                                output += data;
                            }).pipe(process.stderr);
                            npm.on('close', function (code) {
                                if (!code) {
                                    resolve({ code: 0, data: output });
                                }
                                else {
                                    resolve({ code: code, data: output });
                                }
                            });
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    return ModuleHandler;
}());
exports.ModuleHandler = ModuleHandler;
//# sourceMappingURL=handler.js.map