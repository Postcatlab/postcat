import { app } from 'electron';
import * as path from 'path';

const home: string = app.getPath('home');
const HOME_DIR = path.join(home, '.eo');
const DATA_DIR = path.join(HOME_DIR, 'data');
const MODULE_DIR = HOME_DIR;

export { HOME_DIR, DATA_DIR, MODULE_DIR };
