import { COMMON_CONFIG } from 'eo/workbench/browser/src/environments/common';
export const APP_CONFIG = Object.assign(
  {
    production: false,
    environment: 'WEB',
    SOCKETIO_URL: 'http://106.12.149.147:4301',
  },
  COMMON_CONFIG
);
