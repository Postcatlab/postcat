(function () {
  'use strict';
  class mainClass {
    constructor() {}
    byContent(buf) {
      if (!(buf && buf.length > 1)) {
        return null;
      }

      if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) {
        return {
          ext: 'jpg',
          mime: 'image/jpeg'
        };
      }

      if (buf[0] === 0x89 && buf[1] === 0x50 && buf[2] === 0x4e && buf[3] === 0x47) {
        return {
          ext: 'png',
          mime: 'image/png'
        };
      }

      if (buf[0] === 0x47 && buf[1] === 0x49 && buf[2] === 0x46) {
        return {
          ext: 'gif',
          mime: 'image/gif'
        };
      }

      if (buf[8] === 0x57 && buf[9] === 0x45 && buf[10] === 0x42 && buf[11] === 0x50) {
        return {
          ext: 'webp',
          mime: 'image/webp'
        };
      }

      if (buf[0] === 0x46 && buf[1] === 0x4c && buf[2] === 0x49 && buf[3] === 0x46) {
        return {
          ext: 'flif',
          mime: 'image/flif'
        };
      }

      // needs to be before `tif` check
      if (
        ((buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0x0) ||
          (buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0x0 && buf[3] === 0x2a)) &&
        buf[8] === 0x43 &&
        buf[9] === 0x52
      ) {
        return {
          ext: 'cr2',
          mime: 'image/x-canon-cr2'
        };
      }

      if (
        (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0x2a && buf[3] === 0x0) ||
        (buf[0] === 0x4d && buf[1] === 0x4d && buf[2] === 0x0 && buf[3] === 0x2a)
      ) {
        return {
          ext: 'tif',
          mime: 'image/tiff'
        };
      }

      if (buf[0] === 0x42 && buf[1] === 0x4d) {
        return {
          ext: 'bmp',
          mime: 'image/bmp'
        };
      }

      if (buf[0] === 0x49 && buf[1] === 0x49 && buf[2] === 0xbc) {
        return {
          ext: 'jxr',
          mime: 'image/vnd.ms-photo'
        };
      }

      if (buf[0] === 0x38 && buf[1] === 0x42 && buf[2] === 0x50 && buf[3] === 0x53) {
        return {
          ext: 'psd',
          mime: 'image/vnd.adobe.photoshop'
        };
      }

      // needs to be before `zip` check
      if (
        buf[0] === 0x50 &&
        buf[1] === 0x4b &&
        buf[2] === 0x3 &&
        buf[3] === 0x4 &&
        buf[30] === 0x6d &&
        buf[31] === 0x69 &&
        buf[32] === 0x6d &&
        buf[33] === 0x65 &&
        buf[34] === 0x74 &&
        buf[35] === 0x79 &&
        buf[36] === 0x70 &&
        buf[37] === 0x65 &&
        buf[38] === 0x61 &&
        buf[39] === 0x70 &&
        buf[40] === 0x70 &&
        buf[41] === 0x6c &&
        buf[42] === 0x69 &&
        buf[43] === 0x63 &&
        buf[44] === 0x61 &&
        buf[45] === 0x74 &&
        buf[46] === 0x69 &&
        buf[47] === 0x6f &&
        buf[48] === 0x6e &&
        buf[49] === 0x2f &&
        buf[50] === 0x65 &&
        buf[51] === 0x70 &&
        buf[52] === 0x75 &&
        buf[53] === 0x62 &&
        buf[54] === 0x2b &&
        buf[55] === 0x7a &&
        buf[56] === 0x69 &&
        buf[57] === 0x70
      ) {
        return {
          ext: 'epub',
          mime: 'application/epub+zip'
        };
      }

      // needs to be before `zip` check
      // assumes signed .xpi from addons.mozilla.org
      if (
        buf[0] === 0x50 &&
        buf[1] === 0x4b &&
        buf[2] === 0x3 &&
        buf[3] === 0x4 &&
        buf[30] === 0x4d &&
        buf[31] === 0x45 &&
        buf[32] === 0x54 &&
        buf[33] === 0x41 &&
        buf[34] === 0x2d &&
        buf[35] === 0x49 &&
        buf[36] === 0x4e &&
        buf[37] === 0x46 &&
        buf[38] === 0x2f &&
        buf[39] === 0x6d &&
        buf[40] === 0x6f &&
        buf[41] === 0x7a &&
        buf[42] === 0x69 &&
        buf[43] === 0x6c &&
        buf[44] === 0x6c &&
        buf[45] === 0x61 &&
        buf[46] === 0x2e &&
        buf[47] === 0x72 &&
        buf[48] === 0x73 &&
        buf[49] === 0x61
      ) {
        return {
          ext: 'xpi',
          mime: 'application/x-xpinstall'
        };
      }

      if (
        buf[0] === 0x50 &&
        buf[1] === 0x4b &&
        (buf[2] === 0x3 || buf[2] === 0x5 || buf[2] === 0x7) &&
        (buf[3] === 0x4 || buf[3] === 0x6 || buf[3] === 0x8)
      ) {
        return {
          ext: 'zip',
          mime: 'application/zip'
        };
      }

      if (buf[257] === 0x75 && buf[258] === 0x73 && buf[259] === 0x74 && buf[260] === 0x61 && buf[261] === 0x72) {
        return {
          ext: 'tar',
          mime: 'application/x-tar'
        };
      }

      if (
        buf[0] === 0x52 &&
        buf[1] === 0x61 &&
        buf[2] === 0x72 &&
        buf[3] === 0x21 &&
        buf[4] === 0x1a &&
        buf[5] === 0x7 &&
        (buf[6] === 0x0 || buf[6] === 0x1)
      ) {
        return {
          ext: 'rar',
          mime: 'application/x-rar-compressed'
        };
      }

      if (buf[0] === 0x1f && buf[1] === 0x8b && buf[2] === 0x8) {
        return {
          ext: 'gz',
          mime: 'application/gzip'
        };
      }

      if (buf[0] === 0x42 && buf[1] === 0x5a && buf[2] === 0x68) {
        return {
          ext: 'bz2',
          mime: 'application/x-bzip2'
        };
      }

      if (buf[0] === 0x37 && buf[1] === 0x7a && buf[2] === 0xbc && buf[3] === 0xaf && buf[4] === 0x27 && buf[5] === 0x1c) {
        return {
          ext: '7z',
          mime: 'application/x-7z-compressed'
        };
      }

      if (buf[0] === 0x78 && buf[1] === 0x01) {
        return {
          ext: 'dmg',
          mime: 'application/x-apple-diskimage'
        };
      }

      if (
        (buf[0] === 0x0 &&
          buf[1] === 0x0 &&
          buf[2] === 0x0 &&
          (buf[3] === 0x18 || buf[3] === 0x20) &&
          buf[4] === 0x66 &&
          buf[5] === 0x74 &&
          buf[6] === 0x79 &&
          buf[7] === 0x70) ||
        (buf[0] === 0x33 && buf[1] === 0x67 && buf[2] === 0x70 && buf[3] === 0x35) ||
        (buf[0] === 0x0 &&
          buf[1] === 0x0 &&
          buf[2] === 0x0 &&
          buf[3] === 0x1c &&
          buf[4] === 0x66 &&
          buf[5] === 0x74 &&
          buf[6] === 0x79 &&
          buf[7] === 0x70 &&
          buf[8] === 0x6d &&
          buf[9] === 0x70 &&
          buf[10] === 0x34 &&
          buf[11] === 0x32 &&
          buf[16] === 0x6d &&
          buf[17] === 0x70 &&
          buf[18] === 0x34 &&
          buf[19] === 0x31 &&
          buf[20] === 0x6d &&
          buf[21] === 0x70 &&
          buf[22] === 0x34 &&
          buf[23] === 0x32 &&
          buf[24] === 0x69 &&
          buf[25] === 0x73 &&
          buf[26] === 0x6f &&
          buf[27] === 0x6d) ||
        (buf[0] === 0x0 &&
          buf[1] === 0x0 &&
          buf[2] === 0x0 &&
          buf[3] === 0x1c &&
          buf[4] === 0x66 &&
          buf[5] === 0x74 &&
          buf[6] === 0x79 &&
          buf[7] === 0x70 &&
          buf[8] === 0x69 &&
          buf[9] === 0x73 &&
          buf[10] === 0x6f &&
          buf[11] === 0x6d) ||
        (buf[0] === 0x0 &&
          buf[1] === 0x0 &&
          buf[2] === 0x0 &&
          buf[3] === 0x1c &&
          buf[4] === 0x66 &&
          buf[5] === 0x74 &&
          buf[6] === 0x79 &&
          buf[7] === 0x70 &&
          buf[8] === 0x6d &&
          buf[9] === 0x70 &&
          buf[10] === 0x34 &&
          buf[11] === 0x32 &&
          buf[12] === 0x0 &&
          buf[13] === 0x0 &&
          buf[14] === 0x0 &&
          buf[15] === 0x0)
      ) {
        return {
          ext: 'mp4',
          mime: 'video/mp4'
        };
      }

      if (
        buf[0] === 0x0 &&
        buf[1] === 0x0 &&
        buf[2] === 0x0 &&
        buf[3] === 0x1c &&
        buf[4] === 0x66 &&
        buf[5] === 0x74 &&
        buf[6] === 0x79 &&
        buf[7] === 0x70 &&
        buf[8] === 0x4d &&
        buf[9] === 0x34 &&
        buf[10] === 0x56
      ) {
        return {
          ext: 'm4v',
          mime: 'video/x-m4v'
        };
      }

      if (buf[0] === 0x4d && buf[1] === 0x54 && buf[2] === 0x68 && buf[3] === 0x64) {
        return {
          ext: 'mid',
          mime: 'audio/midi'
        };
      }

      // needs to be before the `webm` check
      if (
        buf[31] === 0x6d &&
        buf[32] === 0x61 &&
        buf[33] === 0x74 &&
        buf[34] === 0x72 &&
        buf[35] === 0x6f &&
        buf[36] === 0x73 &&
        buf[37] === 0x6b &&
        buf[38] === 0x61
      ) {
        return {
          ext: 'mkv',
          mime: 'video/x-matroska'
        };
      }

      if (buf[0] === 0x1a && buf[1] === 0x45 && buf[2] === 0xdf && buf[3] === 0xa3) {
        return {
          ext: 'webm',
          mime: 'video/webm'
        };
      }

      if (
        buf[0] === 0x0 &&
        buf[1] === 0x0 &&
        buf[2] === 0x0 &&
        buf[3] === 0x14 &&
        buf[4] === 0x66 &&
        buf[5] === 0x74 &&
        buf[6] === 0x79 &&
        buf[7] === 0x70
      ) {
        return {
          ext: 'mov',
          mime: 'video/quicktime'
        };
      }

      if (
        buf[0] === 0x52 &&
        buf[1] === 0x49 &&
        buf[2] === 0x46 &&
        buf[3] === 0x46 &&
        buf[8] === 0x41 &&
        buf[9] === 0x56 &&
        buf[10] === 0x49
      ) {
        return {
          ext: 'avi',
          mime: 'video/x-msvideo'
        };
      }

      if (
        buf[0] === 0x30 &&
        buf[1] === 0x26 &&
        buf[2] === 0xb2 &&
        buf[3] === 0x75 &&
        buf[4] === 0x8e &&
        buf[5] === 0x66 &&
        buf[6] === 0xcf &&
        buf[7] === 0x11 &&
        buf[8] === 0xa6 &&
        buf[9] === 0xd9
      ) {
        return {
          ext: 'wmv',
          mime: 'video/x-ms-wmv'
        };
      }

      if (buf[0] === 0x0 && buf[1] === 0x0 && buf[2] === 0x1 && buf[3].toString(16)[0] === 'b') {
        return {
          ext: 'mpg',
          mime: 'video/mpeg'
        };
      }

      if ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || (buf[0] === 0xff && buf[1] === 0xfb)) {
        return {
          ext: 'mp3',
          mime: 'audio/mpeg'
        };
      }

      if (
        (buf[4] === 0x66 &&
          buf[5] === 0x74 &&
          buf[6] === 0x79 &&
          buf[7] === 0x70 &&
          buf[8] === 0x4d &&
          buf[9] === 0x34 &&
          buf[10] === 0x41) ||
        (buf[0] === 0x4d && buf[1] === 0x34 && buf[2] === 0x41 && buf[3] === 0x20)
      ) {
        return {
          ext: 'm4a',
          mime: 'audio/m4a'
        };
      }

      // needs to be before `ogg` check
      if (
        buf[28] === 0x4f &&
        buf[29] === 0x70 &&
        buf[30] === 0x75 &&
        buf[31] === 0x73 &&
        buf[32] === 0x48 &&
        buf[33] === 0x65 &&
        buf[34] === 0x61 &&
        buf[35] === 0x64
      ) {
        return {
          ext: 'opus',
          mime: 'audio/opus'
        };
      }

      if (buf[0] === 0x4f && buf[1] === 0x67 && buf[2] === 0x67 && buf[3] === 0x53) {
        return {
          ext: 'ogg',
          mime: 'audio/ogg'
        };
      }

      if (buf[0] === 0x66 && buf[1] === 0x4c && buf[2] === 0x61 && buf[3] === 0x43) {
        return {
          ext: 'flac',
          mime: 'audio/x-flac'
        };
      }

      if (
        buf[0] === 0x52 &&
        buf[1] === 0x49 &&
        buf[2] === 0x46 &&
        buf[3] === 0x46 &&
        buf[8] === 0x57 &&
        buf[9] === 0x41 &&
        buf[10] === 0x56 &&
        buf[11] === 0x45
      ) {
        return {
          ext: 'wav',
          mime: 'audio/x-wav'
        };
      }

      if (buf[0] === 0x23 && buf[1] === 0x21 && buf[2] === 0x41 && buf[3] === 0x4d && buf[4] === 0x52 && buf[5] === 0x0a) {
        return {
          ext: 'amr',
          mime: 'audio/amr'
        };
      }

      if (buf[0] === 0x25 && buf[1] === 0x50 && buf[2] === 0x44 && buf[3] === 0x46) {
        return {
          ext: 'pdf',
          mime: 'application/pdf'
        };
      }

      if (buf[0] === 0x4d && buf[1] === 0x5a) {
        return {
          ext: 'exe',
          mime: 'application/x-msdownload'
        };
      }

      if ((buf[0] === 0x43 || buf[0] === 0x46) && buf[1] === 0x57 && buf[2] === 0x53) {
        return {
          ext: 'swf',
          mime: 'application/x-shockwave-flash'
        };
      }

      if (buf[0] === 0x7b && buf[1] === 0x5c && buf[2] === 0x72 && buf[3] === 0x74 && buf[4] === 0x66) {
        return {
          ext: 'rtf',
          mime: 'application/rtf'
        };
      }

      if (
        buf[0] === 0x77 &&
        buf[1] === 0x4f &&
        buf[2] === 0x46 &&
        buf[3] === 0x46 &&
        ((buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00) ||
          (buf[4] === 0x4f && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4f))
      ) {
        return {
          ext: 'woff',
          mime: 'application/font-woff'
        };
      }

      if (
        buf[0] === 0x77 &&
        buf[1] === 0x4f &&
        buf[2] === 0x46 &&
        buf[3] === 0x32 &&
        ((buf[4] === 0x00 && buf[5] === 0x01 && buf[6] === 0x00 && buf[7] === 0x00) ||
          (buf[4] === 0x4f && buf[5] === 0x54 && buf[6] === 0x54 && buf[7] === 0x4f))
      ) {
        return {
          ext: 'woff2',
          mime: 'application/font-woff'
        };
      }

      if (
        buf[34] === 0x4c &&
        buf[35] === 0x50 &&
        ((buf[8] === 0x00 && buf[9] === 0x00 && buf[10] === 0x01) ||
          (buf[8] === 0x01 && buf[9] === 0x00 && buf[10] === 0x02) ||
          (buf[8] === 0x02 && buf[9] === 0x00 && buf[10] === 0x02))
      ) {
        return {
          ext: 'eot',
          mime: 'application/octet-stream'
        };
      }

      if (buf[0] === 0x00 && buf[1] === 0x01 && buf[2] === 0x00 && buf[3] === 0x00 && buf[4] === 0x00) {
        return {
          ext: 'ttf',
          mime: 'application/font-sfnt'
        };
      }

      if (buf[0] === 0x4f && buf[1] === 0x54 && buf[2] === 0x54 && buf[3] === 0x4f && buf[4] === 0x00) {
        return {
          ext: 'otf',
          mime: 'application/font-sfnt'
        };
      }

      if (buf[0] === 0x00 && buf[1] === 0x00 && buf[2] === 0x01 && buf[3] === 0x00) {
        return {
          ext: 'ico',
          mime: 'image/x-icon'
        };
      }

      if (buf[0] === 0x46 && buf[1] === 0x4c && buf[2] === 0x56 && buf[3] === 0x01) {
        return {
          ext: 'flv',
          mime: 'video/x-flv'
        };
      }

      if (buf[0] === 0x25 && buf[1] === 0x21) {
        return {
          ext: 'ps',
          mime: 'application/postscript'
        };
      }

      if (buf[0] === 0xfd && buf[1] === 0x37 && buf[2] === 0x7a && buf[3] === 0x58 && buf[4] === 0x5a && buf[5] === 0x00) {
        return {
          ext: 'xz',
          mime: 'application/x-xz'
        };
      }

      if (buf[0] === 0x53 && buf[1] === 0x51 && buf[2] === 0x4c && buf[3] === 0x69) {
        return {
          ext: 'sqlite',
          mime: 'application/x-sqlite3'
        };
      }

      if (buf[0] === 0x4e && buf[1] === 0x45 && buf[2] === 0x53 && buf[3] === 0x1a) {
        return {
          ext: 'nes',
          mime: 'application/x-nintendo-nes-rom'
        };
      }

      if (buf[0] === 0x43 && buf[1] === 0x72 && buf[2] === 0x32 && buf[3] === 0x34) {
        return {
          ext: 'crx',
          mime: 'application/x-google-chrome-extension'
        };
      }

      if (
        (buf[0] === 0x4d && buf[1] === 0x53 && buf[2] === 0x43 && buf[3] === 0x46) ||
        (buf[0] === 0x49 && buf[1] === 0x53 && buf[2] === 0x63 && buf[3] === 0x28)
      ) {
        return {
          ext: 'cab',
          mime: 'application/vnd.ms-cab-compressed'
        };
      }

      // needs to be before `ar` check
      if (
        buf[0] === 0x21 &&
        buf[1] === 0x3c &&
        buf[2] === 0x61 &&
        buf[3] === 0x72 &&
        buf[4] === 0x63 &&
        buf[5] === 0x68 &&
        buf[6] === 0x3e &&
        buf[7] === 0x0a &&
        buf[8] === 0x64 &&
        buf[9] === 0x65 &&
        buf[10] === 0x62 &&
        buf[11] === 0x69 &&
        buf[12] === 0x61 &&
        buf[13] === 0x6e &&
        buf[14] === 0x2d &&
        buf[15] === 0x62 &&
        buf[16] === 0x69 &&
        buf[17] === 0x6e &&
        buf[18] === 0x61 &&
        buf[19] === 0x72 &&
        buf[20] === 0x79
      ) {
        return {
          ext: 'deb',
          mime: 'application/x-deb'
        };
      }

      if (
        buf[0] === 0x21 &&
        buf[1] === 0x3c &&
        buf[2] === 0x61 &&
        buf[3] === 0x72 &&
        buf[4] === 0x63 &&
        buf[5] === 0x68 &&
        buf[6] === 0x3e
      ) {
        return {
          ext: 'ar',
          mime: 'application/x-unix-archive'
        };
      }

      if (buf[0] === 0xed && buf[1] === 0xab && buf[2] === 0xee && buf[3] === 0xdb) {
        return {
          ext: 'rpm',
          mime: 'application/x-rpm'
        };
      }

      if ((buf[0] === 0x1f && buf[1] === 0xa0) || (buf[0] === 0x1f && buf[1] === 0x9d)) {
        return {
          ext: 'Z',
          mime: 'application/x-compress'
        };
      }

      if (buf[0] === 0x4c && buf[1] === 0x5a && buf[2] === 0x49 && buf[3] === 0x50) {
        return {
          ext: 'lz',
          mime: 'application/x-lzip'
        };
      }

      if (
        buf[0] === 0xd0 &&
        buf[1] === 0xcf &&
        buf[2] === 0x11 &&
        buf[3] === 0xe0 &&
        buf[4] === 0xa1 &&
        buf[5] === 0xb1 &&
        buf[6] === 0x1a &&
        buf[7] === 0xe1
      ) {
        return {
          ext: 'msi',
          mime: 'application/x-msi'
        };
      }

      return null;
    }
  }
  exports.core = mainClass;
})();
