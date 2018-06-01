const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const base = require('./webpack.base.config.js');

const src = path.resolve(__dirname, '../src');
const target = path.resolve(__dirname, '../dist');

// empty output dir
fs.emptyDirSync(target);

module.exports = merge.strategy({
  externals: 'replace'
})(base, {
  output: {
    path: target,
    filename: '[name].js',
    library: 'xbookable',
    libraryTarget: 'umd'
  },
  externals: {
    'jquery': {
      'root': 'jQuery',
      'commonjs': 'jquery',
      'commonjs2': 'jquery'
    },
    'angular': {
      'root': 'angular',
      'commonjs': 'angular',
      'commonjs2': 'angular'
    }
  },
  devtool: 'source-map',
  plugins: [
    new FriendlyErrorsPlugin()
  ]
});
