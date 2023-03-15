/**
 * Web Test use Ipc to communicate
 */

const _LibsFlowCommon = require('../request/unit.js');
const _LibsCommon = require('../request/libs/common.js');
// Koa reliance
const koaBody = require('koa-body');
const Koa = require('koa');
const cors = require('@koa/cors');
const app = new Koa();
const port = process.env.TEST_SERVER_PORT || 4201;

process.on('uncaughtException', err => {
  console.error('uncaughtException', err);
});
app.use(cors());
app.use(koaBody());

app.use(async (ctx, next) => {
  if (ctx.method !== 'POST') {
    ctx.body = 'Hello World';
    return;
  }
  switch (ctx.url) {
    case '/api/unit': {
      let reqJSON = ctx.request.body.data;
      reqJSON.env = _LibsCommon.parseEnv(reqJSON.env);
      await new _LibsFlowCommon.core().main(reqJSON).then(({ globals, report, history }) => {
        ['general', 'requestInfo', 'resultInfo'].forEach(keyName => {
          if (typeof history[keyName] === 'string') history[keyName] = JSON.parse(history[keyName]);
        });
        ctx.body = JSON.stringify({
          action: 'finish',
          data: {
            id: ctx.request.body.id,
            report: report,
            history: history,
            globals: globals
          }
        });
      });
      break;
    }
  }
  next();
});

app.listen(port);
console.log(`Unit Server is running at port ${port} ...`);
