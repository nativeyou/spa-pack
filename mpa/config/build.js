process.env.NODE_ENV = 'production';

const path = require('path');
const webpack = require('webpack');
const webpackConfig = require('./webpack.config.js');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');

const utils = require('./utils');
const baseDir = path.join(__dirname, '..');

// 生产模式
webpackConfig.mode = 'production';

// modlue 配置
webpackConfig.module.rules = webpackConfig.module.rules.concat(
    [
        {
            test: /\.css$/,
            use: ExtractTextWebpackPlugin.extract({
                use: [
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader:'postcss-loader',
                        options: {
                            config: {
                                path: './config/postcss.config.js'
                            }
                        }
                    }
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
                        loader:'postcss-loader',
                        options: {
                            config: {
                                path: './config/postcss.config.js'
                            }
                        }
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
webpackConfig.optimization = {
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

webpackConfig.plugins = webpackConfig.plugins.concat(
    [
        new CleanWebpackPlugin(['dist'], path.resolve(baseDir)),
        new ExtractTextWebpackPlugin({filename:  utils.getFilesName().css, allChunks: true})
    ]
);

// node 执行
webpack(webpackConfig, function (err, stats) {
    if (err) {
        console.error(err);
        return;
    }

    console.log(stats.toString({
        chunks: false,
        colors: true
    }));
});