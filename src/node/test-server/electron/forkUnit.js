let _LibsFlowCommon = require('../request/unit.js');
let _LibsCommon = require('../request/libs/common.js');
process.on('message', async message => {
  switch (message.action) {
    case 'setGlobal': {
      global['__HOME_DIR'] = message.data.homeDir;
      break;
    }
    case 'ajax': {
      message.data.env = _LibsCommon.parseEnv(message.data.env);
      await new _LibsFlowCommon.core().main(message.data).then(({ globals, report, history }) => {
        ['general', 'requestInfo', 'resultInfo'].forEach(keyName => {
          if (typeof history[keyName] === 'string') history[keyName] = JSON.parse(history[keyName]);
        });
        process.send({
          action: 'finish',
          data: {
            id: message.id,
            report: report,
            history: history,
            globals: globals
          }
        });
      });
      break;
    }
  }
});
