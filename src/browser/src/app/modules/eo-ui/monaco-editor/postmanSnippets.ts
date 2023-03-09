/**
 * Copy from postman source code
 * package: @postman/script-examples/db.json
 * sourcemap file:_ar-assets/node_modules/@postman/script-examples
 * file: https://lively-crescent-175226.postman.co/_ar-assets/CollectionWorkbench-5fc7ac82a3bd34b1.min.js
 */
const SNIPPETS_PREREQ = [
  {
    name: 'Get an environment variable',
    description: 'Gets an environment variable',
    code: 'pm.environment.get("variable_key");'
  },
  {
    name: 'Get a global variable',
    description: 'Gets a global variable',
    code: 'pm.globals.get("variable_key");'
  },
  {
    name: 'Get a variable',
    description: 'Gets a variable (environment or global)',
    code: 'pm.variables.get("variable_key");'
  },
  {
    name: 'Get a collection variable',
    description: 'Gets a collection variable',
    code: 'pm.collectionVariables.get("variable_key");'
  },
  {
    name: 'Set an environment variable',
    description: 'Sets an environment variable',
    code: 'pm.environment.set("variable_key", "variable_value");'
  },
  {
    name: 'Set a global variable',
    description: 'Sets a global variable',
    code: 'pm.globals.set("variable_key", "variable_value");'
  },
  {
    name: 'Set a collection variable',
    description: 'Sets a collection variable',
    code: 'pm.collectionVariables.set("variable_key", "variable_value");'
  },
  {
    name: 'Clear an environment variable',
    description: 'Clears an environment variable if set',
    code: 'pm.environment.unset("variable_key");'
  },
  {
    name: 'Clear a global variable',
    description: 'Clears a global variable if set',
    code: 'pm.globals.unset("variable_key");'
  },
  {
    name: 'Clear a collection variable',
    description: 'Clears a collection variable if set',
    code: 'pm.collectionVariables.unset("variable_key");'
  },
  {
    name: 'Send a request',
    description: 'Sends a request',
    code: 'pm.sendRequest("https://postman-echo.com/get", function (err, response) {\n    console.log(response.json());\n});'
  }
];

const SNIPPETS_TEST = [
  {
    name: 'Get an environment variable',
    description: 'Gets an environment variable',
    code: 'pm.environment.get("variable_key");'
  },
  {
    name: 'Get a global variable',
    description: 'Gets a global variable',
    code: 'pm.globals.get("variable_key");'
  },
  {
    name: 'Get a variable',
    description: 'Gets a variable (environment or global)',
    code: 'pm.variables.get("variable_key");'
  },
  {
    name: 'Get a collection variable',
    description: 'Gets a collection variable',
    code: 'pm.collectionVariables.get("variable_key");'
  },
  {
    name: 'Set an environment variable',
    description: 'Sets an environment variable',
    code: 'pm.environment.set("variable_key", "variable_value");'
  },
  {
    name: 'Set a global variable',
    description: 'Sets a global variable',
    code: 'pm.globals.set("variable_key", "variable_value");'
  },
  {
    name: 'Set a collection variable',
    description: 'Sets a collection variable',
    code: 'pm.collectionVariables.set("variable_key", "variable_value");'
  },
  {
    name: 'Clear an environment variable',
    description: 'Clears an environment variable if set',
    code: 'pm.environment.unset("variable_key");'
  },
  {
    name: 'Clear a global variable',
    description: 'Clears a global variable if set',
    code: 'pm.globals.unset("variable_key");'
  },
  {
    name: 'Clear a collection variable',
    description: 'Clears a collection variable if set',
    code: 'pm.collectionVariables.unset("variable_key");'
  },
  {
    name: 'Send a request',
    description: 'Sends a request',
    code: 'pm.sendRequest("https://postman-echo.com/get", function (err, response) {\n    console.log(response.json());\n});'
  },
  {
    name: 'Status code: Code is 200',
    description: 'Write a basic status code check',
    code: 'pm.test("Status code is 200", function () {\n    pm.response.to.have.status(200);\n});'
  },
  {
    name: 'Response body: Contains string',
    description: 'Write a basic string check in response body',
    code: 'pm.test("Body matches string", function () {\n    pm.expect(pm.response.text()).to.include("string_you_want_to_search");\n});'
  },
  {
    name: 'Response body: JSON value check',
    description: 'Write a basic json value check',
    code: 'pm.test("Your test name", function () {\n    var jsonData = pm.response.json();\n    pm.expect(jsonData.value).to.eql(100);\n});'
  },
  {
    name: 'Response body: Is equal to a string',
    description: 'Write a response body string check',
    code: 'pm.test("Body is correct", function () {\n    pm.response.to.have.body("response_body_string");\n});'
  },
  {
    name: 'Response headers: Content-Type header check',
    description: 'Write a basic response header check',
    code: 'pm.test("Content-Type is present", function () {\n    pm.response.to.have.header("Content-Type");\n});'
  },
  {
    name: 'Response time is less than 200ms',
    description: 'Write a basic response time check',
    code: 'pm.test("Response time is less than 200ms", function () {\n    pm.expect(pm.response.responseTime).to.be.below(200);\n});'
  },
  {
    name: 'Status code: Successful POST request',
    description: 'Check for successful POST request',
    code: 'pm.test("Successful POST request", function () {\n    pm.expect(pm.response.code).to.be.oneOf([201,202]);\n});'
  },
  {
    name: 'Status code: Code name has string',
    description: 'Write a basic response code string check',
    code: 'pm.test("Status code name has string", function () {\n    pm.response.to.have.status("Created");\n});'
  },
  {
    name: 'Response body: Convert XML body to a JSON Object',
    description: 'Convert response body from JSON to XML',
    code: 'var jsonObject = xml2Json(responseBody);'
  },
  {
    name: 'Use Tiny Validator for JSON data',
    description: 'Validate response against a schema with Tiny Validator',
    code: 'var schema = {\n  "items": {\n    "type": "boolean"\n  }\n};\n\nvar data1 = [true, false];\nvar data2 = [true, 123];\n\npm.test(\'Schema is valid\', function() {\n  pm.expect(tv4.validate(data1, schema)).to.be.true;\n  pm.expect(tv4.validate(data2, schema)).to.be.true;\n});'
  }
];
