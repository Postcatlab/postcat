import { app } from 'electron';

import * as path from 'path';

export const home: string = app.getPath('home');
export const HOME_DIR = path.join(home, '.postcat');
export const MODULE_DIR = HOME_DIR;
export const STORAGE_TEMP = path.join(HOME_DIR, 'tmp.storage');
