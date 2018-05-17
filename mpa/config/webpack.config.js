const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HzHtmlWebpackPlugin = require('hz-html-webpack-plugin');

const utils = require('./utils');
const entres = utils.getEntry('src/pages');
const htmls = utils.getHtml('src/pages')
const baseDir = path.join(__dirname, '..');

module.exports = {
    entry: entres,
    output: {
        filename: utils.getFilesName().js,
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
                            outputPath: utils.getOutputPath().img,
                            name: utils.getFilesName().assets
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
    plugins: [
        new HzHtmlWebpackPlugin({
            publicPath: './',
            filename: utils.getFilesName().hzPlugin,
            js: utils.getOtherJsFile(),
            css:utils.getOtherCssFile()
        }), 
        ...htmls
    ]
}