let _LibsFlowCommon = require('../src/workbench/node/request/unit.js');
let _LibsCommon = require('../src/workbench/node/request/libs/common.js');

module.exports = (req, res) => {
  console.log('unit.js', req.body);
  try {
    let reqJSON = req.body.data;
    reqJSON.env = _LibsCommon.parseEnv(reqJSON.env);
    new _LibsFlowCommon.core().main(reqJSON).then(({ report, history }) => {
      ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
        if (typeof history[keyName] === 'string') history[keyName] = JSON.parse(history[keyName]);
      });
      res.send(
        JSON.stringify({
          action: 'finish',
          data: {
            id: ctx.request.body.id,
            report: report,
            history: history,
          },
        })
      );
    });
  } catch (e) {
    console.error('unit.js', e, req.body);
  }
};
