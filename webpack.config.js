const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlForChunk = chunk => new HtmlWebpackPlugin({
  template: `./src/renderer/windows/index.html`,
  filename: `./${chunk}/index.html`, //relative to root of the application
  chunks: [chunk],
  inject: true,
});

const config = {
  mode: 'development',
  entry: {
    main: './src/main/main.ts',
    mainWindow: './src/renderer/windows/mainWindow/index.tsx',
    secondWindow: './src/renderer/windows/secondWindow/index.tsx',
  },
  target: 'electron-renderer',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name]/bundle.js',
  },
  resolve: {
    fallback: {
      path: require.resolve('path-browserify'),
    },
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.tsx?$|\.ts?$/,
        use: ['babel-loader', 'ts-loader'],
      },
    ],
  },
  plugins: [
    HtmlForChunk('mainWindow'),
    HtmlForChunk('secondWindow'),
  ],
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
  },
};

module.exports = config;