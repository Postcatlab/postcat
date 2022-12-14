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
    eoConsole: {
      warn: (...args) => void;
      error: (...args) => void;
      log: (...args) => void;
    };
    BlobBuilder: any;
    WebKitBlobBuilder: any;
    MozBlobBuilder: any;
    MSBlobBuilder: any;
    monaco: typeof monaco;
    __POWERED_BY_EOAPI__: boolean;
  }
  declare const eoConsole: typeof eoConsole;
}
declare const monaco: typeof MonacoEditor;
