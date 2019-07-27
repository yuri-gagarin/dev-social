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
  mode: "development",

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
        //resolve url() and @imports in CSS
        {
          loader: "css-loader",
        },
        {
          loader: "postcss-loader",
          options: {
            config: {
              path: path.resolve(__dirname, "postcss.config.js")
            }
          }
        },
        {
          loader: "sass-loader",
          options: 
          {
            implementation: require("sass")
          }
        }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "fonts"
            }
          }
        ]
      }
    ], //end [rules]
  }, //end {this.module}

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