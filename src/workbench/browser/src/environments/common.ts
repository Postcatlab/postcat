import { ELETRON_APP_CONFIG } from 'eo/enviroment';
export const COMMON_CONFIG = Object.assign({}, ELETRON_APP_CONFIG);
export type APP_CONFIG_INSTANT = {
  production: boolean;
  environment: 'DEV' | 'PROD';
  EXTENSION_URL: string;
  REMOTE_SOCKET_URL: 'ws://106.12.149.147';
  SOCKET_PORT: number;
  MOCK_URL: string;
};
