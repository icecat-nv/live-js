let Application = require('Application'),
    envConfig = require('../config/env.json'),
    Polyfills = require('./polyfills'),
    //babelPolyfill = require('babel-polyfill'),
    stylesheet = require('sass/main.scss'),
    swiperCss = require('node_modules/swiper/dist/css/swiper.min.css');

window.IcecatLive = new Application({ envConfig });

dispatchEvent(new CustomEvent('liveload', {
    bubbles: true,
    cancelable: true
}));
