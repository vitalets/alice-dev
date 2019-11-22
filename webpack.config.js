const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const pkg = require('./package');

const isProduction = process.env.NODE_ENV === 'production';
const isDevServerMode = process.env.WEBPACK_DEV_SERVER;
const outPath = path.join('dist', isProduction ? 'prod' : 'dev');

console.log(`PRODUCTION: ${isProduction}`);
console.log(`OUT_PATH: ${outPath}`);

module.exports = () => {
  const config = {
    mode: isProduction ? 'production' : 'development',
    entry: './src/frontend',
    output: {
      path: path.resolve(outPath),
      filename: 'bundle.js',
    },
    resolve: {
      extensions: ['.js', '.jsx', '.json'],
    },
    module: {
      rules: [
        jsLoader(),
        cssLoader(),
        svgLoader(),
      ]
    },
    devtool: 'source-map',
    devServer: {
      contentBase: './dist/dev',
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
        banner: `Alice-dev v${pkg.version} (${new Date().toISOString()})`
      }),
      new HtmlWebpackPlugin({
        title: `Alice dev${isDevServerMode ? ' (local)' : ''}`,
        template: 'src/frontend/assets/index.html',
        metrika: fs.readFileSync('src/frontend/assets/metrika.html', 'utf8'),
      }),
      new CopyPlugin([{
        from: 'src/frontend/assets',
        ignore: ['*.html'],
      }]),
    ],
  };

  if (process.env.WEBPACK_ANALYZE) {
    config.plugins.push(
      new BundleAnalyzerPlugin()
    );
  }

  if (isProduction) {
    // see https://reactjs.org/docs/optimizing-performance.html
    config.optimization = {
      minimizer: [
        new TerserPlugin()
      ],
    };
  }

  return config;
};

function jsLoader() {
  return {
    test: /\.jsx?$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        plugins: [
          ['@babel/plugin-proposal-class-properties', { loose: true }],
          '@babel/plugin-syntax-dynamic-import',
        ],
        presets: [
          require.resolve('@babel/preset-react'),
        ],
      }
    }
  };
}

function cssLoader() {
  return {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  };
}

function svgLoader() {
  return {
    test: /\.svg/,
    use: {
      loader: 'svg-url-loader',
      options: {}
    }
  };
}
