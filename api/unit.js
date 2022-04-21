let _LibsFlowCommon = require('../src/workbench/node/request/unit.js');
let _LibsCommon = require('../src/workbench/node/request/libs/common.js');

module.exports = (req, res) => {
  console.log('unit.js', req.body);
  try {
    let data = req.body.data;
    data.env = _LibsCommon.parseEnv(data.env);
    new _LibsFlowCommon.core().main(data, (tmpInputReport, tmpInputHistory) => {
      ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
        if (typeof tmpInputHistory[keyName] === 'string')
          tmpInputHistory[keyName] = JSON.parse(tmpInputHistory[keyName]);
      });
      res.send(
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
    console.error('unit.js', e, req.body);
  }
};