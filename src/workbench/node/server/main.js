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
const port = 4201;

app.use(cors());
app.use(koaBody());

app.use(async (ctx, next) => {
  if (ctx.method !== 'POST') {
    ctx.body = 'Hello World';
    return;
  }
  switch (ctx.url) {
    case '/api/unit': {
      // let reqJSON = ctx.request.body.data;
      let reqJSON = {
        requestType: '0',
        headers: [
          { headerName: '{{codeGlobalParams}}', headerValue: '{{codeGlobalParams}}', paramInfo: '', checkbox: true },
        ],
        URL: 'https://eolinker.w.eolink.com/home/api_studio/inside/api/test?apiID=5622520&groupID=1369696&projectHashKey=ccsIhPl17503a6b2326f09fbc4e3a7c03874c7333002038&spaceKey=eolinker',
        beforeInject:
          'eo.http.url.get(); //获取原始的http协议eo.http.apiUrl，不包含环境的base eo.http.apiUrl，比如/user/login/{user_type}?user_name={{name}}\neo.http.url.parse(); //获取经过解析处理后的http协议eo.http.apiUrl，包含环境的base eo.http.apiUrl，比如www.eolinker.com/user/login/admin?user_name=jackliu\neo.http.url.set("47.95.203.198:8080/Web/Test/all/{name}"); //设置http协议eo.http.apiUrl，比如/user/login/admin?user_name={{name}}\neo.http.header.get("param_key"); //获取http协议请求头部参数值\neo.http.header.set("param_key","param_value"); //获取http协议请求头部参数值\neo.http.header.unset("param_key"); //删除http协议header参数\neo.http.header.clear; //清空http协议header参数\neo.http.query.get("param_key"); //获取http协议eo.http.queryParam参数\neo.http.query.set("param_key","param_value"); //设置http协议eo.http.queryParam参数\neo.http.query.unset("param_key"); //删除http协议eo.http.queryParam参数（删除后不会出现在地址栏中）\neo.http.query.clear; //清空http协议eo.http.queryParam参数\neo.http.rest.get("param_key"); //获取http协议rest参数\neo.http.rest.set("name","print"); //设置http协议eo.http.queryParam参数\neo.http.rest.set("param_key","print"); //设置http协议rest参数\neo.http.rest.unset("param_key"); //删除http协议rest参数\neo.http.rest.clear; //清空http协议rest参数\neo.env.http.baseUrl.get(); //获取环境http协议的base eo.http.apiUrl\neo.env.http.baseUrl.set("new_base_url"); //设置环境http协议的base eo.http.apiUrl\neo.env.http.header.get("param_key"); //获取环境http协议的头部参数\neo.env.http.header.set("param_key","param_value"); //获取环境http协议的头部参数\neo.env.http.header.unset("param_key"); //删除环境http协议的header参数\neo.env.http.header.clear; //清空环境http协议的header参数\neo.env.http.extraFormData.get("param_key"); //获取环境http协议的额外表单参数\neo.env.http.extraFormData.set("param_key","param_value"); //设置环境http协议的额外表单参数\neo.env.http.extraFormData.unset("param_key"); //删除环境http协议的额外表单参数\neo.env.http.query.get("param_key"); //获取环境http协议的eo.http.queryParam参数\neo.env.http.query.set("param_key","param_value"); //设置环境http协议的eo.http.queryParam参数\neo.env.http.query.unset("param_key"); //删除环境http协议的eo.http.queryParam参数（删除后不会出现在地址栏中）\neo.env.http.query.clear; //清空环境http协议的eo.http.queryParam参数\neo.env.param.get("param_key"); //获取环境变量\neo.env.param.set("codeGlobalParams","param_value"); //设置环境变量\neo.env.param.set("param_key","param_value"); //设置环境变量\neo.env.param.unset("param_key"); //删除环境变量\neo.info(eo.http.headerParam)\neo.info(eo.http.restParam)\neo.info(eo.http.queryParam)\neo.info(eo.http.apiUrl)',
        afterInject:
          '\neo.info(eo.http.response.get()); //获取http协议返回结果\neo.http.response.set("response_value"); //获取http协议返回结果\neo.env.http.extraFormData.clear(); //清空环境http协议的额外表单参数\neo.env.param.clear(); //清空环境变量',
        advancedSetting: { requestRedirect: 1, checkSSL: 0, sendEoToken: 1, sendNocacheToken: 0 },
        apiRequestParamJsonType: '0',
        methodType: '0',
        httpHeader: 0,
        method: 'POST',
        env: {
          envName: '',
          frontURI: '',
          headerList: [
            {
              headerName: 'Content-Type',
              headerValue: 'application/x-www-form-urlencoded',
              checkbox: true,
              isStaticTop: true,
            },
          ],
          paramList: [],
          additionalParamList: [],
          envAuth: { status: '0' },
          urlParamList: [],
        },
        auth: { status: '0' },
        testTime: '2022-07-14 14:27:58',
        status: 'ajax',
        globals: {},
        globalHeader: {},
        params: [{ paramType: '0', paramKey: '{{codeGlobalParams}}', paramInfo: 'test', checkbox: true }],
      };
      reqJSON.env = _LibsCommon.parseEnv(reqJSON.env);
      await new _LibsFlowCommon.core().main(reqJSON).then(({ report, history }) => {
        ['general', 'requestInfo', 'resultInfo'].forEach((keyName) => {
          if (typeof history[keyName] === 'string') history[keyName] = JSON.parse(history[keyName]);
        });
        ctx.body = JSON.stringify({
          action: 'finish',
          data: {
            id: ctx.request.body.id,
            report: report,
            history: history,
          },
        });
      });
      break;
    }
  }
  next();
});

app.listen(port);
