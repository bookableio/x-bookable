const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./webpack.base.config.js');

const src = path.resolve(__dirname, '../src');
const examples = path.resolve(__dirname, '../examples');
const dist = path.resolve(__dirname, '../docs');

module.exports = merge.strategy({
  entry: 'replace'
})(base, {
  entry: {
    examples: path.resolve(examples, 'src/examples.js')
  },
  output: {
    path: dist,
    publicPath: '/',
    filename: '[name].js'
  },
  devServer: {
    contentBase: [
      dist,
      examples
    ],
    historyApiFallback: true
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      inject: 'head',
      filename: path.resolve(dist, 'index.html'),
      template: path.resolve(examples, 'index.html'),
      showErrors: true
    }),
    new FriendlyErrorsPlugin()
  ]
});
