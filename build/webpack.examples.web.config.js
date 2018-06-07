const path = require('path');
const fs = require('fs-extra');
const merge = require('webpack-merge');
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const base = require('./webpack.base.config.js');

const lib = path.resolve(__dirname, '../src');
const src = path.resolve(__dirname, '../examples/web');
const dist = path.resolve(__dirname, '../docs/web');

// empty output dir
fs.emptyDirSync(dist);

const pagenames = [
  'booking.html',
  'customer-view.html',
  'customer.html',
  'index.html',
  'info.html',
  'inquiry.html',
  'map.html',
  'room.html',
  'rooms.html',
  'tourguide-view.html',
  'tourguide.html',
];

const plugins = pagenames.map(pagename => {
  return new HtmlWebpackPlugin({
    inject: 'head',
    filename: path.resolve(dist, pagename),
    template: path.resolve(src, pagename)
  })
});

module.exports = merge(base, {
  output: {
    path: dist,
    publicPath: '',
    filename: '[name].js'
  },
  devServer: {
    contentBase: [
      dist,
      src
    ],
    historyApiFallback: false
  },
  devtool: 'source-map',
  plugins: [
    ...plugins,
    new FriendlyErrorsPlugin()
  ]
});
