import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import microApp from '@micro-zoe/micro-app';

import { AppModule } from './app/app.module';
import { APP_CONFIG } from './environments/environment';

const environment = APP_CONFIG;

if (APP_CONFIG.production) {
  enableProdMode();
}
platformBrowserDynamic()
  .bootstrapModule(AppModule, {})
  .catch((err) => console.error(err));

if (environment.production) {
  enableProdMode();
}

microApp.start({
  plugins: {
    modules: {
      // 适配vite
      'appname-custom-tab': [
        {
          loader(code: string) {
            if (!environment.production) {
              // 这里 /basename/ 需要和子应用vite.config.js中base的配置保持一致
              code = code.replace(/(from|import)(\s*['"])(\/child\/vite\/)/g, (all) => {
                return all.replace('/', '  http://127.0.0.1:5173/');
              });
            }

            return code;
          },
        },
      ],
      // 解决create-react-app中sockjs-node报错的问题
      'appname-react16': [
        {
          loader(code: string) {
            if (!environment.production && code.indexOf('sockjs-node') > -1) {
              code = code.replace('window.location.port', '4004');
            }
            return code;
          },
        },
      ],
      // 解决create-react-app中sockjs-node报错的问题
      'appname-react17': [
        {
          loader(code: string) {
            if (!environment.production && code.indexOf('sockjs-node') > -1) {
              code = code.replace('window.location.port', '4005');
            }
            return code;
          },
        },
      ],
    },
  },
});

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
