const config = {
    spa: false,
    ip: 'localhost',
    port: '9000',
    name: 'gaoxm-pack',
    hot: false,
    hash: true,
    compress: false,
    cdn: '',
    track: 'm', // track 类型 'm' h5端 'pc' pc端 '' 空 不使用track
    share: true,
    deploy: false,
    outputPath: {
        js: './js',
        css: './css',
        img: './assets/img/',
        font: './assets/font/'
    }
};

module.exports = config;