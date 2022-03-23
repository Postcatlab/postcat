import ModuleManager from './../../core/module/lib/manager';
import { ModuleInfo, ModuleManagerInterface, ModuleType } from './../../core/module/types';
import { getViewBounds, SlidePosition, ViewBounds, ViewZone } from './../../core/common/util';
import { BrowserView, BrowserWindow, session } from 'electron';
import * as path from 'path';
const browserViews: Map<ViewZone, BrowserView> = new Map();
const moduleManager: ModuleManagerInterface = ModuleManager();
export class appViews {
  moduleID: string;
  slidePosition: SlidePosition = SlidePosition.left;
  constructor(private win: BrowserWindow) {}
  /**
   * 根据模块ID启动app模块的加载
   * @param moduleID
   * @param load
   */
  create(moduleID: string) {
    this.moduleID = moduleID;
    const module: ModuleInfo = moduleManager.getModule(moduleID, true);
    if (module && module.type === ModuleType.app) {
      let refresh: boolean = false;
      if (module.isApp && this.moduleID !== module.moduleID) {
        this.moduleID = module.moduleID;
        this.slidePosition = module.slidePosition;
        refresh = true;
      }
      return this.createAppView(module, refresh);
    }
  }
  /**
   * 删除视图
   * @param view
   * @param window
   */
  remove(view: BrowserView) {
    if (view) {
      this.win.removeBrowserView(view);
      // window.webContents.executeJavaScript(`window.init()`);
      view = undefined;
    }
  }
  /**
   * 创建主视图，主要从模块载入文件
   * @param module
   * @param window
   */
  private createAppView(module: ModuleInfo, refresh: boolean): BrowserView {
    // const file: string = `file://${module.main}`;
    const file: string = `http://localhost:4200`;
    const ses = session.fromPartition('<' + module.moduleID + '>');
    ses.setPreloads([path.join(__dirname,  'preload.js')]);
    const _view: BrowserView = new BrowserView({
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
    const bounds = this.win.getContentBounds();
    const _bounds: ViewBounds = getViewBounds(ViewZone.main, bounds.width, bounds.height, this.slidePosition);
    _view.webContents.loadURL(file).finally();
    _view.webContents.once('did-finish-load', () => {
      _view.setBackgroundColor('#FFF');
    });
    _view.webContents.once('dom-ready', () => {
      _view.setBounds(_bounds);
      if (browserViews.has(ViewZone.main)) {
        this.remove(browserViews.get(ViewZone.main));
        browserViews.delete(ViewZone.main);
      }
      browserViews.set(ViewZone.main, _view);
      _view.webContents.openDevTools();
      //view.setAutoResize({ width: true });
      //this.win.webContents.executeJavaScript(`window.getModules1()`);
    });
    return _view;
  }
}
