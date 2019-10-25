define([
    'jquery',
    'underscore',
    'hammer',
    './helper',
    './tpl',
    './zoom',
    './mobile',
    './imgAjax',
    './effects',
    './rotateView',
    './slider',
    'lib/jwplayer/jwplayer',
    'lib/jwplayer/jwplayer.html5'
], function ($, _, Hammer, Helper, TPLs, zoom, mobile, imgAjax, effects, RotateView, Slider) {

    window.liveCacheEvents = {
        mainImg: []
    };

    function is_touch_device() {
        return !!('ontouchstart' in window);
    }

    var protocol = window.location.protocol;
    if (protocol != "https:")
        protocol = 'http:';

    var PostRender = {};
    var gallery;
    var playerScript;
    var videosWaitsLoadingPlayer = [];

    PostRender.Gallery = function () {
        var galleryArr = [];
        var galleryImages = document.querySelectorAll('.-icecat-mini_img');
        for (var y = 0; y < galleryImages.length; y++) {
            var galleryItem = {};
            for (var i = 0; i < galleryImages[y].attributes.length; i++) {
                if (galleryImages[y].attributes[i].nodeName !== 'class' && galleryImages[y].attributes[i].nodeName !== 'data') {
                    var name = galleryImages[y].attributes[i].nodeName.split('-');
                    if (name[1]) {
                        galleryItem[name[1]] = galleryImages[y].attributes[i].value;
                    }
                }
            }
            galleryArr.push(galleryItem);
        }
        gallery = galleryArr;
    };
    PostRender.GallerySlider = function (outputSelector) {
        var bigEl = document.getElementById(outputSelector.substr(1));
        var el = bigEl.querySelector("div.-icecat-slide_wrapper_bar");
        if (el != null) {
            var allImgs = document.getElementsByClassName("-icecat-all_imgs")[0];
            var galleryAllImg = allImgs.children;
            var galleryCount = el.querySelectorAll("div.-icecat-slide_images div.-icecat-mini_img").length;
            var prevButton = el.querySelector("div.-icecat-prevButt");
            var nextButton = el.querySelector("div.-icecat-nextButt");
            var prevButtonClasses = el.querySelector("div.-icecat-prevButt").classList;
            var subDiv = el.getElementsByClassName("-icecat-slide_images")[0];
            var visibleEls = _(subDiv.getElementsByClassName("-icecat-mini_img")).filter(function (value) {
                return !value.hidden;
            });
            var ElsToShowLeft;
            ElsToShowLeft = visibleEls.length - 4;
            var ElsToShowRight = 0;

            if (galleryCount > 4) {
                prevButtonClasses.add("-icecat-prevDis");

                var noSmoking = function () {
                    allImgs.style.transition = "";
                    allImgs.style.transform = "";
                };

                var smoke = function (el, direction) {
                    var sign = (direction === true) ? "-" : "+";
                    allImgs.style.transition = "0.2s linear";
                    allImgs.style.transform = "translate(" + sign + "80px)";
                    setTimeout(function () {
                        noSmoking();
                        if (direction === true) {
                            allImgs.appendChild(el);
                        } else {
                            allImgs.insertBefore(el, galleryAllImg[0]);
                        }
                    }, 200);
                };

                prevButton.addEventListener('click', function () {
                    ElsToShowRight--;
                    ElsToShowLeft++;
                    var movingElem = galleryAllImg[galleryAllImg.length - 1];
                    noSmoking();
                    smoke(movingElem, false);
                });

                nextButton.addEventListener('click', function () {
                    ElsToShowLeft--;
                    ElsToShowRight++;
                    var movingElem = galleryAllImg[0];
                    noSmoking();
                    smoke(movingElem, true);
                });
            } else {
                prevButton.hidden = true;
                nextButton.hidden = true;
            }
        }
    };

    PostRender.PictureOverlay = function (outputSelector) {
        var mainObj = this;
        var miniImg = document.querySelectorAll(outputSelector + " div.-icecat-slide_images div.-icecat-mini_img");
        var modalWindow = document.getElementById("modal_window");
        var zoomWrapper = document.getElementById('zoomWrapper');
        var closeButton = modalWindow.querySelector("div.-icecat-close");
        var prevButton = modalWindow.querySelector("div.-icecat-prev_button");
        var nextButton = modalWindow.querySelector("div.-icecat-next_button");
        var productImg = document.querySelector(".-icecat-product_img img");

        var allImgs = modalWindow.querySelector(".-icecat-all_imgs");
        var galleryAllImg = allImgs.children;

        [].map.call(galleryAllImg, function (elem) {
            elem.addEventListener("click", function (el) {
                var currentEl = el.target;
                var currentElId = currentEl.id;
                var neededToFindId;
                var img = modalWindow.getElementsByTagName("img")[0];
                var res = document.getElementById('highGalleryLive');
                var resources = res.getElementsByTagName('img');

                var div = currentEl.parentElement.parentElement;
                var galleryIndex = parseInt(div.getAttribute("data"), 10);
                setInactiveButtons(modalWindow, galleryIndex);

                resetImage(img);

                currentElId = currentElId.replace('img-thumb-', '');
                neededToFindId = 'img-high-' + currentElId;

                for (var i = 0; i < resources.length; i++) {
                    if (resources[i].id === neededToFindId) {
                        img.src = resources[i].getAttribute("src");
                        img.setAttribute("data", galleryIndex);
                    }
                }

                window.zoomer1 = zoom.zoomRust.call(img);
            }, false);
        });

        var prevButtonGallery = modalWindow.querySelector('.light-box div.-icecat-prevButt');
        var nextButtonGallery = modalWindow.querySelector('.-next-gallery-modal');

        function fireClick(node) {
            if (document.createEvent) {
                var evt = document.createEvent('Event');
                evt.initEvent('click', true, false);
                node.dispatchEvent(evt);
            } else if (document.createEventObject) {
                node.fireEvent('onclick');
            } else if (typeof node.onclick == 'function') {
                node.onclick();
            }
        }

        if (mobile.status === true) {
            closeButton.className = "-icecat-close_mobile";
        }

        if (mainObj.ImgForMW == 1) {
            modalWindow.querySelector(".-icecat-nav_buttons").style.display = "none";
        }

        var genImageId = function (data, force) {
            var quality = "high";
            if (data.Pic500x500 && force !== true) {
                quality = "medium";
            }
            var cfg = ["img", quality, data.productid, data.id];

            return cfg.join("-");
        };

        var resetImage = function (el) {
            el.removeAttribute("style");
            el.setAttribute("src", "");
            el.setAttribute("height", "");
            el.setAttribute("width", "");
        };

        var zoomBtnLogic = function (galleryIndex) { // Author Ihor Zuykov...
            document.getElementById("zoomOut").className = "-icecat-zoomOutDeactivate";
            document.getElementById("initialState").className = "-icecat-initialStateDeactivate";
            var picWidth = gallery[galleryIndex].picwidth;
            var picHeight = gallery[galleryIndex].picheight;
            if (picHeight === undefined && picHeight === undefined) {
                picWidth = gallery[galleryIndex].highpicwidth;
                picHeight = gallery[galleryIndex].highpicheight;
            }
            var zoomAllowed = function () {
                document.getElementById("zoomIn").classList.remove("-icecat-zoomInDeactivate");
                document.getElementById("initialState").classList.remove("-icecat-initialStateDeactivate");
            };
            var zoomDisabled = function () {
                document.getElementById("zoomIn").className = "-icecat-zoomInDeactivate";
            };
            var ownTOmain = {
                W: picWidth / zoomWrapper.clientWidth,
                H: picHeight / zoomWrapper.clientHeight
            };
            var mbasis = function () {
                if (ownTOmain.W < 1 && ownTOmain.H < 1) {
                    return false;
                } else {
                    return ownTOmain.W < ownTOmain.H ? "height" : "width";
                }
            }();

            if (mbasis === false) {
                zoomDisabled();
            } else {
                zoomAllowed()
            }
        };

        var getFromStorage = function (id, type) {
            var nodeId = type + "GalleryLive";
            var res = document.getElementById(nodeId);
            if (res !== null) {
                var resources = res.getElementsByTagName('img');
                for (var i = 0; i < resources.length; i++) {
                    var index = parseInt(resources[i].getAttribute("data"), 10);
                    if (id === index && resources[i].getAttribute("src") != "") {
                        if (resources[i].getAttribute('data-loaded')) {
                            return resources[i].getAttribute("src");
                        }
                    }
                }
            }

            return null;
        };

        var slideImage = function (direction) {
            var img = modalWindow.getElementsByTagName("img")[0];
            var galleryIndex = parseInt(img.getAttribute("data"), 10) + direction;
            var nextIndex = galleryIndex == gallery.length ? 0 : galleryIndex;
            var prevButton = modalWindow.querySelector("div.-icecat-prev_button");
            var nextButton = modalWindow.querySelector("div.-icecat-next_button");

            if ((direction < 0) && (prevButton.className.indexOf('gray') !== -1)) {
                return
            }

            if ((direction > 0) && (nextButton.className.indexOf('gray') !== -1)) {
                return
            }

            setInactiveButtons(modalWindow, galleryIndex);

            nextIndex = check(nextIndex, direction);
            img.setAttribute("data", nextIndex);
            img.setAttribute("id", genImageId(gallery[nextIndex]));
            resetImage(img);
            zoomBtnLogic(nextIndex);
            var highImageSrc = getFromStorage(nextIndex, "high");
            var highStatus = false;
            if (highImageSrc !== null) {
                highStatus = true;
            }
            img.gallery = gallery;
            if (highStatus === true) {
                img.setAttribute("src", highImageSrc);
            } else {
                imgAjax.loadImages(img);
            }

            zoom.highImageStatus = highStatus;
            window.zoomer1 = zoom.zoomRust.call(img);
        };
        var prevListener = function (e) {
            slideImage(-1);
        };
        var nextListener = function (e) {
            slideImage(1);
        };

        nextButton.addEventListener("click", nextListener);
        prevButton.addEventListener("click", prevListener);

        prepareGalleryButtons(prevButtonGallery, nextButtonGallery);

        document.addEventListener("keyup", function (e) {
            if (modalWindow.style.display == "block" && e.keyCode == 39) {
                slideImage(1);
            }
        });
        document.addEventListener("keyup", function (e) {
            if (modalWindow.style.display == "block" && e.keyCode == 37) {
                slideImage(-1);
            }
        });

        var mouseEnter = function (e) {
            var currentIndex = parseInt(this.getAttribute("data"), 10);
            if (productImg.getAttribute("data") == currentIndex) {
                return;
            }

            var lsd = liveCacheEvents.mainImg.pop();
            if (lsd !== undefined) {
                productImg.removeEventListener("click", lsd);
            }
            var mainImgHandler = function () {
                var allImgs = document.querySelectorAll("div.-icecat-slide_images div.-icecat-mini_img");
                var gal = Array.prototype.slice.call(allImgs, 0);
                gal.sort(function (a, b) {
                    return a.getAttribute("data") - b.getAttribute("data");

                });
                fireClick(gal[currentIndex]);
            };
            liveCacheEvents.mainImg.push(mainImgHandler);
            productImg.addEventListener("click", mainImgHandler);
            productImg.setAttribute("data", currentIndex);
            var id = this.querySelector("img").getAttribute("id").replace("thumb", "low");
            productImg.setAttribute("id", id);
            var lowImageSrc = getFromStorage(currentIndex, "low") ? getFromStorage(currentIndex, "low") : getFromStorage(currentIndex, "high");
            var lowStatus = false;
            if (lowImageSrc !== null) {
                lowStatus = true;
            }

            var mainImage = document.querySelector(".-icecat-product_img");
            var productImgDone = function () {
                mainImage.classList.remove("-icecat-ajax-loader");
            };
            if (lowStatus === true) {
                productImg.setAttribute("src", lowImageSrc);
                productImgDone();
                effects.fadeIn(productImg, 25);

            } else {
                mainImage.classList.add("-icecat-ajax-loader");
                imgAjax.loadImages(productImg, productImgDone);
            }
        };

        if (mobile.status === true) {
            var mc = new Hammer(zoomWrapper);
            mc.on("swipeleft", nextListener);
            mc.on("swiperight", prevListener);
        }

        var processOverlay = function (element) {
            var galleryIndex = parseInt(element.getAttribute("data"), 10);
            var galleryItem = {};
            galleryItem = gallery[galleryIndex];

            var isImage = _.isUndefined(galleryItem.ignore);

            if (isImage === true) {
                element.addEventListener("mouseenter", mouseEnter);
                element.addEventListener("click", function (e) {
                    e.preventDefault();

                    if (modalWindow.style.display === "none") {
                        modalWindow.style.display = "block";
                        var zoomPanelButton = modalWindow.querySelectorAll("#zoomPanel a");

                        setInactiveButtons(modalWindow, galleryIndex);

                        for (var i = 0; i < zoomPanelButton.length; i++) {
                            var zoomButton = zoomPanelButton[i];
                            if (mobile.status === true) {
                                switch (zoomButton.id) {
                                    case "initialState":
                                        break;
                                    default:
                                        zoomButton.style.display = "none";
                                }
                            } else {
                                switch (zoomButton.id) {
                                    case "zoomIn":
                                        var zoom_panel_in = document.getElementById('zoomIn').getAttribute('data-zoom-in');
                                        zoomButton.innerHTML = "<span>" + zoom_panel_in + "</span>";
                                        break;
                                    case "zoomOut":
                                        var zoom_panel_out = document.getElementById('zoomOut').getAttribute('data-zoom-out');
                                        zoomButton.innerHTML = "<span>" + zoom_panel_out + "</span>";
                                        break;
                                    case "initialState":
                                        var zoom_panel_init = document.getElementById('initialState').getAttribute('data-zoom-init');
                                        zoomButton.innerHTML = "<span>" + zoom_panel_init + "</span>";
                                        break;
                                }
                                var helper = zoomButton.querySelector("span");
                                var buttonPositionLeft = (helper.offsetWidth - 25) / 2;
                                helper.style.left = "-" + buttonPositionLeft + "px";
                                helper.style.display = "none";
                            }
                        }
                        var modalImage = modalWindow.getElementsByTagName('img')[0];
                        resetImage(modalImage);
                        zoomBtnLogic(galleryIndex);
                        var highImageSrc = getFromStorage(galleryIndex, "high");
                        var highStatus = false;
                        if (highImageSrc !== null) {
                            highStatus = true;
                        }
                        modalImage.setAttribute("id", genImageId(galleryItem, highStatus));
                        modalImage.setAttribute("data", galleryIndex);
                        modalImage.gallery = gallery;
                        if (highStatus === true) {
                            modalImage.setAttribute("src", highImageSrc);
                        } else {
                            imgAjax.loadImages(modalImage);
                        }
                        zoom.highImageStatus = highStatus;
                        window.zoomer1 = zoom.zoomRust.call(modalImage);

                        if (mobile.status === true) {
                            var imgWp = modalImage.parentElement;
                            var imageWrapper = function () {
                                return {
                                    width: imgWp.clientWidth,
                                    height: imgWp.clientHeight
                                }
                            };
                            window.modalWp = imageWrapper();
                            var handler = {
                                checker: function () {
                                    var currResize = imageWrapper();
                                    if (currResize.width != window.modalWp.width || currResize.height != window.modalWp.height) {
                                        modalImage.gallery = gallery;
                                        window.zoomer1 = zoom.zoomRust.call(modalImage);
                                    }
                                }
                            };
                            if (window.evnt === undefined) {
                                window.evnt = {
                                    checker: []
                                };
                            }
                            var rm = evnt.checker.pop();
                            evnt.checker.push(handler);
                            if (rm != undefined) window.removeEventListener("touchend", rm.checker);
                            window.addEventListener("touchend", handler.checker);
                        }
                    }
                });
            }
        };

        _.each(miniImg, processOverlay);

        var mainImgHandler = function () {
            var allImgs = document.querySelectorAll("div.-icecat-slide_images div.-icecat-mini_img");
            if (allImgs[0] !== undefined) {
                var check = function (index, rule) {
                    if (rule == 1) {
                        if (!_.isUndefined(gallery[index].ignore)) {
                            return check(index + 1, rule);
                        } else {
                            return index;
                        }
                    }
                    if (index < 0) {
                        return gallery.length - 1;
                    }
                    if (!_.isUndefined(gallery[index].ignore, rule)) {
                        return check(index - 1, rule);
                    } else {
                        return index;
                    }
                };
                var indx = check(0, 1);
                fireClick(allImgs[indx]);
            }
        };
        liveCacheEvents.mainImg.push(mainImgHandler);
        if (productImg !== null) {
            productImg.addEventListener("click", mainImgHandler);
        }

        closeButton.addEventListener("click", function (e) {
            modalWindow.style.display = "none";
        });
        document.addEventListener("keyup", function (e) {
            if (modalWindow.style.display == "block" && e.keyCode == 27) { // Esc
                modalWindow.style.display = "none";
            }
        });

        function prepareGalleryButtons(prevButtonGallery, nextButtonGallery) {
            var allImgs = modalWindow.querySelector(".-icecat-all_imgs");
            var galleryAllImg = allImgs.children;
            var galleryCount = galleryAllImg.length;
            var subDiv = modalWindow.getElementsByClassName("-icecat-slide_images")[0];
            var visibleEls = _(subDiv.getElementsByClassName("-icecat-mini_img")).filter(function (value) {
                return !value.hidden;
            });
            var ElsToShowLeft;
            ElsToShowLeft = visibleEls.length - 4;
            var ElsToShowRight = 0;

            if (galleryCount > 4) {
                var noSmoking = function () {
                    allImgs.style.transition = "";
                    allImgs.style.transform = "";
                };

                var smoke = function (el, direction) {
                    var sign = (direction === true) ? "-" : "+";
                    allImgs.style.transition = "0.2s linear";
                    allImgs.style.transform = "translate(" + sign + "80px)";
                    setTimeout(function () {
                        noSmoking();
                        if (direction === true) {
                            allImgs.appendChild(el);
                        } else {
                            allImgs.insertBefore(el, galleryAllImg[0]);
                        }
                    }, 200);
                };

                prevButtonGallery.addEventListener('click', function () {
                    ElsToShowRight--;
                    ElsToShowLeft++;
                    var movingElem = galleryAllImg[galleryAllImg.length - 1];
                    noSmoking();
                    smoke(movingElem, false);
                });

                nextButtonGallery.addEventListener('click', function () {
                    ElsToShowLeft--;
                    ElsToShowRight++;
                    var movingElem = galleryAllImg[0];
                    noSmoking();
                    smoke(movingElem, true);
                });
            } else {
                prevButtonGallery.hidden = true;
                nextButtonGallery.hidden = true;
            }

        }
    };

    PostRender.TooltipPosition = function (outputSelector) {
        var container = document.querySelector(outputSelector);
        var tooltips = container.querySelectorAll('.-icecat-tooltip-containeer > div');

        function getOffsetTop(elem) {
            var top = 0;
            while (elem) {
                top = top + parseFloat(elem.offsetTop);
                elem = elem.offsetParent;
            }
            return Math.round(top) - parseFloat(container.offsetTop);
        }

        [].forEach.call(tooltips, function (el) {
            var height = el.offsetHeight,
                offsetTop = getOffsetTop(el);

            if (height + offsetTop > container.offsetHeight) {
                // el.parentNode.classList.add('-icecat-top');
            }
        });
    };


    PostRender.More = function (outputSelector) {
        var toggleClass = function (el, className) {
            if (el.getAttribute('class').indexOf(className) != -1) {
                el.classList.remove(className);
            } else {
                el.classList.add(className);
            }
        };

        function moreBehavior(arg) {
            var info_product = document.querySelector(".-icecat-info_product." + arg);
            var argWithoutPrefix = arg.replace('-icecat-', '');
            var more_values = document.querySelector(".-icecat-more-" + argWithoutPrefix);
            if (more_values) {
                more_values.addEventListener("click", function (e) {
                    e.preventDefault();
                    if (info_product.getAttribute("class").indexOf("-icecat-visibility") >= 0) {
                        info_product.classList.remove("-icecat-visibility");
                        this.classList.remove("-icecat-open-" + argWithoutPrefix);
                    } else {
                        info_product.classList.add("-icecat-visibility");
                        this.classList.add("-icecat-open-" + argWithoutPrefix);
                    }
                });
            }
        }

        var moreArr = ["-icecat-ean", "-icecat-category"];

        for (var i = 0; i < moreArr.length; i++) {
            moreBehavior(moreArr[i]);
        }
        var toggleBlocks = document.querySelectorAll('#IcecatLive .-icecat-toggle-block');
        [].forEach.call(toggleBlocks, function (el) {
            el.addEventListener('click', function (e) {
                var block = el.parentNode.querySelector('.-icecat-block');
                if (block) {
                    toggleClass(el, '-icecat-text-line_cropped');
                    toggleClass(block, '-icecat-block_hidden');
                }
            });
        });
    };

    PostRender.GalleryPreload = function () {
        var isset = document.getElementById("galleryStorageLive");
        if (isset !== null) {
            isset.remove();
        }

        var galleryStorage = document.createElement("div");
        galleryStorage.setAttribute("id", "galleryStorageLive");
        document.body.appendChild(galleryStorage);

        var buildImages = function (toNode, quality) {
            for (var i = 0; i < gallery.length; i++) {
                if (_.isUndefined(gallery[i].ignore)) {
                    var img = document.createElement("img");
                    toNode.appendChild(img);
                    var imgId = ["img", quality, gallery[i].productid, gallery[i].id].join("-");
                    img.setAttribute('id', imgId);
                    img.setAttribute('data', i);
                    img.classList.add("-icecat-ajaxImg");
                }
            }
            galleryStorage.appendChild(toNode);
        };

        var lowWrapper = document.createElement("div");
        lowWrapper.setAttribute("id", "lowGalleryLive");
        var highWrapper = document.createElement("div");
        highWrapper.setAttribute("id", "highGalleryLive");
        buildImages(lowWrapper, "low");
        buildImages(highWrapper, "high");
        imgAjax.loadImages();
    };

    /**
     * Enable spritespin, normalize f*ing flash and hang listeners for slider
     */
    PostRender.tours3d = function () {
        $(document).ready(function () {
            var currentTour = $('#tour-current .tour-item'),
                previews = $('.slick-preview.tour-preview');

            if (!currentTour) return;

            // height will be calculated proportionally in the rotateview module
            var options = {
                width: 620
            };

            var tours = {
                render: function () {
                    if (currentTour.data('picsbatch')) {
                        this.enable(currentTour, options);
                    } else if (currentTour.hasClass('flash')) {
                        this.normalizeFlash();
                    }

                    if (this.slider) {
                        this.slider.render();
                        this.bindListener();
                    }
                },
                /**
                 * Enable spritespin from batch of pictures, which are placed in nodes' data attributes (dataset.picsbatch)
                 * @param node
                 * @param opt
                 */
                enable: function (node, opt) {
                    try {
                        var picsBatch = node.data('picsbatch');
                    } catch (e) {
                        console.log('Incorrect json');
                    }
                    opt.sourceData = (opt.picsBatch) ? opt.picsBatch : picsBatch;
                    new RotateView(node, opt);

                    return this;
                },
                /**
                 * check if flash is supported by browser
                 * @returns {boolean}
                 */
                flashSupport: function () {
                    var support = false;
                    try {
                        var flashObj = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                        if (flashObj) {
                            support = true;
                        }
                    } catch (e) {
                        if (navigator.mimeTypes
                            && navigator.mimeTypes['application/x-shockwave-flash'] != undefined
                            && navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
                            support = true;
                        }
                    }
                    return support;
                },
                normalizeFlash: function () {
                    if (!this.flashSupport()) return;

                    var body = document.body,
                        flashes = document.querySelectorAll('#tours-section object.flash');

                    if (flashes) {
                        try {
                            flashes.forEach(function (flash) {
                                flash.addEventListener('wheel', function (e) {
                                    if (e.pageX > window.innerWidth * 0.4 && e.pageX < window.innerWidth * 0.6) {
                                        body.classList.add('noscroll');
                                    } else {
                                        // allow to scroll when pointer is in the passive zone (40% padding on both sides)
                                        body.classList.remove('noscroll');
                                    }
                                });
                                flash.addEventListener('mouseleave', function () {
                                    // allow to scroll when pointer leaves the flash
                                    body.classList.remove('noscroll');
                                })
                            });
                        } catch (e) {
                            console.log("SWF Object is not supported by your browser, try to install Flash player", e)
                        }
                    }
                }
            };

            if (previews) {
                tours.slider = new Slider($("#tours-section .slick-slider"));

                tours.load = function (el) {
                    var id = $(el).attr('data-id'),
                        aimedTour = $('#' + id),
                        currentTour = $('#tour-current .tour-item');

                    currentTour.remove();

                    var refreshedTour = aimedTour
                        .clone()
                        .removeAttr('hidden')
                        .removeAttr('id')
                        .appendTo($('#tour-current'));


                    if (refreshedTour.is("object.flash")) tours.normalizeFlash();

                    if (refreshedTour.is(".tour-item[data-picsbatch]")) tours.enable(refreshedTour, options);
                };

                tours.bindListener = function () {
                    var self = this;

                    this.slider.items.each(function (index, el) {
                        $(el).on("mousedown", function (event) {
                            // this is carrying of argument ('null' is context, 'this' is constant argument)
                            var callback = self.load.bind(null, this);

                            self.slider.filterClick(event, callback);
                        });
                    });
                    return this;
                };
            }
            tours.render();
        });
    };

    /**
     * Setup jwplayer and configure the interaction between it and slickSlider
     */
    PostRender.videos = function (outputSelector) {
        var currentVideoWrapper = $(outputSelector + ' ' + '#currentVideoWrapper'),
            currentVideo = $(outputSelector + ' ' + outputSelector + 'currentVideo'),
            previews = $(outputSelector + ' ' + '.slick-preview.video-preview');

        if (!currentVideo.length) return;

        var video = {
            setup: function () {
                if (window.jwplayer) {
                    var self = this;
                    window.jwplayer(outputSelector.slice(1) + 'currentVideo').setup({
                        file: currentVideoWrapper.data('link'),
                        image: currentVideoWrapper.data('src'),
                        width: self.computeSizeByBreakpoints().width + "px",
                        height: self.computeSizeByBreakpoints().height + "px",
                        primary: "html5"
                    });
                    return this;
                }
            },
            /**
             * calculate width and height depends on window width
             * Proportion 3/5 is the most optimal
             * @returns {{width: number, height: number}}
             */
            computeSizeByBreakpoints: function () {
                // strongly bound with css media rules: look to the sass/video.scss
                return {
                    width: window.innerWidth < 768 ? (window.innerWidth < 360 ? 300 : 300) : 620,
                    height: window.innerWidth < 768 ? (window.innerWidth < 360 ? 180 : 180) : 372
                };
            },
            /**
             * Use native jwplayer method
             * @returns {video}
             */
            resizer: function () {
                if (window.jwplayer) {
                    var self = this;
                    $(window).on('resize', function (e) {
                        window.jwplayer("currentVideo").resize(
                            self.computeSizeByBreakpoints().width,
                            self.computeSizeByBreakpoints().height
                        );
                        if (window.innerWidth <= 768 && self.slider) {
                            $(outputSelector + ' ' + '#currentVideo').addClass('frontlayer');
                            self.restructure();
                        }
                    });
                    return this;
                }
            },
            /**
             * Complex method, which bind all together
             */
            render: function () {
                // console.log('this is ', this);
                if (this.slider) {
                    this.slider.render();
                    this.setup().resizer().bindListener();
                    return;
                }
                this.setup().resizer();
            }
        };

        if (previews) {
            video.slider = new Slider($(outputSelector + ' ' + '#video-section .slick-slider'));

            // this is a custom logic of the load process
            video.load = function (preview) {
                if (window.innerWidth <= 768) {
                    $(outputSelector + ' ' + '#currentVideo').addClass('frontlayer');
                    // this.restructure();
                    window.jwplayer(currentVideo.get(0)).stop();
                }

                window.jwplayer(outputSelector.slice(1) + 'currentVideo').load({
                    file: preview.getAttribute('data-link'),
                    image: preview.getAttribute('data-src')
                }).play();

                return this;
            };
            video.bindListener = function () {
                this.slider.items.each(function (index, el) {
                    $(el).on("mousedown", function (event) {
                        var callback = video.load.bind(null, this);
                        video.slider.filterClick(event, callback);
                    });
                });

                if (window.innerWidth <= 768) {
                    this.restructure();
                }
                return this;
            };
            video.restructure = function () {
                var self = this;
                /*
                 SO MESSY! -_-
                 but slick plugin replace arrows while restructuring slider on the breakpoint
                 */
                setTimeout(function () {
                    self.slider.arrows.each(function (index, el) {
                        $(el).off("click", restructurer);
                        $(el).on("click", restructurer);
                    });
                }, 80);


                function restructurer() {
                    $('#currentVideo').removeClass('frontlayer');
                    if (window.jwplayer().getState() === 'PLAYING') {
                        window.jwplayer(currentVideo.get(0)).stop();
                    }
                }

                return this;
            };
        }

        video.render();
    };

    function setInactiveButtons(modalWindow, galleryIndex) {
        var prevButton = modalWindow.querySelector("div.-icecat-prev_button");
        var nextButton = modalWindow.querySelector("div.-icecat-next_button");
        var nextItemExists;
        var prevItemExists;

        for (var i = 0; i < gallery.length; i++) {
            if (!gallery[i].ignore) {
                if (i < galleryIndex) {
                    prevItemExists = true
                }

                if (i > galleryIndex) {
                    nextItemExists = true
                }
            }
        }

        if (!prevItemExists && (prevButton.className.indexOf('gray') === -1)) {
            prevButton.classList.add("gray");
        } else {
            if (prevItemExists) {
                prevButton.classList.remove("gray");
            }
        }


        if (!nextItemExists && (nextButton.className.indexOf('gray') === -1)) {
            nextButton.classList.add("gray");
        } else {
            if (nextItemExists) {
                nextButton.classList.remove("gray");
            }
        }
    }

    function check(index, rule) {
        if (rule == 1) {
            if (!_.isUndefined(gallery[index].ignore)) {
                return check(index + 1, rule);
            } else {
                return index;
            }
        }
        if (index < 0) {
            return gallery.length - 1;
        }
        if (!_.isUndefined(gallery[index].ignore, rule)) {
            return check(index - 1, rule);
        } else {
            return index;
        }
    };

    return PostRender;
}
);