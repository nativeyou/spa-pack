const path = require('path');
const webpack = require('webpack');
const glob = require('glob');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const baseDir = path.join(__dirname, '..');

/**
 * 获取入口文件
 * @param {String} pageDir 
 */
const getEntry = function(pageDir){
    let entryObj = {};
    let pages;

    let pagePath = path.resolve(baseDir,pageDir,'**') + '/*.html';
    pages = glob.sync(pagePath, {
        ignore: '**/node_modules/**'
    });

    pages.map(function(item, index){
        let pathInfo = path.posix.parse(item);
        if(!pathInfo) return;
        let jsPath = item.replace(pathInfo.ext, '.js')
        if(!fs.existsSync(path.resolve(baseDir, jsPath))) return;
        let entry = [jsPath]
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

module.exports = {
    getEntry: getEntry,
    getHtml: getHtml
};