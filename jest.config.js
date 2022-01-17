module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: './unit',
  globals: {
    'ts-jest': {
      diagnostics: {
        // ignore some warn
        ignoreCodes: ['TS151001'],
      },
    },
  },
};
