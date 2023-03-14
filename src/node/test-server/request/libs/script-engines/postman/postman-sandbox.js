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
//Example code
// const code1 = `pm.globals.set("global_key","value")`;
// const code2 = `pm.request.addHeader({"key":"header","value":new Date().getTime()});`;
// const code5 = ` pm.request.body.formdata.push({
//       key: "test1",
//       value:'formcode'
//     })`;
// // !unsuport
// const code3 = `pm.sendRequest("https://postman-echo.com/get", function (err, response) {
//     pm.request.addHeader({"key":"header","value":response.json()})
//   });`;
// const code4 = `pm.test("Status code is 200", function () {
//       pm.response.to.have.status(200);
//   });`;
const executeSync = (ctx, code, options) => {
  return new Promise((resolve, reject) => {
    const id = Crypto.randomUUID();
    ctx.execute(
      `const pc=pm;${code}`,
      {
        debug: true,
        id: id,
        context: options.context
      },
      function (err, result) {
        if (err) {
          // console.error('extecute error: ', err);
          resolve([null, err]);
          return;
        }
        // console.log('extecute result:', JSON.stringify(result));
        resolve([result, null]);
      }
    );
  });
};
module.exports = {
  createContextAsync,
  executeSync
};
