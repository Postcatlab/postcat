//Polyfill Node.js core modules in Webpack. This module is only needed for webpack 5+.
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
/**
 * Custom angular webpack configuration
 */
module.exports = (config, options) => {
  config.target = 'electron-renderer';

  if (options.fileReplacements) {
    for (let fileReplacement of options.fileReplacements) {
      if (fileReplacement.replace !== 'src/environments/environment.ts') {
        continue;
      }

      let fileReplacementParts = fileReplacement['with'].split('.');
      if (fileReplacementParts.length > 1 && ['dev'].indexOf(fileReplacementParts[1]) >= 0) {
        config.target = 'web';
      }
      break;
    }
  }
  config.plugins = [
    ...config.plugins,
    new NodePolyfillPlugin({
      excludeAliases: ['console']
    })
  ];
  config.module.rules = [
    // {
    //   test: /\.(js|ts)$/,
    //   use: [
    //     {
    //       loader: 'babel-loader',
    //       options: {
    //         presets: ['@babel/preset-env', 'stage-3'],
    //         plugins: ['@babel/plugin-syntax-import-assertions']
    //       }
    //     }
    //   ],
    //   exclude: /node_modules/,
    //   resourceQuery: { not: [/\?ngResource/] }
    // },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader'],
      resourceQuery: { not: [/\?ngResource/] }
    },
    {
      test: /\.ttf$/,
      type: 'asset/resource',
      resourceQuery: { not: [/\?ngResource/] }
    },
    ...config.module.rules
  ];

  config.experiments = {
    topLevelAwait: true
  };

  // console.log('config', config.module.rules);

  return config;
};
