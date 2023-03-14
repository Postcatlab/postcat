let _LibsFlowCommon = require('../src/node/test-server/request/unit.js');
let _LibsCommon = require('../src/node/test-server/request/libs/common.js');

module.exports = (req, res) => {
  console.log('unit.js', req.body);
  try {
    let reqJSON = req.body.data;
    reqJSON.env = _LibsCommon.parseEnv(reqJSON.env);
    new _LibsFlowCommon.core().main(reqJSON).then(({ globals, report, history }) => {
      ['general', 'requestInfo', 'resultInfo'].forEach(keyName => {
        if (typeof history[keyName] === 'string') history[keyName] = JSON.parse(history[keyName]);
      });
      res.send(
        JSON.stringify({
          action: 'finish',
          data: {
            id: req.body.id,
            globals: globals,
            report: report,
            history: history
          }
        })
      );
    });
  } catch (e) {
    console.error('unit.js', e, req.body);
  }
};
