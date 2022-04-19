import { throws } from 'assert';
import { BrowserWindow, BrowserView, session, BrowserViewConstructorOptions } from 'electron';
import { ViewBounds } from '../../../shared/common/bounds';
import { proxyOpenExternal } from '../../../shared/common/browserView';
import { BrowserViewOpts } from './browserView.type';
export class BrowserViewInstance {
  bounds: ViewBounds;
  constructor(private opts: BrowserViewOpts) {
    this.bounds = this.opts.bounds;
  }
  init(win: BrowserWindow) {
    let viewOps: BrowserViewConstructorOptions = {
      webPreferences: {
        webSecurity: false,
        nodeIntegration: true,
        contextIsolation: false,
        devTools: true,
        webviewTag: true,
      },
    };
    if (this.opts.preloadPath) {
      const partition = this.opts.partition || '<core-module>';
      const ses = session.fromPartition(partition);
      ses.setPreloads([this.opts.preloadPath]);
      viewOps.webPreferences.session = ses;
    }
    if (this.opts.preload) {
      viewOps.webPreferences.preload = this.opts.preload;
    }
    let view = new BrowserView(viewOps);
    view.webContents.loadURL(this.opts.viewPath);
    // view.webContents.on("console-message",(e,level,message)=>{
    //   console.log(message)
    // })
    // view.webContents.openDevTools();
    win.addBrowserView(view);
    view.setBounds(this.bounds);
    proxyOpenExternal(view);
    return view;
  }
}
