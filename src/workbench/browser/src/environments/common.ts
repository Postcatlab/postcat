import { ELETRON_APP_CONFIG } from 'eo/enviroment';
export const COMMON_CONFIG = Object.assign({}, ELETRON_APP_CONFIG);
export type APP_CONFIG_INSTANT = {
  production: boolean;
  environment: 'DEV' | 'PROD';
  EXTENSION_URL: string;
  REMOTE_SOCKET_URL: 'wss://eoapi.eolinker.com';
  SOCKET_PORT: number;
  MOCK_URL: string;
};
