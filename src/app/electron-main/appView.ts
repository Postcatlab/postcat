import ModuleManager from '../../platform/node/extension-manager/lib/manager';
import { ModuleInfo, ModuleManagerInterface, ModuleType } from '../../platform/node/extension-manager/types';
import { getViewBounds, SidePosition, ViewBounds, ViewZone } from '../../shared/common/bounds';
import { BrowserView, BrowserWindow } from 'electron';
import * as path from 'path';
import { BrowserViewInstance } from '../../platform/electron-main/browserView/browserView';
import { processEnv } from '../../platform/node/constant';
const browserViews: Map<ViewZone, BrowserView> = new Map();
const moduleManager: ModuleManagerInterface = ModuleManager();
export class AppViews {
  mainModuleID: string = 'default';
  moduleID: string = 'default';
  view: BrowserView;
  sidePosition: SidePosition = SidePosition.left;
  constructor(private win: BrowserWindow) {}

  /**
   * 根据模块ID启动app模块的加载
   * @param moduleID
   */
  create(moduleID: string) {
    this.moduleID = moduleID;
    const module: ModuleInfo = moduleManager.getModule(moduleID, true);
    if (module && module.moduleType === ModuleType.app) {
      let refresh: boolean = false;
      if (module.isApp && this.mainModuleID !== module.moduleID) {
        this.mainModuleID = module.moduleID;
        this.sidePosition = module.sidePosition;
        refresh = true;
      }
      this.createAppView(module, refresh);
    }
    if (module.main_node) {
      const main_node = require(module.main_node);
      if (main_node.module && typeof main_node.module === 'object') {
        const _fun = main_node.module;
        console.log(_fun);
        _fun.setup({
          appView: this.view
        });
      }
    }
    return this.view;
  }

  /**
   * 删除视图
   */
  remove() {
    if (!this.view) {
      return;
    }
    this.view.webContents.closeDevTools();
    this.win.removeBrowserView(this.view);
    this.view = undefined;
  }
  
  rebuildBounds(sideWidth?: number) {
    if (!this.view) {
      return;
    }
    const windBounds = this.win.getContentBounds();
    const _bounds: ViewBounds = getViewBounds(ViewZone.main, windBounds.width, windBounds.height, this.sidePosition, sideWidth); 
    this.view.setBounds(_bounds);
  }

  /**
   * 创建主视图，主要从模块载入文件
   * @param module
   * @param window
   */
  private createAppView(module: ModuleInfo, refresh: boolean) {
    const windBounds = this.win.getContentBounds();
    const _bounds: ViewBounds = getViewBounds(ViewZone.main, windBounds.width, windBounds.height, this.sidePosition);
    let _view = new BrowserViewInstance({
      bounds: _bounds,
      partition: `<${module.moduleID}>`,
      preloadPath: path.join(__dirname, '../../', 'platform', 'electron-browser', 'preload.js'),
      preload: module.preload,
      viewPath: processEnv === 'development' && module.main_debug ? module.main_debug : module.main,
    }).init(this.win);
    this.remove()
    this.view = _view;
    this.view.webContents.openDevTools();
    this.view.webContents.once('did-finish-load', () => {
      _view.setBackgroundColor('#FFF');
    });
    this.view.webContents.once('dom-ready', () => {
      this.rebuildBounds();
      require('@electron/remote/main').enable(this.view.webContents);
      //_view.setAutoResize({ width: true });
      //this.win.webContents.executeJavaScript(`window.getModules1()`);
    });
    //return this.view;
  }
}
