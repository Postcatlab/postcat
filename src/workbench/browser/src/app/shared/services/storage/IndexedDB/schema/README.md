# JSON schema

Check data Valide

# Genreate JSON schema from Typescript interface

1. install

```
npm install typescript-json-schema -g
```

2. genreate

```
cd  src/workbench/browser/src/app/shared/services/storage
//genrate apidata
typescript-json-schema "index.model.ts" 'ApiData' -o "./indexedDB/schema/apiData.json"
//genrate env
typescript-json-schema "index.model.ts" 'Environment' -o "./indexedDB/schema/env.json"
```

3. compare and merge
   The generated rule verification is not strict enough and needs to be merged manually

# Check

```javascript
const ajv = new Ajv({
  useDefaults: true,
});
const validate = ajv.compile < ApiData > apiDataSchema;
if (validate(apiData)) {
  return { validate: true, data: apiData };
} else {
  return { validate: false, error: validate.errors };
}
```
