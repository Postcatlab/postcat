import { app } from 'electron';
import * as path from 'path';

const home: string = app.getPath('home');
const HOME_DIR = path.join(home, '.eo');
const DATA_DIR = path.join(HOME_DIR, 'data');
const MODULE_DIR = HOME_DIR
const STORAGE_TEMP = path.join(HOME_DIR, 'tmp.storage');

export { HOME_DIR, DATA_DIR, MODULE_DIR, STORAGE_TEMP };
