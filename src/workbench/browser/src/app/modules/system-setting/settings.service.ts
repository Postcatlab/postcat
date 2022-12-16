import { Injectable, Inject } from '@angular/core';

export const LOCAL_SETTINGS_KEY = 'LOCAL_SETTINGS_KEY';

export const getSettings = () => {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_SETTINGS_KEY) || '{}');
  } catch (error) {
    return {};
  }
};

@Injectable({
  providedIn: 'root'
})
export class SettingService {
  get settings() {
    return getSettings();
  }

  putSettings(settings: Record<string, any> = {}) {
    this.saveSetting({ ...this.settings, ...settings });
  }

  deleteSettings(keys: string[]) {
    const settings = { ...this.settings };
    keys.forEach(key => Reflect.deleteProperty(settings, key));
    this.saveSetting(settings);
  }

  saveSetting(settings: string | Record<string, any> = {}) {
    if (typeof settings === 'object') {
      localStorage.setItem(LOCAL_SETTINGS_KEY, JSON.stringify(settings));
    } else {
      localStorage.setItem(LOCAL_SETTINGS_KEY, settings);
    }
  }

  /**
   * Get the value of the corresponding configuration according to the key path
   *
   * @param key
   * @returns
   */
  getConfiguration = (keyPath: string) => {
    const localSettings = this.settings;

    if (Reflect.has(localSettings, keyPath)) {
      return Reflect.get(localSettings, keyPath);
    }

    const keys = Object.keys(localSettings);
    const filterKeys = keys.filter(n => n.startsWith(keyPath));
    if (filterKeys.length) {
      return filterKeys.reduce((pb, ck) => {
        const keyArr = ck.replace(`${keyPath}.`, '').split('.');
        const targetKey = keyArr.pop();
        const target = keyArr.reduce((p, v) => {
          p[v] ??= {};
          return p[v];
        }, pb);
        target[targetKey] = localSettings[ck];
        return pb;
      }, {});
    }
    return undefined;
  };
}
