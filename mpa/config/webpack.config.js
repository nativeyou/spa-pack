const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const utils = require('./utils');
const entres = utils.getEntry('src/pages');
const htmls = utils.getHtml('src/pages')
const baseDir = path.join(__dirname, '..');

module.exports = {
    entry: entres,
    output: {
        filename: 'js/[name].[hash:8].js',
        path: path.resolve(baseDir, 'dist'),
        publicPath: './'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env'],
                        plugins: ['syntax-dynamic-import']
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 20480,
                            outputPath: 'img/',
                            name: '[name].[hash:8].[ext]'
                        }
                    }
                ]
            },
            {
                test: /\.(eot|ttf|woff|svg)$/,
                use: 'file-loader'
            }
        ]
    },
    plugins: [...htmls]
}