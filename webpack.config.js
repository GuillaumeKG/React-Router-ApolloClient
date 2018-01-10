var webpack = require('webpack');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const dev = process.env.NODE_ENV === "dev"

let config = {
    entry: [
        path.join(__dirname, './index.js')
    ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devtool: dev ? "cheap-module-eval-source-map" : "source-map", 
    module: {
        loaders: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.scss$/,
            loaders: ["style-loader", "css-loader", "sass-loader"]
        }
        ]
    },
    plugins: [
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    devServer: {
        contentBase: __dirname,
        historyApiFallback: true
    }
}

if(!dev){
    config.plugins.push(new UglifyJsPlugin({
        //sourceMap: true
    }))
}

module.exports = config