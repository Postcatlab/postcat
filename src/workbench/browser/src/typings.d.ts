/* SystemJS module definition */
declare const nodeModule: NodeModule;
interface NodeModule {
  id: string;
}
interface Window {
  process: any;
  requirejs: any;
  require: any;
  angular: any;
  eo: any;
  BlobBuilder: any;
  WebKitBlobBuilder: any;
  MozBlobBuilder: any;
  MSBlobBuilder: any;
}
