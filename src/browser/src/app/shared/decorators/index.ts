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
   * Message data
   *
   * @data {DataType}
   */
  data: DataType;
};

export const extensionMessageSubject = new Subject<ExtensionMessage>();

const extensionsChangeObserve: Observable<ExtensionMessage> = extensionMessageSubject.asObservable();

/**
 * @description Plug-in manipulates the decorator
 * @param {string} feature feature
 * @param {boolean} autoRun autoRun
 * @return {(Object, string, PropertyDescriptor) => PropertyDescriptor} function
 */
export function ExtensionChange(feature: string, autoRun: boolean = false) {
  return function (target: Object, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      if (autoRun) {
        // It is recommended to call the outer function directly only once
        original.apply(this, args);
      }
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
