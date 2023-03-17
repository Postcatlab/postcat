import { ExtensionInfo } from 'pc/browser/src/app/shared/models/extension-manager';
import { Observable, Subject } from 'rxjs';

export interface DataType {
  installedMap: Map<string, ExtensionInfo>;
  extension: ExtensionInfo;
  action: string;
  name: string;
}

export type ExtensionMessage = {
  /**
   * 消息数据
   *
   * @data {object}
   */
  data: DataType;
};

export const extensionMessageSubject = new Subject<ExtensionMessage>();

const extensionsChangeObserve: Observable<ExtensionMessage> = extensionMessageSubject.asObservable();
export function ExtensionChange(feature: string, isExecute: boolean = false) {
  return function (target: Object, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      extensionsChangeObserve.subscribe((inArg: ExtensionMessage) => {
        const extension: ExtensionInfo = inArg.data.extension;
        if (Object.keys(extension?.features).includes(feature)) {
          const result = original.apply(this, [...args, inArg]);
          return result;
        } else {
          return null;
        }
      });
    };
    return descriptor;
  };
}
