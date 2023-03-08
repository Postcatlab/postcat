import { APP_CONFIG_INSTANT, COMMON_CONFIG } from 'pc/browser/src/environments/common.constant';

export const APP_CONFIG: APP_CONFIG_INSTANT | any = {
  production: false,
  environment: 'LOCAL',
  ...COMMON_CONFIG
};
