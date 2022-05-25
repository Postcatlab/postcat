import * as path from 'path';
import * as resolve from 'resolve';

/**
 * 获取模块路径.
 * @param name
 */
export const resolveModule = (name: string, baseDir: string): string => {
  try {
    return require.resolve(name, { paths: [baseDir] });
  } catch (err) {
    try {
      return resolve.sync(name, { basedir: baseDir });
    } catch (err) {
      return path.join(baseDir, 'node_modules', name);
    }
  }
};
