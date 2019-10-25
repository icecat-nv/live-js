define(['underscore', 'config/env.json'], function (_, envConfig) {
    var moduleName = arguments.callee.name;

    var removeClass = function(className) {
        var els = Array.prototype.slice.call(
            document.getElementsByClassName(className)
        );
        for (var i = 0, l = els.length; i < l; i++) {
            var el = els[i];
            el.classList.remove(className);
        }
    };

    var loadJSONP = (function() {
        var unique = 0;
        return function(url, callback, el, context, resolve, reject) {
            var name = "_jsonp_" + unique++;
            if (url.match(/\?/)) url += "&callback=" + name;
            else url += "?callback=" + name;

            var script = document.createElement("script");
            script.type = "text/javascript";
            script.src = url;
            script.onload = function() {
                resolve({
                    el: el,
                    url: url
                });
            };
            script.onerror = function(err) {
                reject({
                    el: el,
                    url: url
                });
            };

            // Setup handler
            window[name] = function(data) {
                callback.call((context || window), data, el);
                document.getElementsByTagName("head")[0].removeChild(script);
                script = null;
                delete window[name];
            };

            document.getElementsByTagName("head")[0].appendChild(script);
        };
    })();

    /**
     * Method send JSONP requests to Icecat images service to get images.
     * @TODO: need to move URL of the service to config.
     * @version 1.1.
     * @link https://icecat.atlassian.net/browse/BO-323
     * @type {{loadImages: imgAjax.loadImages}}
     */
    var imgAjax = {
        loadImages: function (element, callback) {
            var protocol = window.location.protocol;
            if (protocol != "https:") protocol = "http:";
            var BASE_IMG_URL = protocol + "//" + envConfig.images_domain + "/get_image.cgi?product_id=";
            var images = element ? [element] : document.getElementsByClassName("-icecat-ajaxImg");
            var inputFull = document.getElementById("liveIcecatFull");
            
            if (inputFull) {
                var full = _.clone(inputFull.dataset);
                for (var prop in full) {
                    full[prop] = encodeURIComponent(full[prop]);
                }
            }
            
            for (var i = 0; i < images.length;  i++) {

                var promise = new Promise(function(resolve, reject) {
                    var el = images[i];

                    var id = images[i].getAttribute("id");
                    var url = '';

                    var res = id.split("-");

                    if (res[0] == "img") {
                        if (res.length == 3) {
                            url = BASE_IMG_URL  + res[2] + "&type_data=json&type_image=" + res[1];
                            el.classList.add("-icecat-hidden-pic");
                        } else if (res.length == 4) {
                            url = BASE_IMG_URL + res[2] + "&type_data=json&type_image=" + res[1] + "&product_gallery_id=" + res[3];
                            if (res[1] !== "thumb") {
                                el.classList.add("-icecat-hidden-pic");
                            }
                        }
                    } else if (res[0] == "bullet") {
                        url = protocol + "//" + envConfig.images_domain + "/get_image.cgi?product_bullet_id=" + res[1] + "&type_data=json";
                    }

                    if (url) {
                        if (inputFull != undefined && inputFull != null) {
                            if(full.brand != '') {
                                url += "&brand=" + full.brand;
                            }
                            if(full.eanUpc != '') {
                                url += "&ean_upc=" + full.eanUpc;
                            }
                            if(full.partCode != '') {
                                url += "&part_code=" + full.partCode;
                            }
                            url += "&login=" + full.login + "&lang=" + full.lang +
                                "&timestamp=" + full.timestamp + "&signature=" + full.signature;
                        }
                        var imgWidth = el.getAttribute("width");
                        var imgHeight = el.getAttribute("height");
                        if(imgWidth)
                            el.removeAttribute("width");
                        if(imgHeight)
                            el.removeAttribute("height");

                        el.classList.add("-icecat-ajax-loader");

                        var doneHandler = function(data, elem) {
                            var parentEl = elem.parentElement;
                            var pId = parentEl.id;
                            if (pId !== undefined && pId == "liveMainImage") {
                                parentEl.classList.remove("-icecat-ajax-loader");
                            }
                            elem.classList.remove("-icecat-ajax-loader");
                            elem.classList.remove("-icecat-hidden-pic");
                            elem.setAttribute("src", data);
                            elem.onload = function(){
                                elem.setAttribute('data-loaded', true)
                            };
                            if(callback && typeof(callback) == "function") {
                                callback();
                            }
                        };
                        loadJSONP(url, doneHandler, el, null, resolve, reject);
                    }
                });

                promise.then(function(el) {
                    //...
                }, function(error) {
                    // Catch error
                    error.el.classList.remove('-icecat-ajax-loader');
                    // error.el.classList.add('-icecat-no-image');

                    /*
                        todo UNCOMMENT IT AFTER IMPLEMENTING OF THE EXPECTION CATCHER'S REST
                     */
                    //
                    // throw new LiveErrorEvent({
                    //     url: moduleName
                    // });
                });
            }
        }
    };

    return imgAjax;
});