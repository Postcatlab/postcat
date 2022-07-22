import { ELETRON_APP_CONFIG } from 'eo/enviroment';
export const COMMON_CONFIG = Object.assign({}, ELETRON_APP_CONFIG);
export type APP_CONFIG_INSTANT = {
  production: boolean;
  environment: 'DEV' | 'PROD' | 'WEB';
  EXTENSION_URL: string;
  MOCK_URL: string;
};
