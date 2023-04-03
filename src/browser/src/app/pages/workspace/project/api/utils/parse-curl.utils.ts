/**
 * Source code from https://github.com/tj/parse-curl.js by @TJ Holowaychuk
 */
import { getQueryFromURL } from 'pc/browser/src/app/pages/workspace/project/api/utils/api.utils';
import { split } from 'shellwords-ts';

/**
 * Rewrite args for special cases such as -XPUT.
 */

function rewrite(args) {
  return args.reduce(function (args, a) {
    if (0 === a.indexOf('-X')) {
      args.push('-X');
      args.push(a.slice(2));
    } else {
      args.push(a);
    }

    return args;
  }, []);
}

/**
 * Parse header field.
 */

function parseField(s) {
  return s.split(/: (.+)/);
}

/**
 * Check if `s` looks like a url.
 */

function isURL(s) {
  try {
    const URLObj = new URL(s);
    if (!URLObj.hostname) return false;
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Attempt to parse the given curl string.
 */

export const parseCurl = function (s) {
  if (0 != s.indexOf('curl ')) return;
  const args = rewrite(split(s));
  const out: {
    url: string;
    query?: { [key: string]: string };
    method: string;
    header: { [key: string]: string };
    contentType?: string;
    body?: string;
  } = { method: 'GET', url: '', header: {}, body: '' };
  let state = '';

  args.forEach(function (arg) {
    switch (true) {
      case isURL(arg):
        out.url = arg.split('?')[0];
        out.query = getQueryFromURL(arg);
        break;

      case arg === '-A' || arg === '--user-agent':
        state = 'user-agent';
        break;

      case arg === '-H' || arg === '--header':
        state = 'header';
        break;

      case ['-d', '--data', '--data-ascii', '--data-raw', '--data-binary', '--data-urlencode'].includes(arg):
        state = 'data';
        break;

      case arg === '-u' || arg === '--user':
        state = 'user';
        break;

      case arg === '-I' || arg === '--head':
        out.method = 'HEAD';
        break;

      case arg === '-X' || arg === '--request':
        state = 'method';
        break;

      case arg === '-b' || arg === '--cookie':
        state = 'cookie';
        break;

      case arg === '--compressed':
        out.header['Accept-Encoding'] = out.header['Accept-Encoding'] || 'deflate, gzip';
        break;

      /**
       * State handler
       */
      case !!arg:
        switch (state) {
          case 'header':
            var field = parseField(arg);
            out.header[field[0]] = field[1];
            state = '';
            break;
          case 'user-agent':
            out.header['User-Agent'] = arg;
            state = '';
            break;
          case 'data':
            if (out.method === 'GET' || out.method === 'HEAD') out.method = 'POST';
            out.header['Content-Type'] ??= out.header['Content-Type'] || out.header['content-type'] || 'application/x-www-form-urlencoded';
            out.body = out.body ? `${out.body}&${arg}` : arg;
            state = '';
            break;
          case 'user':
            out.header['Authorization'] = `Basic ${btoa(arg)}`;
            state = '';
            break;
          case 'method':
            out.method = arg;
            state = '';
            break;
          case 'cookie':
            out.header['Set-Cookie'] = arg;
            state = '';
            break;
        }
        break;
    }
  });
  out.contentType = out.header['Content-Type'];
  return out;
};
