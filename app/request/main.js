let _LibsFlowCommon = require('./unit.js');
let _LibsCommon = require('./libs/common.js');
process.on('message', (message) => {
  switch (message.action) {
    case 'ajax': {
      message.data.env = _LibsCommon.parseEnv(message.data.env);
      new _LibsFlowCommon.core().main(message.data, (tmpInputReport, tmpInputHistory) => {
        ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
          if (typeof tmpInputHistory[keyName] === 'string')
            tmpInputHistory[keyName] = JSON.parse(tmpInputHistory[keyName]);
        });
        process.send({
          action: 'finish',
          data: {
            report: tmpInputReport,
            history: tmpInputHistory,
          },
        });
      });
      break;
    }
  }
});
