/**
 * postman-sandbox - A sandbox for Postman scripts
 * Preview: https://github.dev/mojaloop/ml-testing-toolkit/blob/aa585cfeb84e6e4a13684d40992ccb73df70b2d5/src/lib/scripting-engines/vm-javascript-sandbox.js
 */
const Sandbox = require('postman-sandbox');
const Crypto = require('crypto');
const createContextAsync = async opts => {
  return new Promise((resolve, reject) => {
    Sandbox.createContext(opts, function (err, ctx) {
      if (err) {
        reject(err);
        return console.error(err);
      }
      ctx.on('error', () => {
        // log the error in postman sandbox
        console.log('createContext error: ', err);
      });
      resolve(ctx);
    });
  });
};

const executeSync = (ctx, code, options) => {
  return new Promise((resolve, reject) => {
    const id = Crypto.randomUUID();
    const code1 = `pm.globals.set("global_key","value")`;
    const code2 = `pm.request.addHeader({"key":"header","value":new Date().getTime()});`;
    const code5 = ` pm.request.body.formdata.push({
      key: "test1",
      value:'formcode'
    })`;
    // !unsuport
    const code3 = `pm.sendRequest("https://postman-echo.com/get", function (err, response) {
    pm.request.addHeader({"key":"header","value":response.json()})
  });`;
    const code4 = `pm.test("Status code is 200", function () {
      pm.response.to.have.status(200);
  });
  `;
    ctx.execute(
      code4,
      {
        debug: true,
        id: id,
        context: {
          enviroment: [],
          target: 'test',
          request: {
            url: {
              path: 'https://www.baidu.com',
              query: [{ key: 'test', value: 'query' }]
            },
            body: {
              mode: 'formdata',
              formdata: [{ key: 'test', value: 'formdata' }]
            },
            method: 'GET',
            headers: [{ key: 'header0', value: 'headervalue0' }]
          },
          globals: [],
          response: {
            status: 'OK',
            code: 200,
            header: [16],
            cookie: [0],
            responseTime: 904,
            responseSize: 231066
          }
        }
      },
      function (err, result) {
        if (err) {
          reject([null, err]);
          return console.error('extecute error: ', err);
        }
        console.log('extecute result:', JSON.stringify(result));
        resolve([result, null]);
      }
    );
    ctx.on(`execution.assertion`, () => {
      console.log('execution.assertion', arguments);
    });
    ctx.on(`execution.assertion.${id}`, () => {
      console.log('execution.assertion', arguments);
    });
  });
};
// async function init() {
//   const ctx = await createContextAsync({ timeout: 10000, disableLegacyAPIs: true });
// }
// init();

module.exports = {
  createContextAsync,
  executeSync
};
