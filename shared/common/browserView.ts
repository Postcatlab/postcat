import { shell } from 'electron';
//open link through default browser not electron
export function proxyOpenExternal(view) {
  view.webContents.setWindowOpenHandler(({ url }) => {
    setImmediate(() => {
      shell.openExternal(url);
    });
    return { action: 'deny' };
  });
}
