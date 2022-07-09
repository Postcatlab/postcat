const _LibsFlowCommon = require('../request/unit.js');
const _LibsCommon = require('../request/libs/common.js');
const querystring = require('querystring');

/**
 * Web Test use Ipc to communicate
 */

const http = require('http');

const requestListener = function (req, res) {
  let reqText = '';
  req.on('data', function (chunk) {
    reqText += chunk;
  });
  req.on('end', function () {
    reqText = querystring.parse(reqText);
  });
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') {
    res.writeHead(200);
    res.end('Error method');
    return;
  }
  if (req.url === 'api/unit') {
    try {
      let reqJSON = JSON.parse(reqText);
      reqJSON.env = _LibsCommon.parseEnv(reqJSON.env);
      new _LibsFlowCommon.core().main(data, (tmpInputReport, tmpInputHistory) => {
        ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
          if (typeof tmpInputHistory[keyName] === 'string')
            tmpInputHistory[keyName] = JSON.parse(tmpInputHistory[keyName]);
        });
        res.writeHead(200);
        res.end(
          JSON.stringify({
            action: 'finish',
            data: {
              id: req.body.id,
              report: tmpInputReport,
              history: tmpInputHistory,
            },
          })
        );
      });
    } catch (e) {
      console.log(e);
      res.writeHead(200);
      res.end(e);
    }
  }
  res.writeHead(404);
  res.end('API not find!');
};

const server = http.createServer(requestListener);
// 
server.listen(4201);
