/**
 * 用于传统资源加载问题
 * htmlwebpackplugin 插件的拓展
 */

const nodePath = require('path');
const nodeFs = require('fs');
const _ = require('lodash');
const loaderUtils = require('loader-utils');

class HtmlWebpackExpandPlugin {
    constructor(options){
        // 初始化参数
        this.options = _.extend({
            publicPath: './',
            filename: '',
            js: null,
            css: null
        }, options);
    }

    apply(compiler){
        const self = this;
        if(compiler.hooks){
            compiler.hooks.compilation.tap('HtmlWebpackExpandPlugin', (compilation) => {
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('HtmlWebpackExpandPlugin', (htmlPluginData, callBack)=>{
                    // 处理html资源及a链接路径
                    htmlPluginData.html = self.resetPath(htmlPluginData.html, htmlPluginData.plugin.options.template, compilation);
                    // 其他额外资源
                    if(self.options.js){
                        htmlPluginData.assets.js = self.options.js.concat(htmlPluginData.assets.js);
                    }
                    if(self.options.css){
                        htmlPluginData.assets.css = self.options.js.concat(htmlPluginData.assets.css);
                    }
                    callBack(null, htmlPluginData);
                })
            })
        } else {
            compiler.plugin('compilation',function (compilation) {
                compilation.plugin('html-webpack-plugin-before-html-processing',function (htmlPluginData, callBack) {
                    // 处理html资源及a链接路径
                    htmlPluginData.html = self.resetPath(htmlPluginData.html, htmlPluginData.plugin.options.template, compilation);
                    // 其他额外资源
                    if(self.options.js){
                        htmlPluginData.assets.js = self.options.js.concat(htmlPluginData.assets.js);
                    }
                    if(self.options.css){
                        htmlPluginData.assets.css = self.options.js.concat(htmlPluginData.assets.css);
                    }
                    callBack(null, htmlPluginData);
                })
            })
        }
    }

    /**
     * 处理路径
     * @param {String} html 
     * @param {String} basePath 
     * @param {String} compilation 
     */
    resetPath(html, basePath, compilation){
        let self = this;
        //修改 只验证js 与a链接
        let scriptTags = html.match(/<script(?:.*?)src=["']?\s*([^"'>\s]+)["']?(?!<)(?:[^>]*)\>/gm);
        let aTags = html.match(/<a(?:.*?)href=["']?\s*([^"'>\s]+)["']?(?!<)(?:[^>]*)\>/gm);
        //let linkTags = html.match(/<link(?:.*?)href=["']?\s*([^"'>\s]+)["']?(?!<)(?:[^>]*)\>/gm);
        scriptTags || (scriptTags = []);
        aTags || (aTags = []);
        //linkTags || (linkTags = []);
        let tags = scriptTags.concat(aTags/*,linkTags*/);
        basePath = basePath.split('!')[1];
        tags.forEach(function (tag) {
            let filePath,
                relativeFilePath,
                buildPath,
                tmp,
                query,
                content,
                stat,
                pathInfo,
                buildSubPath;

            if(/http(s)?:\/{2}/.test(tag)) return;
            tmp = tag.replace(/"/g,'').replace(/'/g,'').match(/(src|href)\s*=\s*([^>\s"']+)/);
            relativeFilePath = tmp ? tmp[2] : '';
            if(!(relativeFilePath && basePath)) return;
            filePath = nodePath.resolve(basePath, '../', relativeFilePath);
            query = filePath.match(/[\?\#][^\s\\\/\?\#]+$/);
            filePath = filePath.replace(query, '');
            if(!nodeFs.existsSync(filePath)){
                return;
            }
            query || (query='');
            pathInfo = nodePath.posix.parse(filePath.replace(/\\/g,'/'));

            //html 输出
            if(pathInfo.ext === '.html' || pathInfo.ext === '.ejs'){
                html = html.replace(relativeFilePath,self.options.publicPath+pathInfo.name+'.html'+query);
                return
            }

            content = nodeFs.readFileSync(filePath);
            stat = nodeFs.statSync(filePath);
            //css 输出
            if(pathInfo.ext === '.css'){
                buildSubPath = './css/';
            }else {
                buildSubPath = './js/';
            }
            buildPath = buildSubPath + loaderUtils.interpolateName(
                {resourcePath:filePath},
                self.options.filename,
                {content:content}
            );

            html = html.replace(relativeFilePath,buildPath.replace('./',self.options.publicPath)+query);

            compilation.assets[buildPath] = {
                size:function () {
                    return stat.size;
                },
                source:function () {
                    return content;
                }
            }
        })
        return html;
    }
}

module.exports = HtmlWebpackExpandPlugin;