import { COMMON_CONFIG } from 'eo/workbench/browser/src/environments/common';
export const APP_CONFIG = Object.assign(
  {
    production: false,
    environment: 'DEV',
    SOCKETIO_URL: 'http://localhost:4301',
  },
  COMMON_CONFIG
);
