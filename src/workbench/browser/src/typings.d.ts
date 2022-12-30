/* SystemJS module definition */
declare const nodeModule: NodeModule;
import type monaco from 'monaco-editor';

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
      log: (...args) => void;
    };
    BlobBuilder: any;
    WebKitBlobBuilder: any;
    MozBlobBuilder: any;
    MSBlobBuilder: any;
    monaco: typeof monaco;
    //TODO compatible with old version
    __POWERED_BY_EOAPI__: boolean;
    __POWERED_BY_POSTCAT__: boolean;
  }
  declare const pcConsole: typeof pcConsole;
}
declare const monaco: typeof MonacoEditor;
