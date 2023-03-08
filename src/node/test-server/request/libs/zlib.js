const zlib = require('zlib');
const Fiber = require('fibers');

/**
 * zlib options 压缩
 */
const DEFAULT_ZLIB_OPT = {
  flush: zlib.constants.Z_NO_FLUSH,
  finishFlush: zlib.constants.Z_FINISH,
  chunkSize: 16 * 1024,
  windowBits: 15, // 值在8..15的范围内，这个参数的值越大，内存使用率越高，压缩效果越好。如果使用deflateInit，则默认值为15
  level: 6, // ( 压缩级别，值在0-9之间，1速度最快，9压缩比最大，各自折中取值6较为合适。仅压缩有效)
  memLevel: 8, // (指定多少内存应该内部压缩状态进行分配，1是最小内存速度慢压缩比低。9是最大内存，速度最快。默认值为8。仅压缩有效)
  strategy: zlib.constants.Z_DEFAULT_STRATEGY, // (用于调整压缩算法,仅压缩有效)
  info: true //(如果true,返回一个buffer对象和engine)
};

/**
 * zlib options 解压
 */
const DEFAULT_ZLIB_UN_OPT = {
  flush: zlib.constants.Z_NO_FLUSH,
  finishFlush: zlib.constants.Z_FINISH,
  chunkSize: 16 * 1024,
  windowBits: 15
};

/**
 * @desc 将参数转为buffer数据
 * @param {*} inStr
 * @returns
 */
const fnToBuffer = (inStr = {}) => {
  let tmpStr;
  if (typeof inStr === 'object') {
    try {
      tmpStr = JSON.stringify(inStr);
    } catch (e) {
      console.info('zlib.js fnToBuffer stringify error', inStr);
      tmpStr = inStr.toString();
    }
  } else {
    tmpStr = String(inStr);
  }

  return Buffer.from(tmpStr);
};

const fnIsBuffer = (inStr = '') => {
  return inStr && typeof inStr === 'object' && Buffer.isBuffer(inStr);
};

const fnGzip = inData => {
  let tmpInData = fnToBuffer(inData);
  let tmpResult = null;
  try {
    const tmpCurrentFiber = Fiber.current;
    zlib.gzip(tmpInData, DEFAULT_ZLIB_OPT, (err, tmpBuffer) => {
      if (err) {
        console.error('zlib.js fnGzip zlib.gzip error');
        console.error(err);
      } else {
        tmpResult = tmpBuffer.buffer;
      }
      tmpCurrentFiber.run();
    });
    Fiber.yield();
  } catch (e) {
    console.error('zlib.gzip Error: ', e);
  }
  return tmpResult;
};

const fnGunzip = inBufferData => {
  let tmpInData = fnIsBuffer(inBufferData) ? inBufferData : fnToBuffer(inBufferData);
  let tmpResult = null;
  try {
    const tmpCurrentFiber = Fiber.current;
    zlib.gunzip(tmpInData, DEFAULT_ZLIB_UN_OPT, (err, tmpBuffer) => {
      if (err) {
        console.error('zlib.js fnGunzip zlib.gunzip error');
        console.error(err);
      } else {
        tmpResult = tmpBuffer.toString('utf-8');
      }
      tmpCurrentFiber.run();
    });
    Fiber.yield();
  } catch (e) {
    console.error('zlib.gunzip Error: ', e);
  }
  return tmpResult;
};

const fnDeflate = inData => {
  let tmpInData = fnToBuffer(inData);
  let tmpResult = null;
  try {
    const tmpCurrentFiber = Fiber.current;
    zlib.deflate(tmpInData, DEFAULT_ZLIB_OPT, (err, tmpBuffer) => {
      if (err) {
        console.error('zlib.js fnDeflate zlib.deflate error');
        console.error(err);
      } else {
        tmpResult = tmpBuffer.buffer;
      }
      tmpCurrentFiber.run();
    });
    Fiber.yield();
  } catch (e) {
    console.error('zlib.deflate Error: ', e);
  }
  return tmpResult;
};

const fnInflate = inBufferData => {
  let tmpInData = fnIsBuffer(inBufferData) ? inBufferData : fnToBuffer(inBufferData);
  let tmpResult = null;
  try {
    const tmpCurrentFiber = Fiber.current;
    zlib.inflate(tmpInData, DEFAULT_ZLIB_UN_OPT, (err, tmpBuffer) => {
      if (err) {
        console.error('zlib.js fnInflate zlib.inflate error');
        console.error(err);
      } else {
        tmpResult = tmpBuffer.toString('utf-8');
      }
      tmpCurrentFiber.run();
    });
    Fiber.yield();
  } catch (e) {
    console.error('zlib.inflate Error: ', e);
  }
  return tmpResult;
};

exports.fnGzip = fnGzip;
exports.fnGunzip = fnGunzip;
exports.fnDeflate = fnDeflate;
exports.fnInflate = fnInflate;
