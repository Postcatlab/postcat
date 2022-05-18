import * as fs from 'fs';
import * as path from 'path';

/**
 * Write object data into json file.
 * @param file
 * @param data
 */
export const writeJson = (file: string, data: object, formatted = false): boolean => {
  return writeFile(file, formatted ? JSON.stringify(data, null, 2) : JSON.stringify(data));
};

/**
 * Read json file, then return object.
 * @param file
 */
export const readJson = (file: string): object | null => {
  const data: string = readFile(file);
  if ('' === data) {
    return null;
  }
  return JSON.parse(data);
};

/**
 * Read data from file.
 * @param file
 */
export const readFile = (file: string): string => {
  try {
    return fs.readFileSync(file).toString();
  } catch (e) {
    return '';
  }
};

/**
 * Delete file.
 * @param file string
 * @returns
 */
export const deleteFile = (file: string): boolean => {
  try {
    fs.unlinkSync(file);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Write data into file.
 * @param file
 * @param data
 */
export const writeFile = (file: string, data: string): boolean => {
  // check and create dir.
  const dir: string = path.dirname(file);
  ensureDir(dir);
  try {
    fs.writeFileSync(file, data);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check file exists.
 * @param file
 */
export const fileExists = (file: string): boolean => {
  return fs.existsSync(file);
};

/**
 * Ensure dir exists and create if not exist.
 * @param name
 */
export const ensureDir = (name: string) => {
  if (fs.existsSync(name)) {
    return true;
  } else {
    if (ensureDir(path.dirname(name))) {
      fs.mkdirSync(name);
      return true;
    }
  }
};

/**
 * Ensure file exists and create if not exist.
 * @param file
 */
export const ensureFile = (file: string) => {
  try {
    if (!fileExists(file)) {
      fs.closeSync(fs.openSync(file, 'w'));
    }
  } catch (e) {
    throw e;
  }
};

/**
 * Append data into file.
 * @param file
 * @param data
 */
export const appendFile = (file: string, data: string) => {
  try {
    fs.appendFileSync(file, data);
  } catch (e) {
    throw e;
  }
};
