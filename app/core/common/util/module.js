"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveModule = void 0;
var path = require("path");
var resolve_1 = require("resolve");
/**
 * 获取模块路径.
 * @param name
 */
var resolveModule = function (name, baseDir) {
    try {
        return require.resolve(name, { paths: [baseDir] });
    }
    catch (err) {
        try {
            return resolve_1.default.sync(name, { basedir: baseDir });
        }
        catch (err) {
            return path.join(baseDir, 'node_modules', name);
        }
    }
};
exports.resolveModule = resolveModule;
//# sourceMappingURL=module.js.map