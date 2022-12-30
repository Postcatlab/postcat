import { APP_CONFIG_INSTANT, COMMON_CONFIG } from 'eo/workbench/browser/src/environments/common';

export const APP_CONFIG = {
  production: true,
  environment: 'PROD',
  ...COMMON_CONFIG,
  REMOTE_SOCKET_URL: '',
  NODE_SERVER_PORT: '',
};
