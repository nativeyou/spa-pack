const _ = require('lodash');

class TestWebpackPlugin {
    constructor(options){
        this.options = _.extend({
            text: 'Hi'
        }, options);
    }

    apply(compiler){
        const self = this;
        if(compiler.hooks){
            compiler.hooks.compilation.tap('TestWebpackPlugin', (compilation) => {
                compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tapAsync('TestWebpackPlugin', (htmlPluginData, callBack)=>{
                    console.log(htmlPluginData);
                })
            })
        }
    }

    resetPath(html, basePath, compilation){
        const self = this;
        
    }
}

module.exports = TestWebpackPlugin;