(function () {
  'use strict';
  let Crypto = require('crypto');
  let CryptoJS = require('crypto-js');
  let privateFun = {};
  let publicFun = {};
  const TIMINGSUMMARY = {
    NS_PER_SEC: 1e9,
    MS_PER_NS: 1e6
  };
  /**
   * @desc AES/DES解密
   * @param {string} inputMode 选择模式
   * @param {string} inputKey 加密密钥
   * @param {string} inputData 待加密数据
   * @param {object} inputOpts 配置项,padding/iv/mode
   * @return {string} 结果字符串
   */
  privateFun.aesOrDesAndEncryptOrDecrypt = (inputMode, inputData, inputKey, inputOpts) => {
    if (inputOpts) {
      inputOpts = Object.assign({}, inputOpts);
      if (inputOpts.mode) inputOpts.mode = CryptoJS.mode[inputOpts.mode];
      if (inputOpts.padding) inputOpts.padding = CryptoJS.pad[inputOpts.padding];
      if (inputOpts.iv) inputOpts.iv = CryptoJS.enc.Latin1.parse(inputOpts.iv || '');
    }
    inputKey = CryptoJS.enc.Latin1.parse(inputKey || '');
    let tmpType = inputMode.split('-')[0],
      tmpOpr = inputMode.split('-')[1];
    switch (tmpOpr) {
      case 'decrypt': {
        return CryptoJS[tmpType].decrypt(inputData, inputKey, inputOpts).toString(CryptoJS.enc.Utf8);
      }
      case 'encrypt': {
        return CryptoJS[tmpType].encrypt(inputData, inputKey, inputOpts).toString();
      }
    }
  };
  /**
   * @desc AES/DES解密
   * @param {string} inputKey 加密密钥
   * @param {string} inputData 待加密数据
   * @param {object} inputOpts 配置项,padding/iv/mode
   * @return {string} 解密后字符串
   */
  publicFun.aesDecrypt = (inputData, inputKey, inputOpts) => {
    return privateFun.aesOrDesAndEncryptOrDecrypt('AES-decrypt', inputData, inputKey, inputOpts);
  };
  publicFun.desDecrypt = (inputData, inputKey, inputOpts) => {
    return privateFun.aesOrDesAndEncryptOrDecrypt('DES-decrypt', inputData, inputKey, inputOpts);
  };
  /**
   * @desc AES/DES加密
   * @param {string} inputKey 加密密钥
   * @param {string} inputData 待加密数据
   * @param {object} inputOpts 配置项,padding/iv/mode
   * @return {string} 加密后字符串
   */
  publicFun.aesEncrypt = (inputData, inputKey, inputOpts) => {
    return privateFun.aesOrDesAndEncryptOrDecrypt('AES-encrypt', inputData, inputKey, inputOpts);
  };
  publicFun.desEncrypt = (inputData, inputKey, inputOpts) => {
    return privateFun.aesOrDesAndEncryptOrDecrypt('DES-encrypt', inputData, inputKey, inputOpts);
  };
  /**
   * @description
   */
  privateFun.createEcdsa = () => {
    var MAX_OCTET = 0x80,
      CLASS_UNIVERSAL = 0,
      PRIMITIVE_BIT = 0x20,
      TAG_SEQ = 0x10,
      TAG_INT = 0x02,
      ENCODED_TAG_SEQ = TAG_SEQ | PRIMITIVE_BIT | (CLASS_UNIVERSAL << 6),
      ENCODED_TAG_INT = TAG_INT | (CLASS_UNIVERSAL << 6);

    function getParamSize(keySize) {
      switch (keySize) {
        case 512: {
          keySize = 521;
          break;
        }
        default: {
          break;
        }
      }
      var result = ((keySize / 8) | 0) + (keySize % 8 === 0 ? 0 : 1);
      return result;
    }

    function derToJose(signature, bits) {
      signature = Buffer.from(signature, 'base64');
      var paramBytes = getParamSize(parseInt(bits));

      var maxEncodedParamLength = paramBytes + 1;

      var inputLength = signature.length;

      var offset = 0;
      if (signature[offset++] !== ENCODED_TAG_SEQ) {
        throw new Error('Could not find expected "seq"');
      }

      var seqLength = signature[offset++];
      if (seqLength === (MAX_OCTET | 1)) {
        seqLength = signature[offset++];
      }

      if (inputLength - offset < seqLength) {
        throw new Error('"seq" specified length of "' + seqLength + '", only "' + (inputLength - offset) + '" remaining');
      }

      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "r"');
      }

      var rLength = signature[offset++];

      if (inputLength - offset - 2 < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", only "' + (inputLength - offset - 2) + '" available');
      }

      if (maxEncodedParamLength < rLength) {
        throw new Error('"r" specified length of "' + rLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }

      var rOffset = offset;
      offset += rLength;

      if (signature[offset++] !== ENCODED_TAG_INT) {
        throw new Error('Could not find expected "int" for "s"');
      }

      var sLength = signature[offset++];

      if (inputLength - offset !== sLength) {
        throw new Error('"s" specified length of "' + sLength + '", expected "' + (inputLength - offset) + '"');
      }

      if (maxEncodedParamLength < sLength) {
        throw new Error('"s" specified length of "' + sLength + '", max of "' + maxEncodedParamLength + '" is acceptable');
      }

      var sOffset = offset;
      offset += sLength;

      if (offset !== inputLength) {
        throw new Error('Expected to consume entire buffer, but "' + (inputLength - offset) + '" bytes remain');
      }

      var rPadding = paramBytes - rLength,
        sPadding = paramBytes - sLength;

      var dst = Buffer.allocUnsafe(rPadding + rLength + sPadding + sLength);

      for (offset = 0; offset < rPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, rOffset + Math.max(-rPadding, 0), rOffset + rLength);

      offset = paramBytes;

      for (var o = offset; offset < o + sPadding; ++offset) {
        dst[offset] = 0;
      }
      signature.copy(dst, offset, sOffset + Math.max(-sPadding, 0), sOffset + sLength);

      dst = dst.toString('base64');
      dst = publicFun.setBase64Url(dst);

      return dst;
    }

    return function (bits, message, secretKey) {
      try {
        var signature = publicFun.setBase64Url(privateFun.createSign('RSA-SHA' + bits, message, secretKey));
        signature = derToJose(signature, bits);
        return signature;
      } catch (e) {
        console.error(new Date() + '：libs/encrypt.js，122（ES 签名错误）：' + e);
        return 'EcdsaError';
      }
    };
  };
  /**
   * @description  公用加密算法（create sign）
   * @param [string] encryption 加密方式
   * @param [string] message 待加密内容
   * @param [string] secretKey 密钥
   * @param [object] options 配置可选项
   * @returns [string] 已加密内容
   */
  privateFun.createSign = function (encryption, message, secretKey, options) {
    options = options || {
      hash: 'base64'
    };
    let sign = Crypto.createSign(encryption);
    sign.update(message || '', 'utf8');
    try {
      if (typeof secretKey === 'object' && typeof secretKey.padding === 'string') {
        secretKey.padding = Crypto.constants[secretKey.padding];
      }
      return sign.sign(secretKey, options.hash);
    } catch (e) {
      return 'SignError';
    }
  };

  /**
   * @description  公用加密算法（createHash）
   * @param [string] encryption 加密方式
   * @param [string] message 待加密内容
   * @param [object] options
   * @returns [string] 已加密内容
   */
  privateFun.createHash = function (encryption, message, options) {
    options = options || {
      hash: 'hex'
    };
    return Crypto.createHash(encryption)
      .update(message || '')
      .digest(options.hash);
  };

  /**
   * @description  公用加密算法（createHmac）
   * @param [string] encryption 加密方式
   * @param [string] message 待加密内容
   * @returns [string] 已加密内容
   */
  privateFun.createHmac = function (encryption, message, key, options) {
    options = options || {
      hash: 'hex'
    };
    return Crypto.createHmac(encryption, key || '')
      .update(message || '')
      .digest(options.hash);
  };

  /**
   * md5数据加密
   * @param {string} info 需加密信息体
   * return {string} md5加密后信息
   */
  publicFun.md5 = function (info) {
    return privateFun.createHash('md5', info);
  };

  /**
   * HmacSHA1数据加密
   * @param {string} info 需加密信息体
   * @param {string} key 密钥
   * @param {object} options 配置
   * return {string} HmacSHA1加密后信息
   */
  publicFun.HmacSHA1 = function (info, key, options) {
    return privateFun.createHmac('sha1', info, key, options);
  };

  /**
   * HmacSHA256数据加密
   * @param {string} info 需加密信息体
   * @param {string} key 密钥
   * @param {object} options 配置
   * return {string} HmacSHA256加密后信息
   */
  publicFun.HmacSHA256 = function (info, key, options) {
    return privateFun.createHmac('sha256', info, key, options);
  };
  /**
   * HmacSHA224
   * @param {string} info 需加密信息体
   * @param {string} key 密钥
   * @param {object} options 配置
   * return {string} HmacSHA224加密后信息
   */
  publicFun.HmacSHA224 = function (info, key, options) {
    return privateFun.createHmac('sha224', info, key, options);
  };
  /**
   * HmacSHA384
   * @param {string} info 需加密信息体
   * @param {string} key 密钥
   * @param {object} options 配置
   * return {string} HmacSHA384加密后信息
   */
  publicFun.HmacSHA384 = function (info, key, options) {
    return privateFun.createHmac('sha384', info, key, options);
  };
  /**
   * HmacSHA512
   * @param {string} info 需加密信息体
   * @param {string} key 密钥
   * @param {object} options 配置
   * return {string} HmacSHA512加密后信息
   */
  publicFun.HmacSHA512 = function (info, key, options) {
    return privateFun.createHmac('sha512', info, key, options);
  };

  /**
   * sha1数据加密
   * @param {string} info 需加密信息体
   * @param {object} options 配置
   * return {string} sha1加密后信息
   */
  publicFun.sha1 = function (info, options) {
    return privateFun.createHash('sha1', info, options);
  };

  /**
   * sha256数据加密
   * @param {string} info 需加密信息体
   * @param {object} options 配置
   * return {string} sha256加密后信息
   */
  publicFun.sha256 = function (info, options) {
    return privateFun.createHash('sha256', info, options);
  };
  /**
   * sha224
   * @param {string} info 需加密信息体
   * @param {object} options 配置
   * return {string} sha224加密后信息
   */
  publicFun.sha224 = function (info, options) {
    return privateFun.createHash('sha224', info, options);
  };
  /**
   * sha384
   * @param {string} info 需加密信息体
   * @param {object} options 配置
   * return {string} sha384加密后信息
   */
  publicFun.sha384 = function (info, options) {
    return privateFun.createHash('sha384', info, options);
  };
  /**
   * sha512
   * @param {string} info 需加密信息体
   * @param {object} options 配置
   * return {string} sha512加密后信息
   */
  publicFun.sha512 = function (info, options) {
    return privateFun.createHash('sha512', info, options);
  };

  /**
   * RS256
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} RS256加密后信息
   */
  publicFun.RS256 = function (info, privateKey, options) {
    if (typeof options === 'string') {
      options = {
        hash: options
      };
    }
    return privateFun.createSign('RSA-SHA256', info, privateKey, options);
  };

  /**
   * RS384
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} RS384加密后信息
   */
  publicFun.RS384 = function (info, privateKey, options) {
    return privateFun.createSign('RSA-SHA384', info, privateKey, options);
  };

  /**
   * RS512
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} RS512加密后信息
   */
  publicFun.RS512 = function (info, privateKey, options) {
    return privateFun.createSign('RSA-SHA512', info, privateKey, options);
  };
  /**
   * RS1
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} RSA-SHA1加密后信息
   */
  publicFun.RS1 = function (info, privateKey, options) {
    if (typeof options === 'string') {
      options = {
        hash: options
      };
    }
    return privateFun.createSign('RSA-SHA1', info, privateKey, options);
  };
  /**
   * ES256
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} ES256加密后信息
   */
  publicFun.ES256 = function (info, privateKey, options) {
    return privateFun.createEcdsa()('256', info, privateKey, options);
  };

  /**
   * ES384
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} ES384加密后信息
   */
  publicFun.ES384 = function (info, privateKey, options) {
    return privateFun.createEcdsa()('384', info, privateKey, options);
  };

  /**
   * ES512
   * @param {string} info 需加密信息体
   * @param {string} priviteKey 私钥
   * @param {object} options 配置
   * return {string} ES512加密后信息
   */
  publicFun.ES512 = function (info, privateKey, options) {
    return privateFun.createEcdsa()('512', info, privateKey, options);
  };

  /**
   * base64 to base64Url
   * @param {string} info 需转换信息体
   * return {string} base64Url 信息体
   */
  publicFun.setBase64Url = function (info) {
    return info.replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
  };
  /**
   * String/object to base64
   * @param {string/object} info 需转换信息体
   * @param {object} options 可选项
   * return {string} base64 信息体
   */
  publicFun.stringToBase64 = function (info, options) {
    options = options || {
      toUrl: false
    };
    let output = '';
    switch (typeof info) {
      case 'string': {
        output = info;
        break;
      }
      default: {
        output = JSON.stringify(info);
        break;
      }
    }
    output = Buffer.from(output).toString('base64');
    if (options.toUrl) {
      return publicFun.setBase64Url(output);
    }
    return output;
  };

  /**
   * uuid生成器
   * return {string} uuid
   */
  publicFun.uuidGeneration = function (info, options) {
    var template = {
      array: [],
      hexSingle: '0123456789abcdef'
    };
    for (var i = 0; i < 36; i++) {
      template.array[i] = template.hexSingle.substr(Math.floor(Math.random() * 0x10), 1);
    }
    template.array[14] = '4';
    template.array[19] = template.hexSingle.substr((template.array[19] & 0x3) | 0x8, 1);
    template.array[8] = template.array[13] = template.array[18] = template.array[23] = '-';
    return template.array.join('');
  };
  publicFun.getMicrosToMsStr = (inputStartTime, inputEndTime) => {
    if (inputStartTime === undefined || inputEndTime === undefined) return '0.00';
    let tmpSecondDiff = inputEndTime[0] - inputStartTime[0];
    let tmpNanoSecondDiff = inputEndTime[1] - inputStartTime[1];
    let tmpDiffInNanoSecond = tmpSecondDiff * TIMINGSUMMARY.NS_PER_SEC + tmpNanoSecondDiff;
    let tmpOutput = tmpDiffInNanoSecond / TIMINGSUMMARY.MS_PER_NS;
    if (tmpOutput < 0) {
      return '0.00';
    } else {
      return '' + tmpOutput.toFixed(2);
    }
  };
  /**
   * @desc RSA 公私钥 加密
   * @param {string/object} inputKey 密钥
   * @param {string} inputData 待处理数据
   * @param {object} inputHash 结果的编码格式,base64(默认)/hex
   * @return {string} 结果字符串
   */
  publicFun.rsaPublicEncrypt = (inputKey, inputData, inputHash = 'base64') => {
    if (typeof inputKey === 'object' && typeof inputKey.padding === 'string') {
      inputKey.padding = Crypto.constants[inputKey.padding];
    }
    return Crypto.publicEncrypt(inputKey, new Buffer.from(inputData, 'utf8')).toString(inputHash);
  };
  publicFun.rsaPrivateEncrypt = (inputKey, inputData, inputHash = 'base64') => {
    if (typeof inputKey === 'object' && typeof inputKey.padding === 'string') {
      inputKey.padding = Crypto.constants[inputKey.padding];
    }
    return Crypto.privateEncrypt(inputKey, new Buffer.from(inputData, 'utf8')).toString(inputHash);
  };
  /**
   * @desc RSA 公私钥 解密
   * @param {string/object} inputKey 密钥
   * @param {string} inputData 待处理数据
   * @param {object} inputHash 结果的编码格式,base64(默认)/hex
   * @return {string} 结果字符串
   */
  publicFun.rsaPublicDecrypt = (inputKey, inputData, inputHash = 'base64') => {
    if (typeof inputKey === 'object' && typeof inputKey.padding === 'string') {
      inputKey.padding = Crypto.constants[inputKey.padding];
    }
    return Crypto.publicDecrypt(inputKey, new Buffer.from(inputData, inputHash)).toString('utf-8');
  };
  publicFun.rsaPrivateDecrypt = (inputKey, inputData, inputHash = 'base64') => {
    if (typeof inputKey === 'object' && typeof inputKey.padding === 'string') {
      inputKey.padding = Crypto.constants[inputKey.padding];
    }
    return Crypto.privateDecrypt(inputKey, new Buffer.from(inputData, inputHash)).toString('utf-8');
  };
  exports.core = publicFun;
})();
