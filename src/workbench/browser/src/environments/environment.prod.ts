import { APP_CONFIG_INSTANT, COMMON_CONFIG } from 'eo/workbench/browser/src/environments/common';

export const APP_CONFIG = Object.assign(
  {
    production: true,
    environment: 'PROD',
    SOCKETIO_URL: 'http://106.12.149.147:4301',
  },
  COMMON_CONFIG
);
