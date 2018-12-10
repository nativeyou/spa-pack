import path from 'path';
import webpack from 'webpack';
import * as utils from './utils';

export default {
    entry: utils.getEntry('src/pages'),
    output: {
        filename: '[name].[chunkhash:8].js',
        path: path.resolve(__dirname, '..', 'dist'),
        publicPath: utils.getPublicPath('./')
    },
    module: {
        rules: [
            {
                test: /\.html$/,
                use: [
                    {
                        loader: 'html-loader'
                    }
                ]
            },
            {
                test: /\.css$/,
                use: [
                    
                ]
            }
        ]
    }
};