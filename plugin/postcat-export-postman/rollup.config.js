/** @type import('rollup').RollupOptions */
const nodeCjs = {
  input: './index.js',
  output: [
    {
      file: 'dist/index.js',
      format: 'umd',
      name: 'index',
      sourcemap: 'inline',
    },
  ],
};

const bundles = [nodeCjs];

export default bundles;
