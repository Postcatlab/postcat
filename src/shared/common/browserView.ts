import { shell } from 'electron';
//Open link through system default browser not Electron browserwin
export function proxyOpenExternal(view) {
  view.webContents.setWindowOpenHandler(({ url }) => {
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: 'deny' };
  });
}
