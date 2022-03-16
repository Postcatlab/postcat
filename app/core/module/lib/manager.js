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
exports.ModuleManager = void 0;
var main_1 = require("../../common/constant/main");
var handler_1 = require("./handler");
var types_1 = require("../types");
var path = require("path");
var ModuleManager = /** @class */ (function () {
    function ModuleManager() {
        this.moduleHandler = new handler_1.ModuleHandler({ baseDir: main_1.MODULE_DIR });
        this.modules = new Map();
        this.init();
    }
    /**
     * 安装模块，调用npm install | link
     * @param module
     */
    ModuleManager.prototype.install = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var moduleInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moduleHandler.install([module.name], module.isLocal || false)];
                    case 1:
                        _a.sent();
                        moduleInfo = this.moduleHandler.info(module.name);
                        this.set(moduleInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 更新模块，调用npm update
     * @param module
     */
    ModuleManager.prototype.update = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.moduleHandler.update(module.name)];
                    case 1:
                        _a.sent();
                        this.refresh(module);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 删除模块，调用npm uninstall | unlink
     * @param module
     */
    ModuleManager.prototype.uninstall = function (module) {
        return __awaiter(this, void 0, void 0, function () {
            var moduleInfo;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        moduleInfo = this.moduleHandler.info(module.name);
                        return [4 /*yield*/, this.moduleHandler.uninstall([module.name], module.isLocal || false)];
                    case 1:
                        _a.sent();
                        this.delete(moduleInfo);
                        return [2 /*return*/];
                }
            });
        });
    };
    /**
     * 读取本地package.json更新模块信息
     * @param module
     */
    ModuleManager.prototype.refresh = function (module) {
        var moduleInfo = this.moduleHandler.info(module.name);
        this.set(moduleInfo);
    };
    /**
     * 获取应用级app列表
     */
    ModuleManager.prototype.getAppModuleList = function () {
        var output = [];
        var modules = this.moduleBelongs();
        modules === null || modules === void 0 ? void 0 : modules.forEach(function (module) {
            if (module.isApp) {
                output.push(module);
            }
        });
        return output;
    };
    /**
     * 获取边栏应用列表
     */
    ModuleManager.prototype.getSlideModuleList = function (moduleID) {
        var _a;
        var output = [];
        var modules = this.moduleBelongs();
        (_a = modules.get(moduleID).slideItems) === null || _a === void 0 ? void 0 : _a.forEach(function (_moduleID) {
            if (modules.has(_moduleID)) {
                output.push(modules.get(_moduleID));
            }
        });
        return output;
    };
    /**
     * 获取所有模块列表
     * belongs为true，返回关联子模块集合
     * @param belongs
     */
    ModuleManager.prototype.getModules = function (belongs) {
        belongs = belongs || false;
        if (belongs) {
            return this.moduleBelongs();
        }
        return this.modules;
    };
    /**
     * 获取某个模块信息
     * belongs为true，返回关联子模块集合
     * @param belongs
     */
    ModuleManager.prototype.getModule = function (moduleID, belongs) {
        belongs = belongs || false;
        if (belongs) {
            return this.moduleBelongs().get(moduleID);
        }
        return this.modules.get(moduleID);
    };
    /**
     * 设置模块信息到模块列表
     * @param moduleInfo
     */
    ModuleManager.prototype.set = function (moduleInfo) {
        this.modules.set(moduleInfo.moduleID, moduleInfo);
    };
    /**
     * 清除在模块列表中的信息
     * @param moduleInfo
     */
    ModuleManager.prototype.delete = function (moduleInfo) {
        this.modules.delete(moduleInfo.moduleID);
    };
    /**
     * 读取本地package.json文件得到本地安装的模块列表，依次获取模块信息加入模块列表
     * 待处理：在初始化时加入系统模块的加载
     */
    ModuleManager.prototype.init = function () {
        var _this = this;
        var moduleNames = this.moduleHandler.list();
        moduleNames.forEach(function (moduleName) {
            var moduleInfo = _this.moduleHandler.info(moduleName);
            _this.set(moduleInfo);
        });
    };
    /**
     * 获取模块到上层模块后的模块列表
     * @param module
     */
    ModuleManager.prototype.moduleBelongs = function () {
        var _a;
        var newModules = new Map();
        var slideItems = new Map();
        var featureItems = new Map();
        // 绑定默认
        var defaultModule = {
            name: 'default',
            author: 'system',
            version: '1.0.0',
            description: '系统默认模块',
            moduleID: 'default',
            moduleName: 'API',
            type: types_1.ModuleType.app,
            isApp: true,
            logo: path.join(__dirname, '../../../../app/assets/images/icon.png'),
            main: path.join(__dirname, '../../../../app/index.html'),
        };
        // 加入系统默认模块做关联
        newModules.set(defaultModule.moduleID, defaultModule);
        slideItems.set(defaultModule.moduleID, [defaultModule.moduleID]);
        (_a = this.modules) === null || _a === void 0 ? void 0 : _a.forEach(function (module) {
            var belongs = module.belongs || [defaultModule.moduleID];
            // 如果包含自己则是主应用
            // 后期加入权限限制是否能成为顶层应用
            module.isApp = belongs.includes(module.moduleID);
            newModules.set(module.moduleID, module);
            belongs.forEach(function (belong) {
                var _modules;
                if (module.type === types_1.ModuleType.app) {
                    if (!slideItems.has(belong)) {
                        _modules = [];
                    }
                    else {
                        _modules = slideItems.get(belong);
                    }
                    // 如果指定上层是自己，自己放最前面
                    if (module.moduleID === belong) {
                        _modules.unshift(module.moduleID);
                    }
                    else {
                        _modules.push(module.moduleID);
                    }
                    slideItems.set(belong, _modules);
                }
                else if (module.type === types_1.ModuleType.feature) {
                    if (!featureItems.has(belong)) {
                        _modules = [];
                    }
                    else {
                        _modules = featureItems.get(belong);
                    }
                    _modules.push(module.moduleID);
                    featureItems.set(belong, _modules);
                }
            });
        });
        slideItems === null || slideItems === void 0 ? void 0 : slideItems.forEach(function (value, key) {
            var _current = newModules.get(key);
            if (_current.isApp) {
                _current.slideItems = value;
                newModules.set(key, _current);
            }
        });
        featureItems === null || featureItems === void 0 ? void 0 : featureItems.forEach(function (value, key) {
            var _current = newModules.get(key);
            _current.featureItems = value;
            newModules.set(key, _current);
        });
        return newModules;
    };
    return ModuleManager;
}());
exports.ModuleManager = ModuleManager;
exports.default = (function () { return new ModuleManager(); });
//# sourceMappingURL=manager.js.map