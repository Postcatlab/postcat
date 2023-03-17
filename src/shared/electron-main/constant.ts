import { app } from 'electron';

import * as path from 'path';

export const home: string = app.getPath('home');
export const HOME_DIR = path.join(home, '.postcat');
export const STORAGE_TEMP = path.join(HOME_DIR, 'tmp.storage');

export const GET_MODULES = 'getModules';
export const GET_MODULE = 'getModule';
export const INSTALL_MODULE = 'installModule';
export const UNINSTALL_MODULE = 'uninstallModule';
export const GET_FEATURE = 'getFeature';
export const GET_MOCK_URL = 'getMockUrl';
export const GET_WEBSOCKET_PORT = 'getWebsocketPort';
export const GET_EXT_TABS = 'getExtTabs';
export const LOGIN_WITH = 'loginWith';
export const GET_SIDEBAR_VIEW = 'getSidebarView';
export const GET_SIDEBAR_VIEWS = 'getSidebarViews';
