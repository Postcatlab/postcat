import { APP_CONFIG_INSTANT, COMMON_CONFIG } from 'pc/browser/src/environments/common.constant';

export const APP_CONFIG = {
  serverUrl: 'https://postcat.com',
  production: true,
  environment: 'PROD',
  ...COMMON_CONFIG,
  REMOTE_SOCKET_URL: '',
  NODE_SERVER_PORT: ''
};
