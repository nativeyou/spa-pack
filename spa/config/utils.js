import path from 'path';

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
 * 获取webpack路口
 * @param {String} pagesPath 路径
 */
const getEntry = (pagesPath) => {
    let appPath = '', entryObj = {};
    appPath = path.resolve('./', pagesPath, 'app.js');
    entryObj = {
        app: appPath
    }
    return entryObj;
};

export {
    getEntry,
    getPublicPath
}