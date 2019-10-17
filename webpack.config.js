const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const pkg = require('./package');

module.exports = (env = {}) => {
  return {
    mode: env.production ? 'production' : 'development',
    entry: './src/front',
    output: {
      path: path.resolve('dist'),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        {
          test: /\.jsx$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                require.resolve('@babel/preset-react'),
              ]
            }
          }
        }
      ]
    },
    devtool: 'source-map',
    devServer: {
      contentBase: './dist',
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.ProvidePlugin({
        React: 'react',
      }),
      new webpack.BannerPlugin({
        banner: `Alice-dev v${pkg.version}`
      }),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      })
    ],
  };
};
