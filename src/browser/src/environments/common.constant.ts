import { COMMON_APP_CONFIG } from 'pc/environment';

export const COMMON_CONFIG = { ...COMMON_APP_CONFIG };

export type APP_CONFIG_INSTANT = {
  production: boolean;
  environment: 'DEV' | 'PROD';
  EXTENSION_URL: string;
  REMOTE_SOCKET_URL: 'wss://postcat.com';
  SOCKET_PORT: number;
  NODE_SERVER_PORT: number;
};
