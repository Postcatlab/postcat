/// <reference types="monaco-editor/monaco" />
/* SystemJS module definition */
declare const nodeModule: NodeModule;

interface NodeModule {
  id: string;
}
declare global {
  interface Window {
    process: any;
    requirejs: any;
    require: any;
    angular: any;
    eo: any;
    pc: any;
    electron: any;
    pcConsole: {
      warn: (...args) => void;
      error: (...args) => void;
      success: (...args) => void;
      log: (...args) => void;
    };
    BlobBuilder: any;
    WebKitBlobBuilder: any;
    MozBlobBuilder: any;
    MSBlobBuilder: any;
    //TODO compatible with old version
    __POWERED_BY_EOAPI__: boolean;
    __POWERED_BY_POSTCAT__: boolean;
  }

  interface Array<T> {
    // 已经添加 polyfill 了 放下食用
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/group
    group(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): Record<string, T[]>;
    groupToMap(callbackfn: (value: T, index: number, array: T[]) => any, thisArg?: any): Map<any, T[]>;
  }

  declare const pcConsole: typeof pcConsole;
}

export {};
