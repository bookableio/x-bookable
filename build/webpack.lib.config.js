const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge');
const base = require('./webpack.base.config.js');

process.env.NODE_ENV = 'production';

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
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        unused: true
      },
      mangle: true,
      beautify: false,
      parallel: true,
      sourceMap: false
    })
  ]
});
