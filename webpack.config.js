const webpack = require('webpack');
const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const CleanWebpackPlugin = require("clean-webpack-plugin")
const HtmlWebpackPlugin = require('html-webpack-plugin')


const dev = (process.env.NODE_ENV == "dev")

let config = {
    entry: [
        path.join(__dirname, './index.js')
    ],
    output: {
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.[chunkHash:12].js'
    },
    devtool: dev ? "cheap-module-eval-source-map" : "source-map", 
    module: {
        loaders: [
        /*{
            enforce: "pre",
            test: /\.(js)$/,
            exclude: /node_modules/,
            loader: 'eslint-loader'
        },*/
        {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            loader: 'babel-loader'
        },
        {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })
        },
        {
            test: /\.scss$/,
            use: ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: [
                    "css-loader",
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: (loader) => [
                                require('autoprefixer')({
                                    browsers: ['last 2 versions', 'ie>8']
                                })
                            ]
                        }
                    },
                    "sass-loader"
                ]
            })
        }]
    },
    plugins: [
        new CleanWebpackPlugin(['dist'], {}),
        new ExtractTextPlugin({
            filename: 'styles.[contentHash:12].css',
            disable: dev
        }),
        new HtmlWebpackPlugin({template: './index.html'}),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(process.env.NODE_ENV)
            }
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.json'],
        alias:{
            'Img': path.resolve('./img'),
            'Containers': path.resolve(__dirname, './app/containers/'),
            'Components': path.resolve(__dirname, './app/components/'),
            'Schema': path.resolve(__dirname, './app/schema/'),
        }
    },
    devServer: {
        contentBase: __dirname,
        historyApiFallback: true,
        compress: true,
    }
}

if(!dev){
    config.plugins.push(new UglifyJsPlugin())
    /*
    // Seems bugged currently 
    config.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    )*/
    config.plugins.push(
        new webpack.optimize.OccurrenceOrderPlugin()
    )
}

module.exports = config