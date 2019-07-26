const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {

  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "appBundle.js"
  },

  devServer: {
    contentBase: path.join(__dirname, '/src'),
    compress: true,
    //port: 5000,
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        pathRewrite: {"^/api" : ""},
        secure: false
      }
    }
  },

  module: {
   
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      }
    ],

  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    })
  ]
};