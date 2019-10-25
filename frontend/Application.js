let _ = require('underscore'),
    $ = require('jquery'),
    PostRender = require('modules/postrender'),
    imgAjax = require('modules/imgAjax'),
    getLegacyIcecatLiveAsync = require('modules/getLegacyIcecatLiveAsync'),
    { version } = require('../package.json')

const Application = function ({ envConfig }) {
    const PROTOCOL = (window.location.protocol === 'https:')
        ? 'https:'
        : 'http:';
    const DOMAIN = envConfig.domain;
    const BASE_URL = `${PROTOCOL}//${DOMAIN}`;
    const PRODUCTION_SERVER_URL = `${PROTOCOL}/live.icecat.biz`;
    const FULL_CONTENT_LIST = [
        'title',
        'gallery',
        'featurelogos',
        'essentialinfo',
        'bulletpoints',
        'marketingtext',
        'manuals',
        'reasonstobuy',
        'tours3d',
        'videos',
        'featuregroups',
        'reviews',
        'productstory'
    ];
    const DEFAULT_REQUEST_OPTIONS = {
        lang: 'en',
        //type: 'html',
        content: FULL_CONTENT_LIST.join(','),
        version
    };

    __webpack_public_path__ = IS_DEV_SERVER
        ? `${PROTOCOL}//${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/`
        : `${PROTOCOL}//${DOMAIN}/`

    // let's make a request for getting source-maps
    let sourceMapPath = (IS_DEV_SERVER)
        ? `${PROTOCOL}//${DEV_SERVER_HOST}:${DEV_SERVER_PORT}/js/live-current.js.map`
        : `${BASE_URL}/js/live-current.js.map`;

    // $.ajax({ url: sourceMapPath, crossDomain: true }) 

    /*
        using the named function expression is ver important here,
        as then we will use arguments.callee.name to define currently calling method
    */
    this.getDatasheet = function getDatasheet(selector, productParams, lang) {

        let query = Object.assign({}, DEFAULT_REQUEST_OPTIONS, productParams, { selector, lang })

        if (_.isObject(selector)) {
            query.content = Object
                .keys(selector)
                .toString();
            query.selector = Object
                .values(selector)
                .toString();
        }

        /*
            hook for backward compatibility with old version of IcecatLive
        */
        if (query.type && query.type === 'json') {
            getLegacyIcecatLiveAsync().then(LegacyIcecatLive => LegacyIcecatLive.getDatasheet(...arguments))
            return
        }

        return ($.ajax({
            url: `${PROTOCOL}//${DOMAIN}/api/html?${$.param(query)}`,
            crossDomain: true
        }).done((res, statusText, jqXHR) => {
            if (jqXHR.status !== 200) {
                console.log(XHR.response);
                return;
            }

            let _query = query.content.replace(',dictionary,generalinfo,image', ''),
                contentList = _query.split(',');

            if (_.isObject(selector)) {
                let _document = (new DOMParser).parseFromString(res, "text/html");

                /*
                    check if demoAcc:
                    using Object.values.find, as different key can be used as identifiers of user:
                    'shopname', 'ShopName', 'username', 'UserName' etc.
                */
                if (Object.values(productParams).find(el => el === 'openicecat-live')) {
                    let $demoMsg = $(_document.querySelector('.demo-msg'))

                    // insert before first container
                    $demoMsg.insertBefore($(selector[contentList[0]]))
                }
                contentList.forEach((el, i) => {
                    let asset = _document.querySelector(`.IcecatLive.for-${contentList[i]}`),
                    container = selector[contentList[i]];
                    if (asset) {
                        const inputFull = _document.getElementById("liveIcecatFull")
                        if (inputFull) {
                            asset.appendChild(inputFull)
                        }
                        render(container, asset.outerHTML, [contentList[i]]);
                    }
                })
            } else {
                if (query.content)
                    render(selector, res, contentList)
                else
                    render(selector, res)
            }
        }).fail((jqXHR, textStatus, error) => {
            console.log('Mandatory data request failed');
        }))
    };

    this.get3DTours = function get3DTours(selector, productParams, lang) {
        this.initial3DTourResolution = ['Link400', 'Link1000', 'Link2000'].indexOf(productParams.quality) !== -1 ? productParams.quality : null
        if (productParams.type && productParams.type === 'json') {
            getLegacyIcecatLiveAsync().then(LegacyIcecatLive => LegacyIcecatLive.get3DTours(...arguments))
            return
        }

        arguments[1].content = 'tours3d';
        return this
            .getDatasheet
            .apply(this, arguments);
    };

    this.getVideos = function getVideos(selector, productParams, lang) {
        if (productParams.type && productParams.type === 'json') {
            getLegacyIcecatLiveAsync().then(LegacyIcecatLive => LegacyIcecatLive.getVideos(...arguments))
            return
        }
        arguments[1].content = 'videos';
        return this
            .getDatasheet
            .apply(this, arguments);
    };

    this.getRTB = function getRTB(selector, productParams, lang) {
        if (productParams.type && productParams.type === 'json') {
            getLegacyIcecatLiveAsync().then(LegacyIcecatLive => LegacyIcecatLive.getRTB(...arguments))
            return
        }
        arguments[1].content = 'reasonstobuy,dictionary,generalinfo,image';
        this
            .getDatasheet
            .apply(this, arguments);
    };

    this.applyCustomCSS = function applyCustomCSS(filePath) {
        let icecatStyles = document.createElement('link');
        icecatStyles.rel = "stylesheet";
        icecatStyles.setAttribute('customcss', 'iceCatLive');
        icecatStyles.href = filePath;

        document
            .querySelector("head")
            .appendChild(icecatStyles);
    };

    this.applyDefaultCSS = function applyDefaultCSS() {
        let link = document.querySelector('link[customcss]');

        if (link) {
            link
                .parentNode
                .removeChild(link);
        }
    };

    let render = (selector, resp, content = []) => {
        $(selector)
            .addClass('-icecat-wrapper')
            .html('')
            .append(`<div class="IcecatLive -icecat-tabs_body for-${content
                ? content
                : ''}">
                        ${resp}
                    </div>`);

        PostRender.isGranularCall = () => !!content

        content.forEach(content => {
            if (content === 'productstory') {
                return
            }
            PostRender[content](selector)

            if (content === 'gallery') {
                PostRender['GalleryPreload'](selector);
                PostRender['PictureOverlay'](selector);
            }
            if (content === 'essentialinfo') {
                PostRender['More'](selector);
            }
        })
        PostRender.IframeResizer() // temporary workaround for demo
    };
};

module.exports = Application;
