const webpack = require('webpack');
const config = require('./config');
const webpackConfig = require('./webpack.config');
const WebpackDevServer = require('webpack-dev-server');
const open = require('opn');

const options = {
    host: config.ip,
    port: config.port,
    disableHostCheck: true,
    stats: {
        colors: true
    },
    hot: config.hot,
    overlay: true,
    watchOptions: {
        ignored: /node_modules/
    }
};

// 生产模式
webpackConfig.mode = 'development';

// module 配置
webpackConfig.module.rules = webpackConfig.module.rules.concat(
    [
        {
            test:/\.html$/,
            use:[
                {
                    loader: 'html-loader',
                }
            ]
        },
        {
            test: /\.css$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: './config/postcss.config.js'
                        }
                    }
                }
            ]
        },
        {
            test: /\.scss$/,
            use: [
                {
                    loader: 'style-loader'
                },
                {
                    loader: 'css-loader'
                },
                {
                    loader: 'postcss-loader',
                    options: {
                        config: {
                            path: './config/postcss.config.js'
                        }
                    }
                },
                {
                    loader: 'sass-loader'
                }
            ]
        }
    ]
);

const devPlugins = [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
]

webpackConfig.plugins = webpackConfig.plugins.concat(devPlugins);

WebpackDevServer.addDevServerEntrypoints(webpackConfig, options);

let compiler = webpack(webpackConfig);

let server = new WebpackDevServer(compiler, options);

server.listen(config.port, config.ip, function(){
    let url = `http://${config.ip}:${config.port}`;
    console.log('Starting server on' + url);
    open(url);
});