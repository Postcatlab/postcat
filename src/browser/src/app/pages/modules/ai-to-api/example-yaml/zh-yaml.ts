export const zhExampleYaml =
  'openapi: 3.0.0\n' +
  'info:\n' +
  '  title: "用户登录接口"\n' +
  '  version: 1.0.0\n' +
  '  description: "用户登录接口，密码需要进行 MD5 加密，返回用户 Token"\n' +
  'servers:\n' +
  '  - url: demo.com/v1\n' +
  '    description: "用户服务"\n' +
  '\n' +
  'paths:\n' +
  '  /login:\n' +
  '    post:\n' +
  '      summary: "用户登录"\n' +
  '      description: "用户登录接口，密码需要进行 MD5 加密，返回用户 Token"\n' +
  '      requestBody:\n' +
  '        description: User credentials for authentication.\n' +
  '        required: true\n' +
  '        content:\n' +
  '          application/json:\n' +
  '            schema:\n' +
  '              required: \n' +
  '                - user_name\n' +
  '                - user_password\n' +
  '              type: object\n' +
  '              properties:\n' +
  '                user_name:\n' +
  '                  description: "用户名"\n' +
  '                  type: string\n' +
  '                  example: jackliu\n' +
  '                user_password:\n' +
  '                  description: "用户密码，需要进行MD5加密"\n' +
  '                  type: string\n' +
  '                  example: "MyPassword123"\n' +
  '      responses:\n' +
  "        '200':\n" +
  '          description: "成功"\n' +
  '          content:\n' +
  '            application/json:\n' +
  '              schema:\n' +
  '                required: \n' +
  '                  - token\n' +
  '                type: object\n' +
  '                properties:\n' +
  '                  token:\n' +
  '                    description: 用户 token\n' +
  '                    type: string\n' +
  '                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"\n' +
  "        '401':\n" +
  '          description: "登录失败，非法的用户信息"';
