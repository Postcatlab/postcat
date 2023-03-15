module.exports = {
  apps: [
    {
      name: 'extension-runtime',
      script: 'main.js',
      watch: '.'
    }
  ],

  deploy: {
    production: {}
  }
};
