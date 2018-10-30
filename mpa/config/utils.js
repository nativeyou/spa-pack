const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');
const config = require('./config');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseDir = path.join(__dirname, '..');
const isDev = process.env.NODE_ENV === 'production' ? false : true;

/**
 * 获取输出地址
 * @param {string} dir 
 */
const getPublicPath = function(dir){
    let _dir = '';
    isDev || config.cdn === '' 
    ? _dir = dir
    : (
        config.cdn.charAt(config.cdn.length - 1) !== '/'
        ? (
            config.cdn += '/',
            _dir = config.cdn
        )
        : ''
    ) 
    return _dir
}

/**
 * 获取入口文件
 * @param {String} pageDir 
 */
const getEntry = function(pageDir){
    let entryObj = {};
    let pages;
    let shareFile;

    let pagePath = path.resolve(baseDir,pageDir,'**') + '/*.html';
    pages = glob.sync(pagePath, {
        ignore: '**/node_modules/**'
    });

    if(config.share){
        // 分享添加
        shareFile = glob.sync('./**/share.js', {
            ignore: '**/node_modules/**'
        })[0];
    }

    pages.map(function(item, index){
        let pathInfo = path.posix.parse(item);
        if(!pathInfo) return;
        let jsPath = item.replace(pathInfo.ext, '.js')
        if(!fs.existsSync(path.resolve(baseDir, jsPath))) return;
        let entry = [jsPath];
        if(config.share && shareFile) entry.unshift(shareFile);
        entryObj[pathInfo.name] = entry;
    })

    return entryObj;
}

/**
 * 获取html
 * @param {String} pageDir 
 */
const getHtml = function(pageDir){
    let pagesHtml = [];
    let chunks = [];
    let globPath = path.resolve(baseDir, pageDir, '**') + '/*.html';
    let pages = glob.sync(globPath, {
        ignore: '**/node_modules/**'
    });

    pages.map(function (item, index){
        let pathInfo = path.posix.parse(item);

        if(!pathInfo) return;

        let jsPath = item.replace(pathInfo.ext, '.js');
        if(fs.existsSync(path.resolve(baseDir, jsPath))){
            chunks = ['vendor', 'commonJS', pathInfo.name];
        } else {
            chunks = [];
        }
        let htmlPlugin = new HtmlWebpackPlugin({
            template: path.resolve(__dirname,'..',item),
            hash: true,
            filename: pathInfo.name + '.html',
            chunks: chunks,
            chunksSortMode: 'dependency'
        });
        pagesHtml.push(htmlPlugin);
    });
    return pagesHtml;
}

/**
 * 获取资源路径
 */
const getOutputPath = function(){
    let defaultPath = {
        js:'./js',
        css:'./css',
        img:'./assets/img/',
        font:'./assets/font/',
    };
    return Object.assign(defaultPath, config.outputPath ? config.outputPath : {});
}

/**
 * 获取资源名称
 */
const getFilesName = function(){
    const output = getOutputPath();
    if(isDev){
        return {
            js:path.posix.join(output.js,'[name].js'),
            css:path.posix.join(output.css,'[name].css'),
            assets:'[name].[ext]',
            plugin:'[name].[ext]'
        }
    } else {
        return {
            js:path.posix.join(output.js,'[name]'+(config.hash?'.[chunkhash:8]':'')+'.js'),
            css:path.posix.join(output.css,'[name]'+(config.hash?'.[contenthash:8]':'')+'.css'),
            assets:'[name]'+(config.hash?'.[hash:8]':'')+'.[ext]',
            plugin:'[name]'+(config.hash?'.[hash:8]':'')+'.[ext]'
        }
    }
};

const getOtherJsFile = function(){
    let jsAssets = [];
    // jsAssets.push('http://ws-www.hantinghotels.com/wa/site/m_huazhu_track.js');
    // jsAssets.push('http://res.wx.qq.com/open/js/jweixin-1.0.0.js');

    return jsAssets;
};

const getOtherCssFile = function(){
    return null;
};

module.exports = {
    getEntry: getEntry,
    getPublicPath: getPublicPath,
    getHtml: getHtml,
    getOutputPath: getOutputPath,
    getFilesName: getFilesName,
    getOtherJsFile: getOtherJsFile,
    getOtherCssFile: getOtherCssFile
};