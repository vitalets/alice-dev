const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const pkg = require('./package');

module.exports = (env = {}) => {
  const config = {
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
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['@babel/plugin-proposal-class-properties', { loose: true }]
              ],
              presets: [
                require.resolve('@babel/preset-react'),
              ],
            }
          }
        }
      ]
    },
    devtool: 'source-map',
    devServer: {
      contentBase: './dist',
      writeToDisk: true,
    },
    plugins: [
      new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        'WS_URL': JSON.stringify(process.env.WS_URL),
      }),
      new webpack.ProvidePlugin({
        React: 'react',
        Logger: 'loggee',
      }),
      new webpack.BannerPlugin({
        banner: `Alice-dev v${pkg.version}`
      }),
      new HtmlWebpackPlugin({
        template: 'src/front/index.html'
      }),
    ],
  };

  if (env.production) {
    // see https://reactjs.org/docs/optimizing-performance.html
    config.optimization = {
      minimizer: [
        new TerserPlugin()
      ],
    };
  }

  return config;
};
