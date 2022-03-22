"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.appViews = void 0;
var manager_1 = require("./../../core/module/lib/manager");
var types_1 = require("./../../core/module/types");
var util_1 = require("./../../core/common/util");
var electron_1 = require("electron");
var path = require("path");
var browserViews = new Map();
var moduleManager = (0, manager_1.default)();
var appViews = /** @class */ (function () {
    function appViews(win) {
        this.win = win;
        this.slidePosition = util_1.SlidePosition.left;
    }
    /**
     * 根据模块ID启动app模块的加载
     * @param moduleID
     * @param load
     */
    appViews.prototype.create = function (moduleID) {
        this.moduleID = moduleID;
        var module = moduleManager.getModule(moduleID, true);
        if (module && module.type === types_1.ModuleType.app) {
            var refresh = false;
            if (module.isApp && this.moduleID !== module.moduleID) {
                this.moduleID = module.moduleID;
                this.slidePosition = module.slidePosition;
                refresh = true;
            }
            return this.createAppView(module, refresh);
        }
    };
    /**
     * 删除视图
     * @param view
     * @param window
     */
    appViews.prototype.remove = function (view) {
        if (view) {
            this.win.removeBrowserView(view);
            // window.webContents.executeJavaScript(`window.init()`);
            view = undefined;
        }
    };
    /**
     * 创建主视图，主要从模块载入文件
     * @param module
     * @param window
     */
    appViews.prototype.createAppView = function (module, refresh) {
        var _this = this;
        var file = "file://".concat(module.main);
        var ses = electron_1.session.fromPartition('<' + module.moduleID + '>');
        ses.setPreloads([path.join(__dirname, 'preload.js')]);
        var _view = new electron_1.BrowserView({
            webPreferences: {
                webSecurity: false,
                nodeIntegration: true,
                contextIsolation: false,
                devTools: true,
                webviewTag: true,
                preload: module.preload,
                session: ses,
            },
        });
        this.win.addBrowserView(_view);
        var bounds = this.win.getContentBounds();
        var _bounds = (0, util_1.getViewBounds)(util_1.ViewZone.main, bounds.width, bounds.height, this.slidePosition);
        _view.webContents.loadURL(file).finally();
        _view.webContents.once('did-finish-load', function () {
            _view.setBackgroundColor('#FFF');
        });
        _view.webContents.once('dom-ready', function () {
            _view.setBounds(_bounds);
            if (browserViews.has(util_1.ViewZone.main)) {
                _this.remove(browserViews.get(util_1.ViewZone.main));
                browserViews.delete(util_1.ViewZone.main);
            }
            browserViews.set(util_1.ViewZone.main, _view);
            _view.webContents.openDevTools();
            //view.setAutoResize({ width: true });
            //this.win.webContents.executeJavaScript(`window.getModules1()`);
        });
        return _view;
    };
    return appViews;
}());
exports.appViews = appViews;
//# sourceMappingURL=app.js.map