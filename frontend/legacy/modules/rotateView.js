define(['jquery', 'hammer'], function ($, Hammer) {

    // save modified jquery as dollar (jquery was modified and returned in SpriteSpin)
    // var $ = SpriteSpin;

    /*
     Looooong regexp of all available mobile devices:
     */
    var isMobile = false;
    (function _isMobile() {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
            || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
            isMobile = true;
        }
    })();

    var RotateView = function (selector, options) {

        var defaultOptions = {
            sourceData: options.sourceData,
            width: options.width,
            height: options.height
        };

        window.onresize = function () {
            defaultOptions.maxWidth = $(window).width();
            defaultOptions.maxHeight = $(window).height();
        };

        var init = function (imgSrc) {
            imgSrc = imgSrc || defaultOptions.sourceData[1].Link400;
            var img = new Image();
            img.src = imgSrc;

            img.onload = function () {
                var imgProportion = this.height / (this.width / 100) * 0.01;

                // take width from options argument
                defaultOptions.width = defaultOptions.currentWidth = options.width;
                // and modify height
                defaultOptions.height = defaultOptions.currentHeight = options.width * imgProportion;

                // defaultOptions.width = defaultOptions.currentWidth = this.width;
                // defaultOptions.height = defaultOptions.currentHeight = this.height;
                var source = [];
                defaultOptions.sourceData = defaultOptions.sourceData.sort(function (a, b) {
                    return Number(a.OrderNumber) - Number(b.OrderNumber);
                });


                /*
                 Renderer can be:
                 1) 'canvas' (default, create <canvas> element from ur source images),
                 2) 'image' (this create set of <img> tags from ur source images)
                 3) 'background' (one div with dynamic background)

                 'image' is very handy and flexible in use, but this mode
                 cause strange flickering in firefox, so we switch renderer in case of
                 firefox browser
                 */
                var renderer = (navigator.userAgent.match(/Firefox/i)) ? 'canvas' : 'image',
                    initialRes = (renderer == 'canvas') ? 'Link1000' : 'Link400';

                defaultOptions.sourceData.forEach(function (element, index) {
                    source.push(element[initialRes]);
                });

                var spriteSpin = $(viewContainer).spritespin({
                    animate: false,
                    // Time in ms between updates. 40 is exactly 25 FPS
                    frameTime: 120,
                    sourceData: defaultOptions.sourceData,
                    source: source,
                    renderer: renderer,
                    scrollThreshold: 200,
                    behavior: 'drag-out',
                    // in ms
                    timeToBlur: 40,
                    // multiply width in 1.5 times, the result will be 600, same with sfw object width
                    width: defaultOptions.width,
                    // multiply height proportionally to width and vice versa
                    height: defaultOptions.height,
                    // // fixed dragging, though drag to the right lead object to the right
                    // sense: -1,
                    // animation run to the right side instead of left
                    reverse: false,
                    detectSubsampling: false,
                    preloadCount: source.length,
                    responsive: true,
                    onInit: function () {
                        $('#tour-section .tour-row').addClass('.-icecat-ajax-loader');
                    },
                    onLoad: function () {
                        /*
                         1) make the 3d object instance accessible everywhere. nor too bad solution i guess
                         2) define is it canvas or not, as canvas is rendered in other than image html element
                         3) actually spritespinInstance is only DOM identifier of our 3D Object
                         */
                        window.spritespinInstance = ($(".spritespin-canvas").length > 0) ? '.spritespin-canvas' : '.spritespin-stage';
                        $('.spritespin-instance').addClass("in-row");

                        $('#tour-section .tour-row').removeClass('.-icecat-ajax-loader');
                    }
                });

                self.SpinApi = spriteSpin.spritespin("api");

                self.render();
                self.resetHandlers();
            }
        };

        init();

        var self = this,
            controlsContainer = document.createElement('div'),
            viewContainer = document.createElement('div'),
            events = {
                'wheel': {
                    selector: viewContainer,
                    handler: 'scrollHandler',
                    global: false
                },
                'mousedown': {
                    selector: viewContainer,
                    handler: 'moveStart'
                },
                'mouseup': {
                    selector: viewContainer,
                    handler: 'moveEnd'
                },
                'mouseleave': {
                    selector: viewContainer,
                    handler: 'moveEnd'
                },
                'mousemove': {
                    selector: viewContainer,
                    handler: 'viewMove'
                },
                'dblclick': {
                    selector: viewContainer,
                    handler: 'toggleFullscreen'
                },
                'keypress': {
                    selector: $(window),
                    handler: 'toggleFullscreen'
                }
            },
            zoom = {
                scale: 1,
                scaleIncrement: (!isMobile) ? 0.25 : 0.1,
                maxZoom: 4,
                isMoving: false,
                isMovable: false,
                translate: [0, 0],
                zoomIn: function () {
                    this.scale = (this.scale >= this.maxZoom) ? this.maxZoom : this.scale + this.scaleIncrement;
                    this.getMaxOffset();
                    this.applyOffset();
                    this.buttonsRefresh();
                    self.SpinApi.betterQualityFrame();
                },
                zoomOut: function () {
                    if (this.scale < 2) {
                        this.zoomInitial();
                    } else {
                        this.scale = this.scale < 2 ? 1 : this.scale - 0.25;
                        this.getMaxOffset();
                        this.setOffset();
                        this.applyOffset();
                    }
                    this.buttonsRefresh();
                },
                getCurrentScale: function (el) {
                    var reg = /scale\(([0-9.]+)\)/,
                        styles = getComputedStyle(el),
                        scaleValue = styles.transform.search(reg)[1];

                    return scaleValue;
                },
                /*
                 this method gets the scale property from inline styles (i.e. specified by ownselves).

                 if u want to get final scale value (including scale specified by spritespin lib,
                 better to use getComputedStyle(el).transform
                 */
                getCurrentScaleFromInline: function (el) {
                    // Dont apply any scale property by css classes to this element;
                    // this will cause confusion

                    // Sooooo messy, i know, but propose better approach to get separate value from inline styles
                    var transformReg = /transform/,
                        scaleReg = /scale\(([0-9.]+)\)/;

                    var inlineStyles = el.style.cssText;

                    if (inlineStyles.search(transformReg) != -1) {
                        var scaleValue = inlineStyles.match(scaleReg)[1];
                    }

                    return (scaleValue) ? scaleValue : '1';
                },
                buttonsRefresh: function () {
                    if (this.scale > 1 && this.scale < this.maxZoom) {

                        $(controlsContainer).find('.plus').addClass('active');
                        $(controlsContainer).find('.minus').addClass('active');
                    } else {
                        if (this.scale == 1) {
                            // min scale
                            $(controlsContainer).find('.plus').addClass('active');
                            $(controlsContainer).find('.minus').removeClass('active');
                        } else {
                            //max scale
                            $(controlsContainer).find('.plus').removeClass('active');
                            $(controlsContainer).find('.minus').addClass('active');
                        }
                    }
                },
                getMaxOffset: function () {
                    var offset = {};
                    max = ((defaultOptions.currentWidth * this.scale) / 2 - defaultOptions.currentWidth / 2) / this.scale;
                    this.getMaxOffset.x = max;
                    offset.x = max;
                    max = ((defaultOptions.currentHeight * this.scale) / 2 - defaultOptions.currentHeight / 2) / this.scale;
                    this.getMaxOffset.y = max;
                    offset.y = max;
                    return offset;
                },
                applyOffset: function () {
                    //set offset to dom el

                    /*
                     temporary solution.
                     TODO we have to implement flexible zoom with offset (now it is a bit buggy (https://icecat.atlassian.net/browse/BO-428)), not just centeralized zoom.
                     */
                    var transform = 'scale(' + this.scale + ') translate3d(' + 0 + 'px, ' + 0 + 'px,0)';

                    // normal solution
                    // var transform = 'scale(' + this.scale + ') translate3d(' + this.translate[0] * zoom.scale + 'px, ' + this.translate[1] * zoom.scale + 'px,0)';
                    $(viewContainer).find(spritespinInstance).css({
                        transform: transform
                    });
                },
                zoomInitial: function () {
                    this.scale = 1;
                    this.setOffset(0, 0);
                    this.applyOffset();

                },
                setOffset: function (x, y) {
                    if (x != undefined && y != undefined) {
                        var sign = {
                                x: x < 0 ? -1 : 1,
                                y: y < 0 ? -1 : 1
                            },
                            X = x,
                            Y = y;
                        this.translate = [X, Y];
                    } else {
                        this.setOffset(this.translate[0], this.translate[1]);
                    }
                },
                closestPosition: function () {
                    var x = this.translate[0],
                        y = this.translate[1],
                        sign = {
                            x: x < 0 ? -1 : 1,
                            y: y < 0 ? -1 : 1
                        },
                        X = Math.abs(x) <= this.getMaxOffset.x ? x : sign.x * this.getMaxOffset.x,
                        Y = Math.abs(y) <= this.getMaxOffset.y ? y : sign.y * this.getMaxOffset.y;

                    this.translate = [X, Y];
                }
            },
            buttons = {
                rotate: {
                    handler: function (e) {
                        self.SpinApi.toggleAnimation();
                        $(this).toggleClass('active');

                    },
                    title: "Turn on automatic rotation"
                },
                hand: {
                    handler: function (e) {
                        $(this).toggleClass('active');
                        self.SpinApi.toggleZoomable();
                        zoom.isMovable = !zoom.isMovable;
                    },
                    title: "Enable mouse dragging"
                }
            };

        self.render = function () {

            if(selector.length > 1){
                if(!selector[0].children.length){
                    selector = $(selector[0]);
                } else{
                    selector = $(selector[1]);
                }
            }

            var wrapperDiv = document.createElement('div');
            $(wrapperDiv).append(viewContainer).addClass('wrapper');
            $(wrapperDiv).append(controlsContainer);
            $(selector).append(wrapperDiv);
            $(controlsContainer).addClass('controls');
            for (var i in buttons) {
                var button = document.createElement('button');
                button.setAttribute('class', buttons[i].class);
                button.classList.add(i);
                button.onclick = buttons[i].handler;
                button.title = buttons[i].title;
                controlsContainer.appendChild(button);
            }

            if (isMobile) {
                /**
                 * hammertime is Hammer'd body (for simulation of swipe)
                 *
                 * After experimenting with this way, figured out that listening the body's swipe
                 * is very expensive procedure, sooo...
                 * TODO normalize vertical swipe for 3DTour
                 */
                /*
                var touchBody = new Hammer(document.body);
                 touchBody.get('swipe').set({direction: Hammer.DIRECTION_ALL});
                 touchBody.on('swipeup swipedown', function (e) {
                    if ($('.tour-current').find($(e.srcEvent.target))) {
                        console.log(e.srcEvent.target);

                        var body = document.body || document.documentElement,
                            up = (e.velocityY < 0),
                            distance = 0;

                        if (up) {
                            distance = -(-e.deltaY * (e.velocityY));
                            console.log('upper by ', distance + ' px');
                        } else {
                            distance = -e.deltaY * (e.velocityY);
                            console.log('lower by ', distance + ' px');
                        }

                        $(body).animate({
                            scrollTop: body.scrollTop += distance
                        }, 300, function () {
                            // console.log('scrolled on ' + distance + ' px')
                        });
                    }
                });*/

                var rotateView = document.querySelector('.spritespin-instance');

                var mc = new Hammer.Manager(rotateView);

                var pinch = new Hammer.Pinch(),
                    rotate = new Hammer.Rotate(),
                    pan = new Hammer.Pan(),
                    doubletap = new Hammer.Tap({event: 'doubletap', taps: 2});

                // we want to detect both the same time
                pinch.recognizeWith(rotate);

                var scale = 1;
                var deltaX = 0;
                var deltaY = 0;

                mc.add([pinch, rotate, pan, doubletap]);

                mc.on("pinchend", function (e) {
                    scale = e.scale;
                    if (e.scale < 1) {
                        scale = 1;
                    }
                    $(viewContainer).find(spritespinInstance).css({
                        transform: 'scale(' + scale + ')'
                    });

                    // TODO implement zooming with zoom.zoomIn and zoom.zoomOut rather than this simplified form with using of 'pinchin' and 'pinchout' events
                    // zoom.zoomOut();
                });

                var pansCount = 0;
                mc.on("panup pandown", function (e) {
                    e.preventDefault();

                    var body = document.body || document.documentElement;

                    /*
                     Hammer registers pan event each time pointer move even by pixel;
                     so, depends on how many events emitted, we divide the distance of scroll
                     to number of events, and reset it on the panend event
                     */
                    ++pansCount;
                    body.scrollTop = body.scrollTop + -e.deltaY / pansCount;
                });

                mc.on("panend", function (e) {
                    pansCount = 0;

                    if ($('button.hand').hasClass('active')) {
                        deltaY += e.deltaY;
                        deltaX += e.deltaX;

                        $(viewContainer).find(spritespinInstance).css({
                            transform: 'scale(' + scale + ') translate3d(' + deltaX + 'px,' + e.deltaY + 'px, 0px)'
                        });
                    }
                });

                mc.on('doubletap', function (e) {
                    self.toggleFullscreen();
                });
            }
        };

        self.resetHandlers = function () {
            for (var i in events) {
                (function (event) {
                    var eventTarget = (events[event].global) ? $(window) : $(selector).find(events[event].selector);


                    eventTarget.on(event, function (e) {
                        self[events[event].handler](e);
                    });
                })(i);
            }
        };

        self.keyDownHandler = function (e) {
            // console.log(e);
        };

        self.scrollHandler = function (e) {
            /*  Zoom action only upon the 'active' zone
             So.. we left numb paddings: 25 percent left and 25 percents on the right side
             */
            if (e.pageX > window.innerWidth * 0.25 && e.pageX < window.innerWidth * 0.75) {
                e.preventDefault();
                var isZoomIn = e.originalEvent.deltaY < 0 ? true : false;
                if (isZoomIn) {
                    zoom.zoomIn();
                } else {
                    zoom.zoomOut();
                }
            }
        };

        self.moveStart = function (e) {
            if (e.pageX > window.innerWidth * 0.25 && e.pageX < window.innerWidth * 0.75) {

                e.preventDefault();

                zoom.getMaxOffset();
                $(controlsContainer).find('.rotate').removeClass('active');
                if (zoom.isMovable) {
                    self.SpinApi.stopAnimation();
                    zoom.currentFrame = self.SpinApi.currentFrame();
                    zoom.offset = {
                        x: e.pageX - zoom.translate[0] * zoom.scale,
                        y: e.pageY - zoom.translate[1] * zoom.scale
                    };
                    // prevent animation while dragging
                    $(viewContainer).find(spritespinInstance).css('transition', 'none');
                    zoom.isMoving = true;
                } else {
                    zoom.isMoving = false;
                }
            }
        };

        self.viewMove = function (e) {
            if (e.pageX > window.innerWidth * 0.25 && e.pageX < window.innerWidth * 0.75) {
                if (zoom.isMoving && zoom.isMovable) {
                    e.preventDefault();
                    self.SpinApi.updateFrame(zoom.currentFrame);
                    if (zoom.isMovable && zoom.isMoving) {

                        var deltaX = -(zoom.offset.x - e.pageX) / zoom.scale,
                            deltaY = -(zoom.offset.y - e.pageY) / zoom.scale;

                        zoom.setOffset(deltaX, deltaY);

                        var transform = 'scale(' + zoom.scale + ') translate3d(' + zoom.translate[0] * zoom.scale + 'px, ' + zoom.translate[1] * zoom.scale + 'px,0)';

                        $(viewContainer).find(spritespinInstance).css({
                            transform: transform
                        });

                    }
                }
            }
        };

        self.moveEnd = function (e) {
            e.preventDefault();
            zoom.isMoving = false;
            if (zoom.scale > 1) {
                self.SpinApi.betterQualityFrame();
            }
            zoom.closestPosition();

            /*
             TODO normalize applying of transform: for flexible ZOOM nor so wooden straight zoom as at now it is buggy and unstable
             */

            // $(viewContainer).find(spritespinInstance).css('transition', '');
            // var transform = 'scale(' + zoom.scale + ') translate3d(' + zoom.translate[0] * zoom.scale + 'px, ' + zoom.translate[1] * zoom.scale + 'px,0)';
            //
            // $(viewContainer).find(spritespinInstance).css({
            //     transform: transform
            // });
        };

        self.toggleFullscreen = function () {
            // dance with buben`
            if (spritespinInstance == '.spritespin-canvas') {
                $('.spritespin-instance').toggleClass('fullscreen').find('canvas.spritespin-canvas').toggleClass('fullscreen');
            } else {
                $('.spritespin-instance').toggleClass('in-row');
            }

            var isFullscreen = self.SpinApi.toggleFullscreen({
                target: viewContainer.parentNode
            });
            $(controlsContainer).find('.full').toggleClass('active', isFullscreen);

            if (isFullscreen) {
                defaultOptions.currentHeight = defaultOptions.maxHeight;
                defaultOptions.currentWidth = defaultOptions.maxWidth;
            } else {
                defaultOptions.currentHeight = defaultOptions.height;
                defaultOptions.currentWidth = defaultOptions.width;
            }

            self.SpinApi.bestQualityRender();
        };
    };


    return RotateView;
});