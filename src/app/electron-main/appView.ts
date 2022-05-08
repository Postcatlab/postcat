import { ModuleInfo, ModuleType } from '../../platform/node/extension-manager/types';
import { getViewBounds, SidePosition, ViewBounds, ViewZone } from '../../shared/common/bounds';
import { BrowserView, BrowserWindow } from 'electron';
import * as path from 'path';
import { BrowserViewInstance } from '../../platform/electron-main/browserView/browserView';
import { processEnv } from '../../platform/node/constant';
export class AppViews {
  mainModuleID: string;
  view: BrowserView;
  sidePosition: SidePosition = SidePosition.left;
  constructor(private win: BrowserWindow) {}

  /**
   * 加载app模块
   * @param module
   */
  create(module: ModuleInfo) {
    if (module && module.moduleType === ModuleType.app) {
      if (module.isApp && this.mainModuleID !== module.moduleID) {
        this.mainModuleID = module.moduleID;
        this.sidePosition = module.sidePosition;
      }
      this.createAppView(module);

      if (module.main_node) {
        const main_node = require(module.main_node);
        if (main_node.module && typeof main_node.module === 'object') {
          const _fun = main_node.module;
          _fun.setup({
            appView: this.view,
          });
        }
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
    this.mainModuleID = undefined;
  }

  rebuildBounds(sideWidth?: number) {
    if (!this.view) {
      return;
    }
    const windBounds = this.win.getContentBounds();
    const _bounds: ViewBounds = getViewBounds(
      ViewZone.main,
      windBounds.width,
      windBounds.height,
      this.sidePosition,
      sideWidth
    );
    this.view.setBounds(_bounds);
  }

  /**
   * 创建主视图，主要从模块载入文件
   * @param module
   */
  private createAppView(module: ModuleInfo) {
    const windBounds = this.win.getContentBounds();
    const _bounds: ViewBounds = getViewBounds(ViewZone.main, windBounds.width, windBounds.height, this.sidePosition);
    let _view = new BrowserViewInstance({
      bounds: _bounds,
      partition: `<${module.moduleID}>`,
      preloadPath: path.join(__dirname, '../../', 'platform', 'electron-browser', 'preload.js'),
      preload: module.preload,
      viewPath: processEnv === 'development' && module.main_debug ? module.main_debug : module.main,
    }).init(this.win);
    this.remove();
    this.view = _view;
    this.view.webContents.openDevTools();
    this.view.webContents.once('did-finish-load', () => {
      _view.setBackgroundColor('#FFF');
    });
    this.view.webContents.once('dom-ready', () => {
      this.rebuildBounds();
      require('@electron/remote/main').enable(this.view.webContents);
    });
  }
}
