const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const utils = require('./utils');
const htmls = utils.getHtml('src/pages')
const baseDir = path.join(__dirname, '..');

// 生产模式
config.mode = 'production';

// css压缩
config.module.rules = config.module.rules.concat(
    [
        {
            test: /\.css$/,
            use: ExtractTextWebpackPlugin.extract({
                use: [
                    {
                        loader: 'css-loader',
                    },
                ],
                fallback: "style-loader",
                publicPath:'../',
            })
        },
        {
            test: /\.scss$/,
            use: ExtractTextWebpackPlugin.extract({
                use: [
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'sass-loader',
                        options: {
                            outputStyle: 'compressed'
                        }
                    }
                ],
                fallback: "style-loader",
                publicPath:'../',
            })
        },
        {
            test: /\.(htm|html)$/,
            use: 'html-withimg-loader'
        },
    ]
);

// 抽取公共模块
config.optimization = {
    splitChunks: {
        cacheGroups: {
            vendor: {
                test: /node_modules/,
                chunks: 'initial',
                name: 'vendor',
                priority: 10
            },
            commonJS: {
                test: /\.js$/,
                chunks: 'initial',
                name: 'commonJS',
                minSize: 0
            }
        },
    }
};

config.plugins = [
    new CleanWebpackPlugin(['dist'], path.resolve(baseDir)),
    new ExtractTextWebpackPlugin({filename: 'css/[name].[hash:8].css', allChunks: true})
].concat(htmls);

webpack(config, function (err, stats) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,
        colors: true
    }));
});