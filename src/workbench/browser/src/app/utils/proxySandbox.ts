/**
 * Relate code
 * https://github.com/senfish/qiankun-sandbox/blob/master/proxySandbox.html
 * https://github.com/umijs/qiankun/blob/master/src/sandbox/proxySandbox.ts
 */
export class ProxySandbox {
  sandboxRunning;
  proxy;
  active() {
    this.sandboxRunning = true;
  }
  inactive() {
    this.sandboxRunning = false;
  }
  constructor() {
    const rawWindow = window.eo;
    const fakeWindow = {};
    const proxy = new Proxy(fakeWindow, {
      set: (target, prop, value) => {
        console.log('set',prop,value)
        if(this.sandboxRunning) {
          target[prop] = value;
          return true;
        }
      },
      get: (target, prop) => {
        // If there is one in fakeWindow, take it from fakeWindow, otherwise, take it from outside window
        let value = prop in target ? target[prop] : rawWindow[prop];
        return value
      }
    })
    this.proxy = proxy;
  }
}