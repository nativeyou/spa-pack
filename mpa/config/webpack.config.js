const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackExpandPlugin = require('./plugin/index');

const utils = require('./utils');
const entres = utils.getEntry('src/pages');
const htmls = utils.getHtml('src/pages')
const baseDir = path.join(__dirname, '..');

module.exports = {
    entry: entres,
    output: {
        filename: utils.getFilesName().js,
        path: path.resolve(baseDir, 'dist'),
        publicPath: utils.getPublicPath('./')
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
                test: /\.(eot|ttf|woff)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            outputPath: utils.getOutputPath().font,
                            name: utils.getFilesName().assets
                        }
                    }
                ]
            }
        ]
    },
    plugins: [
       ...htmls,
       new HtmlWebpackExpandPlugin({
            publicPath: utils.getPublicPath('./'),
            filename: utils.getFilesName().plugin,
            js: utils.getOtherJsFile(),
            css: utils.getOtherCssFile(),
        })
    ]
}