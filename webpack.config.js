const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: './public/js/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'public/js')
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        query: {
          'presets': [
            [
              'env', {
              'targets': {
                'node': 'current'
              }
            }
            ]
          ]
        },
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader?url=false']
        }),

      }
    ],

  },
  stats: {
    colors: true
  },

  plugins: [
    new ExtractTextPlugin('../assets/css/bundle.css')
  ],

  devtool: 'cheap-inline-module-source-map'
};
