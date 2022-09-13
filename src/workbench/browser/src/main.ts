import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { APP_CONFIG } from './environments/environment';
import { hmrBootstrap } from './hmr';

if (APP_CONFIG.production) {
  enableProdMode();
}
const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule, {});

if (APP_CONFIG.production) {
  enableProdMode();
}
bootstrap();
// hmrBootstrap(module, bootstrap);
