module.exports = {
  ident: 'postcss',
  plugins: (loader) => [
    require('postcss-import')(),
    require('postcss-cssnext')({
      browsers: [
        'IE >= 9',
        'last 2 versions',
        'ios >= 8',
        'android >= 4'
      ]
    }),
    require('cssnano')()
  ]
};
