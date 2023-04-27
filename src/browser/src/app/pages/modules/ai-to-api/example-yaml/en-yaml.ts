export const enExampleYaml =
  'openapi: 3.0.0\n' +
  'info:\n' +
  '  title: User Login API\n' +
  '  version: 1.0.0\n' +
  '  description: This API generates user token after login authentication.\n' +
  'servers:\n' +
  '  - url: demo.com/v1\n' +
  '    description: User server\n' +
  '\n' +
  'paths:\n' +
  '  /login:\n' +
  '    post:\n' +
  '      summary: User Login\n' +
  '      description: This endpoint authenticates the user and generates a token.\n' +
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
  '                  description: User name.\n' +
  '                  type: string\n' +
  '                  example: john.doe@example.com\n' +
  '                user_password:\n' +
  '                  description: User password.\n' +
  '                  type: string\n' +
  '                  example: "MyPassword123"\n' +
  '      responses:\n' +
  "        '200':\n" +
  '          description: Authentication successful\n' +
  '          content:\n' +
  '            application/json:\n' +
  '              schema:\n' +
  '                required: \n' +
  '                  - token\n' +
  '                type: object\n' +
  '                properties:\n' +
  '                  token:\n' +
  '                    description: User authentication token\n' +
  '                    type: string\n' +
  '                    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"\n' +
  "        '401':\n" +
  '          description: Authentication failed - invalid credentials.';
