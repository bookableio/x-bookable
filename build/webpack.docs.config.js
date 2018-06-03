const path = require('path');
const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./webpack.base.config.js');

const src = path.resolve(__dirname, '../src');
const examples = path.resolve(__dirname, '../examples');
const dist = path.resolve(__dirname, '../docs');

process.env.NODE_ENV = 'production';

// empty output dir
fs.emptyDirSync(dist);

module.exports = merge(base, {
  entry: {
    examples: path.resolve(examples, 'src/examples.js')
  },
  output: {
    path: dist,
    filename: '[name].js'
  },
  devServer: {
    contentBase: [
      dist
    ],
    historyApiFallback: true
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
      sourceMap: true
    }),
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: path.resolve(dist, 'index.html'),
      template: path.resolve(examples, 'index.html'),
      showErrors: true
    }),
    new CopyWebpackPlugin([
      { from: path.join(examples, 'pages'), to: path.join(dist, 'pages') }
    ])
  ]
});
