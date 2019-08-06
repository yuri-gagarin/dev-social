const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

const DEV_MODE = process.env.NODE_ENV !== "production";


module.exports = {

  entry: "./src/index.js",
  output: {
    path: path.join(__dirname, "/dist"),
    filename: "appBundle.js"
  },
  devServer: {
    contentBase: path.join(__dirname, '/src'),
    //compress: true,
    port: 5000,
    proxy: {
      "/api" : {
        target: "http://localhost:3000/",
        changeOrigin: true,
        secure: false,
      }
    },
    historyApiFallback: true,
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
            options:
            {
              importLoaders: 2,
              modules:
              {
              localIdentName: "[name]_[local]_[hash:base64]",
              }
            }
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
        test: /\.(png|jpe?g|gif)$/,
        use: [
          {
            loader: "url-loader",
            options:
            {
              fallback: "file-loader",
              limit: 8000,
              name: DEV_MODE ? "[path]-[name].[ext]" : "[hash]-[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(svg)$/,
        use: [
          {
            loader: "file-loader",
            options:
            {
              name: DEV_MODE ? "[path]-[name].[ext]" : "[hash]-[name].[ext]"
            }
          }
        ]
      }
    ], //end [rules]
  }, //end {this.module}

  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/index.html"
    }),
    new MiniCssExtractPlugin({
      filename: "[name].css",
      chunkFilename: "[id].css"
    }),
  ]
};