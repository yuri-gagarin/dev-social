const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const DEV_MODE = process.env.NODE_ENV !== "production";


module.exports = {

  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "appBundle.js"
  },

  devServer: {
    contentBase: path.join(__dirname, '/src'),
    compress: true,
    port: 5000,
    proxy: {
      "/api" : {
        target: "http://localhost:3000/",
        changeOrigin: true,
        secure: false,
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
      },
      {
      test: /\.(css|sass|scss)$/i,
      use: [
        {
          loader: DEV_MODE ? "style-loader" : MiniCssExtractPlugin.loader
        },
        {
          loader: "css-loader",
          options: {
            modules: true,
            importLoaders: 1,
        }
        },
        {
          loader: "sass-loader"
        }
        ]
      }

    ],

  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: DEV_MODE ? "[name].css" : "[name].[hash].css",
      chunkFilename: DEV_MODE ? "[id].css" : "[id].[hash].css"
    }),
  ]
};