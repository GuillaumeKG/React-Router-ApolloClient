var webpack = require('webpack');
var path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

module.exports = {
    entry: [
        path.join(__dirname, './index.js')
    ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
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
        new UglifyJsPlugin()
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.json'],
    },
    devServer: {
        contentBase: __dirname,
        historyApiFallback: true
    }
}