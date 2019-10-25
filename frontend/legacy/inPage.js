define([
    'underscore',
    'handlebars',
    './modules/helper',
    './modules/tpl',
    './modules/postprocess',
    './modules/postrender',
    './modules/imgAjax'
], function (_,
    Handlebars,
    Helper,
    TPLs,
    PostProcessor,
    PostRender,
    imgAjax) {
        var inPage = function (initOptions) {
            var protocol = window.location.protocol;
            var options;

            var _inPage = {
                Product: {}
            };

            if (protocol != "https:")
                protocol = 'http:';

            initOptions = initOptions || {};

            var def_options = {
                request_data: {
                    serverUrl: "",
                    langCode: "en",
                    shopname: "",
                    lang: "en",
                    type: "",
                    content: "",
                    resource_type: "vendor_id",
                    resource_id: {
                        vendor: "",
                        prod_id: ""
                    }
                },
                get_request_data: function (userProps) {
                    userProps = userProps || false;
                    var _data = {
                        lang: this.request_data.lang,
                        content: this.request_data.content
                    };
                    if (typeof (this.request_data.resource_id) == "object") {
                        for (var data_prop in this.request_data.resource_id) {
                            _data[data_prop] = this.request_data.resource_id[data_prop];
                        }
                    } else {
                        _data[this.request_data.resource_type] = this.request_data.resource_id;
                    }
                    if (userProps) {
                        _.extend(_data, userProps);
                    }
                    return _data;
                },
                outputSelector: "#loadliveicecat",
                autoRender: false
            };

            options = _.extend(def_options, initOptions);

            _inPage.config = function (newConfig) {
                newConfig = newConfig || {};
                var _options = _.extend(options, newConfig);
                return _options;
            };

            _inPage.ajax = function (config) {
                var getUrl = function () {
                    var url = config.url;
                    var _dataline = '';
                    for (var param in config.data) {
                        _dataline += "&" + param + "=" + encodeURIComponent(config.data[param]);
                    }
                    return url + "?" + _dataline.slice(1);
                };

                if (typeof (config) !== "object" || config.length === 0) {
                    return false;
                } else {
                    var newRequest = new XMLHttpRequest();
                    newRequest.onload = function (responseData, textStatus, XHR) {
                        config.success(JSON.parse(this.responseText), this.statusText, this);
                    };
                    newRequest.open("GET", getUrl(), true);
                    newRequest.send();
                }
            };

            _inPage.getVersion = function () {
                return '1.0.0.0';
            };

            _inPage.getDatasheet = function (outputSelector, resource_id, lang) {

                var requestOptions;
                var newConfig = {
                    outputSelector: outputSelector,
                    resource_id: resource_id,
                    lang: lang
                };
                var deferred = defer();

                _.each(newConfig, function (value, key, list) {
                    if (typeof (value) != "undefined") {
                        options.request_data[key] = value;
                    }
                });

                var chunkLoaded = function (chunkName, chunkData, outputSelector) {
                    _inPage.chunkLoaded(chunkName, chunkData);
                    _inPage.allLoaded(outputSelector);
                };

                var dataType;
                var optionsData = options.get_request_data();

                optionsData.version = _inPage.getVersion();
                optionsData.selector = outputSelector;


                dataType = 'json';
                optionsData.type = 'json';


                options.serverUrl = _inPage.envConfig.domain;

                requestOptions = {
                    type: 'GET',
                    url: protocol + '//' + _inPage.envConfig.domain + '/api',
                    crossDomain: true,
                    data: optionsData,
                    dataType: dataType,
                    success: function (responseData, textStatus, XHR) {

                        deferred.resolve();
                        if (XHR.status !== 200) {
                            console.log(XHR.response);
                            return;
                        }

                        var multimedia = responseData.data.Multimedia;
                        
                        switch (optionsData.content_kind) {
                            case 'videos':
                                responseData.data.Multimedia = _.where(multimedia, { IsVideo: 1 });
                                responseData.data = PostProcessor[optionsData.content_kind](responseData.data, outputSelector);
                                _inPage.render(outputSelector, optionsData.type, responseData.data, { contentKind: optionsData.content_kind });
                                break;

                            case 'tours3d':
                                responseData.data.Multimedia = _.where(multimedia, { Type: '360' });
                                responseData.data = PostProcessor[optionsData.content_kind](responseData.data);
                                _inPage.render(outputSelector, optionsData.type, responseData.data, { contentKind: optionsData.content_kind });
                                break;

                            default:

                                if (!optionsData.content) {
                                    chunkLoaded("mandatory", responseData.data, outputSelector);
                                } else {
                                    optionsData.content = optionsData.content.replace(',dictionary', '');
                                    responseData.data = PostProcessor[optionsData.content](responseData.data);
                                    responseData.data.separateCall = true;
                                    _inPage.render(outputSelector, optionsData.type, responseData.data, { content: optionsData.content });
                                }

                        }

                    },
                    error: function () {
                        console.log('Mandatory data request failed');
                    }
                };

                _inPage.ajax(requestOptions);

                return deferred.promise;
            };

            _inPage.get3DTours = function (outputSelector, resource_id, lang) {
                arguments[1].content = 'multimedia';
                arguments[1].content_kind = 'tours3d';
                return _inPage.getDatasheet.apply(this, arguments);
            };


            _inPage.getVideos = function (outputSelector, resource_id, lang) {
                arguments[1].content = 'multimedia';
                arguments[1].content_kind = 'videos';
                return _inPage.getDatasheet.apply(this, arguments);
            };

            _inPage.getRTB = function (outputSelector, resource_id, lang) {
                arguments[1].content = 'reasonstobuy,dictionary';
                _inPage.getDatasheet.apply(this, arguments);
            };

            _inPage.chunkLoaded = function (chunkName, chunkData) {
                _.extend(this.Product, chunkData);
            };

            _inPage.allLoaded = function (outputSelector) {
                this.Product.shopname = this.config().get_request_data().shopname || this.config().get_request_data().UserName;

                if (this.config().get_request_data().signature != undefined && this.config().get_request_data().timestamp != undefined &&
                    this.config().get_request_data().shopname != undefined && this.config().get_request_data().lang != undefined) {
                    this.Product.fullIcecat = {
                        "login": this.config().get_request_data().shopname,
                        "lang": this.config().get_request_data().lang,
                        "signature": this.config().get_request_data().signature,
                        "timestamp": this.config().get_request_data().timestamp,
                        "brand": this.config().get_request_data().brand,
                        "part_code": this.config().get_request_data().part_code,
                        "ean_upc": this.config().get_request_data().ean_upc
                    };
                }

                for (var processor in PostProcessor) {
                    PostProcessor[processor].call(this.Product, this.Product, outputSelector);
                }
                _inPage.render(outputSelector);
            };


            _inPage.render = function (outputSelector, type, resp, content) {
                var selectedEl = document.getElementById(outputSelector.slice(1));
                selectedEl.classList.add('-icecat-wrapper');

                var tabsDiv = document.createElement("div");
                tabsDiv.id = 'IcecatLive';
                tabsDiv.classList.add('-icecat-tabs_body');

                if (content && content.contentKind) {
                    tabsDiv.innerHTML = TPLs[content.contentKind](resp);
                    selectedEl.innerHTML = tabsDiv.outerHTML;
                    PostRender[content.contentKind](outputSelector);
                } else if (content) {
                    tabsDiv.innerHTML = TPLs[content.content](resp);
                    selectedEl.innerHTML = tabsDiv.outerHTML;
                    imgAjax.loadImages();
                } else {
                    _.each(TPLs.autoRender, function (tab_template, key) {
                        tabsDiv.innerHTML += tab_template.tpl(this.Product);
                    }, this);
                    selectedEl.innerHTML = tabsDiv.outerHTML;

                    for (var processor in PostRender) {
                        PostRender[processor].call(this.Product, outputSelector);
                    }
                    imgAjax.loadImages();
                }
            };

            var defer = function () {
                var result = {};
                result.promise = new Promise(function (resolve, reject) {
                    result.resolve = function (value) {
                        resolve(value);
                    };
                    result.reject = function (value) {
                        reject(value);
                    };
                });
                return result;
            };

            return _inPage;
        }();
        return inPage;
    });
