define([
    './mobile',
    'hammer',
    './imgAjax',
    './effects'
], function (mobile, Hammer, imgAjax, effects) {

    var cacheEvents = {
        mouse : [],
        zoomPanel : [],
        mobile: [],
        doc: []
    };
    var loadingBigImage = false;
    var highImageStatus = false;

    var zoom = {
        set highImageStatus(value) {
            highImageStatus = value;
        },
        set loadingBigImage(value) {
            loadingBigImage = value;
        },
        zoomRust: function() {
            var image = this;
            var galleryIndex = parseInt(image.getAttribute("data"),10);
            var zoomPicId = image.gallery[galleryIndex].ID;
            var productID = image.gallery[galleryIndex].productId;
            var imageContainer = document.getElementById('zoomWrapper');
            var loadZoomPic = highImageStatus === true ? false : true;
            var loader = document.querySelector(".-icecat-loader");
            if (loader.classList.contains("-icecat-hidden")) loader.classList.remove("-icecat-hidden");
            image.style.opacity = 0;

            function processZoom() {

                var srcData = image.getAttribute("src");
                if(srcData != '') {
                    clearInterval(intervalID);

                    function startZoomPic(max) {
                        if (loader.classList.contains("-icecat-hidden")) {
                            loader.classList.remove("-icecat-hidden");
                        }
                        loadZoomPic = false;
                        var zoomImage = new Image();
                        loadingBigImage = true;
                        zoomImage.onload = function() {
                            if(loadingBigImage === true) {
                                ZOOM_LIMIT_PERCENT = 1;
                                zoomImage.setAttribute("data", galleryIndex);
                                zoomImage.gallery = image.gallery;
                                document.getElementById('zoomWrapper').replaceChild(zoomImage, image);
                                image = zoomImage;
                                retObj.scales = {
                                    main:{
                                        width:imageContainer.clientWidth,
                                        height:imageContainer.clientHeight,
                                        WtoH:imageContainer.clientWidth/imageContainer.clientHeight,
                                        HtoW:imageContainer.clientHeight/imageContainer.clientWidth
                                    },
                                    own:{
                                        WtoH:image.clientWidth/image.clientHeight,
                                        HtoW:image.clientHeight/image.clientWidth,
                                        width:image.clientWidth,
                                        height:image.clientHeight,
                                        kH:image.clientHeight / image.clientWidth,
                                        kW:image.clientWidth/image.clientHeight
                                    },
                                    ownTOmain:{
                                        H:image.clientHeight/imageContainer.clientHeight,
                                        W:image.clientWidth/imageContainer.clientWidth
                                    },
                                    get basis(){
                                        if(this.own.WtoH >=1){
                                            return "height";
                                        }else{
                                            return "width";
                                        }
                                    },
                                    get mbasis(){
                                        if(this.ownTOmain.W < 1 && this.ownTOmain.H < 1 ){
                                            return false;
                                        }else{
                                            return this.ownTOmain.W < this.ownTOmain.H ? "height" : "width";
                                        }
                                    },
                                    get scale(){
                                        if(this.own.WtoH >=1){
                                            return this.own.HtoW * this.main.HtoW * 100;
                                        }else{
                                            return this.own.WtoH * this.main.HtoW * 100;
                                        }
                                    }

                                };

                                loadZoomPic = false;
                                loadingBigImage = false;
                                if(retObj.scales.mbasis) {
                                    retObj.zoom();
                                } else {
                                    centerImageOut();
                                }
                                var goScale = retObj.zoomScale * retObj.swapZoomSteps;
                                retObj.zoomIn(goScale, max);
                                if (!loader.classList.contains("-icecat-hidden")) {
                                    loader.classList.add("-icecat-hidden");
                                }
                            }
                        };
                        if(zoomPicId) {
                            zoomImage.id = "img-high-" + productID + "-" + zoomPicId;
                        } else {
                            zoomImage.id = "img-high-" + productID;
                        }
                        imgAjax.loadImages(zoomImage);
                    };

                    image.style.width = "";
                    image.style.height = "";
                    var ZOOM_LIMIT_PERCENT = 1;
                    var ZOOM_PERCENT = 10;
                    var ignore = "move";

                    var onEvents = function(node, listeners) {
                        if(node != null && listeners != undefined) {
                            for(var eventName in listeners) {
                                if(eventName == ignore) continue;
                                node.addEventListener(eventName, listeners[eventName]);
                            }
                        }
                    };
                    var offEvents = function(node, listeners) {
                        if(node != null && listeners != undefined) {
                            for(var eventName in listeners) {
                                if(eventName == ignore) continue;
                                node.removeEventListener(eventName, listeners[eventName]);
                            }
                        }
                    };

                    var countScales = function () {
                        var scales = {};
                        if(image.complete) {
                            scales = {
                                main:{
                                    width:imageContainer.clientWidth,
                                    height:imageContainer.clientHeight,
                                    WtoH:imageContainer.clientWidth/imageContainer.clientHeight,
                                    HtoW:imageContainer.clientHeight/imageContainer.clientWidth
                                },
                                own:{
                                    WtoH:image.clientWidth/image.clientHeight,
                                    HtoW:image.clientHeight/image.clientWidth,
                                    width:image.clientWidth,
                                    height:image.clientHeight,
                                    kH:image.clientHeight / image.clientWidth,
                                    kW:image.clientWidth/image.clientHeight
                                },
                                ownTOmain:{
                                    H:image.clientHeight/imageContainer.clientHeight,
                                    W:image.clientWidth/imageContainer.clientWidth
                                },
                                get basis() {
                                    if(this.own.WtoH >=1){
                                        return "height";
                                    }else{
                                        return "width";
                                    }
                                },
                                get mbasis() {
                                    if(this.ownTOmain.W < 1 && this.ownTOmain.H < 1 ){
                                        return false;
                                    } else {
                                        return this.ownTOmain.W < this.ownTOmain.H ? "height" : "width";
                                    }
                                },
                                get scale() {
                                    if(this.own.WtoH >=1) {
                                        return this.own.HtoW * this.main.HtoW * 100;
                                    } else {
                                        return this.own.WtoH * this.main.HtoW * 100;
                                    }
                                }
                            };
                            return scales;
                        }else{
                        }

                    };

                    var centerImageOut = function() {
                        var left = parseFloat(image.style.left);
                        var top = parseFloat(image.style.top);
                        var offset = {
                            get left() {
                                var metricLeft = (imageContainer.clientWidth - image.clientWidth)/2;
                                if (metricLeft < 0 )
                                    return metricLeft;
                                else
                                    return 0;

                            },
                            top  : (imageContainer.clientHeight - image.clientHeight)/2
                        };
                        if(left < 0)
                            image.style.left = offset.left + "px";
                        else
                            image.style.left = 0 + "px";
                        if(top < 0)
                            image.style.top = offset.top + "px";
                        else
                            image.style.top =  (imageContainer.clientHeight - image.clientHeight)/2 + "px";
                    };
                    var retObj = {
                        zoomStep:5,
                        swapZoomSteps: 0,
                        mousePositions:{
                            x:0,
                            y:0,
                            lastX: 0,
                            lastY: 0
                        },
                        moveState: 1,
                        scales : countScales(),
                        calcProps: function() {
                            if (this.scales.mbasis == "height") {
                                image.style.width = parseInt(image.clientHeight / this.scales.own.kH, 10) + "px";
                            } else if(this.scales.mbasis == "width") {
                                image.style.height = parseInt(image.clientWidth / this.scales.own.kW, 10) + "px"
                            }
                        },
                        get zoomScale() {
                            var getter = this.scales.mbasis ? this.scales.mbasis : this.scales.basis ;
                            var realScale = this.scales.own[getter];
                            var zoomScale = realScale / 100 * ZOOM_PERCENT;
                            return zoomScale;
                        },
                        get offsets()  {
                            return {
                                left : (imageContainer.clientWidth - image.clientWidth) * 2,
                                top :  (imageContainer.clientHeight - image.clientHeight) * 2
                            };
                        },
                        get moveOffsets() {
                            var v = image.clientHeight / imageContainer.clientHeight;
                            var h = image.clientHeight / imageContainer.clientHeight;
                            if(mobile.status === true) {
                                v = (image.clientHeight / 100);
                                h = (image.clientWidth / 100);
                            }

                            return {
                                vertical: v,
                                horizontal: h
                            };
                        },
                        real : function() {
                            var realScale = this.scales.own[this.scales.mbasis] + "px";
                            image.style[this.scales.mbasis] = realScale;
                        },
                        moveV : function(offset) {
                            offset = offset || 10;
                            var currentOffset = parseFloat(image.style.top) || 0;
                            var offsetV = imageContainer.clientHeight - image.clientHeight;
                            var nextTop = currentOffset + offset;
                            if(nextTop > 0) {
                                nextTop = 0;
                            }
                            if(Math.abs(nextTop) > Math.abs(offsetV)) {
                                nextTop = offsetV;
                            }
                            image.style.top = (nextTop)  + "px";
                        },
                        moveH : function(offset) {
                            offset = offset || 10;
                            var currentOffset = parseFloat(image.style.left) || 0;
                            var offsetH = imageContainer.clientWidth - image.clientWidth;
                            var nextLeft = currentOffset + offset;
                            if(nextLeft > 0) {
                                nextLeft = 0;
                            }
                            if(Math.abs(nextLeft) > Math.abs(offsetH)) {
                                nextLeft = offsetH;
                            }
                            image.style.left = (nextLeft)  + "px";
                        },
                        moveReset: function() {
                            image.style.left = 0;
                            //image.style.top  = 0;
                            if(retObj.scales.mbasis) {
                                image.style.top  = 0;
                            } else {
                                var top  = (imageContainer.clientHeight - image.clientHeight)/2;
                                image.style.top = top + "px"
                            }
                        },
                        zoom : function(scale) {
                            if (scale === undefined) {
                                image.style[this.scales.mbasis] = this.scales.main[this.scales.mbasis] + "px";
                                this.calcProps();
                            }
                            centerImageOut();
                            if(mobile.status === true) {
                                setTimeout(function(){
                                    centerImageOut();
                                },100);
                            }
                            this.posCheck();
                        },
                        zoomIn : function(scale, max, force) {
                            if(zoomIn.className == "-icecat-zoomInDeactivate") {
                                return false;
                            }
                            if(loadZoomPic === true) {
                                startZoomPic(max);
                            }
                            var getter = this.scales.mbasis ? this.scales.mbasis : this.scales.basis ;
                            var realScale = this.scales.own[getter];
                            var currentZoom = parseFloat(image.style[getter]);
                            if(isNaN(currentZoom)) currentZoom = realScale;
                            var limit = parseFloat((realScale / 100 * ZOOM_LIMIT_PERCENT) + realScale);

                            if(max === true) {
                                scale = limit - currentZoom;
                            }

                            if(currentZoom < limit) {
                                if (scale === undefined || isNaN(scale)){
                                    image.style[this.scales.mbasis] = (currentZoom + this.zoomStep)  + "px";
                                    zoomIn.className = "-icecat-zoomInDeactivate";
                                    initialState.className = "-icecat-initialStateDeactivate";
                                } else {
                                    image.style[this.scales.mbasis] = (currentZoom + parseInt(scale,10))  + "px";
                                    if(!force)this.swapZoomSteps++;
                                    this.calcProps();
                                    var centerImg = function() {
                                        var offset = {
                                            left : (imageContainer.clientWidth - image.clientWidth)/2,
                                            top :  (imageContainer.clientHeight - image.clientHeight)/2
                                        };
                                        if(offset.left < 0) image.style.left = offset.left + "px";
                                        if(offset.top < 0) image.style.top = offset.top + "px";
                                    }();
                                    this.posCheck();
                                    if (this.swapZoomSteps ) {
                                        var nextCurrentZoom = currentZoom + this.zoomScale;
                                    } else {
                                        var nextCurrentZoom = currentZoom + parseInt(scale,10);
                                    }
                                    if (nextCurrentZoom > limit) {
                                        zoomIn.className = "-icecat-zoomInDeactivate";
                                    }
                                }
                            }
                        },
                        zoomOut : function(scale) {
                            var realScale = this.scales.own[this.scales.mbasis];
                            var currentZoom = parseFloat(image.style[this.scales.mbasis]);
                            var limit = this.scales.main[this.scales.mbasis];

                            var nextZoom = currentZoom - scale;
                            if(nextZoom < limit) {
                                scale = currentZoom - limit;
                            }

                            if(currentZoom > limit) {
                                if (scale === undefined || isNaN(scale)){
                                    image.style[this.scales.mbasis] = (currentZoom - this.zoomStep)  + "px";
                                } else {
                                    image.style[this.scales.mbasis] = (currentZoom - parseInt(scale,10))  + "px";
                                    this.calcProps();
                                    centerImageOut();
                                }
                                this.posCheck();
                            }
                        },
                        posCheck: function() {
                            var offset = {
                                left : (imageContainer.clientWidth - image.clientWidth),
                                top :  (imageContainer.clientHeight - image.clientHeight)
                            };

                            var left = parseFloat(image.style.left);
                            var top  = parseFloat(image.style.top);
                            var posRes = {
                                up : top < 0 ? true : false,
                                down : top > offset.top ? true : false ,
                                left : left > offset.left ? true : false,
                                right : left < 0 ? true : false
                            };
                            for (property in posRes) {
                                if (posRes[property] === false) {
                                    zoomIn.classList.remove("-icecat-zoomInDeactivate");
                                    zoomOut.className = "-icecat-zoomOutDeactivate";
                                    initialState.className = "-icecat-initialStateDeactivate";
                                } else {
                                    if (zoomIn.className == "-icecat-zoomInDeactivate")  {
                                        zoomIn.classList.remove("-icecat-zoomInDeactivate");
                                    }
                                    zoomOut.classList.remove("-icecat-zoomOutDeactivate");
                                    initialState.classList.remove("-icecat-initialStateDeactivate");
                                    return false;
                                }
                            }
                        }
                    };

                    //if(retObj.scales.mbasis) {
                    var zoomPanel = {
                        zoomIn : {
                            get button() {
                                return document.getElementById("zoomIn");
                            },
                            handlers : {
                                click : function(e) {
                                    e.preventDefault();
                                    retObj.zoomIn(retObj.zoomScale);
                                }
                            }
                        },
                        zoomOut : {
                            get button() {
                                return document.getElementById("zoomOut");
                            },
                            handlers : {
                                click : function(e) {
                                    e.preventDefault();
                                    retObj.zoomOut(retObj.zoomScale);
                                }
                            }
                        },
                        initialState : {
                            get button() {
                                return document.getElementById("initialState");
                            },
                            handlers : {
                                click : function(e) {
                                    e.preventDefault();
                                    if (initialState.className == "-icecat-initialStateDeactivate") {
                                        return false;
                                    } else if (loadZoomPic === true) {
                                        retObj.zoomIn(retObj.zoomScale, false, true);
                                        return false;
                                    }
                                    retObj.moveReset();
                                    retObj.zoom();
                                }
                            }
                        }
                    };

                    var gb;
                    if (mobile.status === true) {
                        var posCheck = function() {
                            var offset = {
                                left : (imageContainer.clientWidth - image.clientWidth),
                                top :  (imageContainer.clientHeight - image.clientHeight)
                            };

                            var left = parseFloat(image.style.left);
                            var top  = parseFloat(image.style.top);
                            return {
                                up : top < 0 ? true : false,
                                down : top > offset.top ? true : false ,
                                left : left > offset.left ? true : false,
                                right : left < 0 ? true : false
                            }
                        };
                        var doubleTapped = false;
                        var mobileHandlers = {
                            pinchin : function(e) {
                                retObj.zoomOut(retObj.zoomScale);
                            },
                            pinchout : function(e) {
                                retObj.zoomIn(retObj.zoomScale);
                            },
                            doubletap : function(e) {
                                doubleTapped = doubleTapped ? false : true;
                                if(doubleTapped === true) {
                                    retObj.zoomIn(10, true);
                                } else if(doubleTapped === false) {
                                    retObj.moveReset();
                                    retObj.zoom();
                                }
                            },
                            panup : function(e) {
                                if (posCheck().up === true)
                                    retObj.moveV(retObj.moveOffsets.vertical);
                            },
                            pandown : function(e) {
                                if (posCheck().down === true)
                                    retObj.moveV(-retObj.moveOffsets.vertical);
                            },
                            panleft : function(e) {
                                if (posCheck().right === true)
                                    retObj.moveH(retObj.moveOffsets.horizontal);
                            },
                            panright : function(e) {
                                if (posCheck().left === true)
                                    retObj.moveH(-retObj.moveOffsets.horizontal);
                            }
                        };
                        var mobileListeners = function(obj, listeners, task) {
                            if(obj != null && listeners != undefined) {
                                for(var eventName in listeners) {
                                    if (task === true) {
                                        obj.on(eventName, listeners[eventName]);
                                    } else if(task === false) {
                                        obj.off(eventName, listeners[eventName]);
                                    }
                                }
                            }
                        };

                        if (window.hammer1 === undefined) {
                            window.hammer1 = new Hammer(imageContainer, {prevent_default: true, transform_always_block: true});
                            hammer1.get('pinch').set({enable: true})
                            hammer1.get('doubletap').set({
                                interval: 500,
                                time: 1000,
                                posThreshold: 100
                            });
                            mobileListeners(hammer1, mobileHandlers, true);
                            cacheEvents.mobile.push(mobileHandlers);
                        } else {
                            gb = cacheEvents.mobile.pop();
                            mobileListeners(hammer1, gb, false);
                            mobileListeners(hammer1, mobileHandlers, true);
                            cacheEvents.mobile.push(mobileHandlers);
                        }
                    } else { // PC
                        var mouseHandlers = {
                            wheel : function(e) {
                                e.preventDefault();
                                var direction = e.deltaY > 0;
                                //var zoomScale = e.shiftKey ? (retObj.zoomStep * 10) : undefined;
                                var zoomScale = retObj.zoomScale;
                                if (direction) {
                                    retObj.zoomOut(zoomScale);
                                } else {
                                    retObj.zoomIn(zoomScale);
                                }
                            },
                            move : function(e) {
                                e.preventDefault();
                                retObj.mousePositions.x =  e.clientX;
                                retObj.mousePositions.y =  e.clientY;

                                var diff = {
                                    x: retObj.mousePositions.x ? retObj.mousePositions.x - retObj.mousePositions.lastX : e.clientX,
                                    y: retObj.mousePositions.y ? retObj.mousePositions.y - retObj.mousePositions.lastY : e.clientY
                                };

                                var posCheck = function() {
                                    var offset = {
                                        left : (imageContainer.clientWidth - image.clientWidth),
                                        top :  (imageContainer.clientHeight - image.clientHeight)
                                    };

                                    var left = parseFloat(image.style.left);
                                    var top  = parseFloat(image.style.top);
                                    return {
                                        up : top < 0 ? true : false,
                                        down : top > offset.top ? true : false ,
                                        left : left > offset.left ? true : false,
                                        right : left < 0 ? true : false
                                    }
                                }();

                                var moveSpeed = retObj.moveOffsets;
                                var vertical   = moveSpeed.vertical + Math.abs(diff.y);
                                var horizontal = moveSpeed.horizontal + Math.abs(diff.x) ;
                                if (posCheck.down === true && (diff.x <  2) && (diff.y < -2)) { // down
                                    retObj.moveV(-vertical);
                                }
                                if (posCheck.up === true && (diff.x  <  2) && (diff.y  >  2)) { // up
                                    retObj.moveV(vertical);
                                }
                                if (posCheck.right === true && (diff.x >  2) && (diff.y <  2)) { // right
                                    retObj.moveH(horizontal);
                                }
                                if (posCheck.left === true && (diff.x < -2) && (diff.y <  2)) { // left
                                    retObj.moveH(-horizontal);
                                }
                                if (diff.x >  2 && diff.y >  2)  { // down-right
                                    if(posCheck.up === true) retObj.moveV(moveSpeed.vertical);
                                    if(posCheck.right === true) retObj.moveH(moveSpeed.horizontal);
                                }
                                if (diff.x >  2 && diff.y < -2) { // up-right
                                    if(posCheck.down) retObj.moveV(-moveSpeed.vertical);
                                    if(posCheck.right === true) retObj.moveH(moveSpeed.horizontal);
                                }
                                if (diff.x < -2 && diff.y >  2) { // down-left
                                    if(posCheck.up === true) retObj.moveV(moveSpeed.vertical);
                                    if(posCheck.left === true) retObj.moveH(-moveSpeed.horizontal);
                                }
                                if (diff.x < -2 && diff.y < -2) { //  up-left
                                    if(posCheck.down === true)  retObj.moveV(-moveSpeed.vertical);
                                    if(posCheck.left === true) retObj.moveH(-moveSpeed.horizontal);
                                }

                                retObj.mousePositions.lastX = retObj.mousePositions.x;
                                retObj.mousePositions.lastY = retObj.mousePositions.y;
                            },
                            mousedown: function(e) {
                                if (retObj.moveState == 1) {
                                    e.preventDefault();
                                    imageContainer.addEventListener('mousemove', mouseHandlers.move);
                                    imageContainer.style.cursor = "move";
                                    imageContainer.setAttribute("data", 1);
                                }
                            },
                            mouseup: function(e) {
                                if (retObj.moveState == 1) {
                                    e.preventDefault();
                                    imageContainer.removeEventListener('mousemove', mouseHandlers.move);
                                    imageContainer.style.cursor = "auto";
                                    imageContainer.setAttribute("data", 0);
                                    retObj.mousePositions.lastX = 0;
                                    retObj.mousePositions.lastY = 0;
                                }
                            },
                            mouseout: function(e) {
                                e.preventDefault();
                                retObj.mousePositions.lastX = 0;
                                retObj.mousePositions.lastY = 0;
                            }
                        };

                        gb = cacheEvents.mouse.pop();
                        cacheEvents.mouse.push(mouseHandlers);
                        offEvents(imageContainer, gb);
                        onEvents(imageContainer, mouseHandlers);

                        var cocaine = cacheEvents.doc.pop();
                        if(cocaine !== undefined) {
                            document.removeEventListener("mouseup", cocaine);
                        }
                        cacheEvents.doc.push(mouseHandlers.mouseup);
                        document.addEventListener("mouseup", mouseHandlers.mouseup);
                    }
                    gb = cacheEvents.zoomPanel.pop();
                    for(var btn in gb) {
                        offEvents(gb[btn].button, gb[btn].handlers);
                    }
                    cacheEvents.zoomPanel.push(zoomPanel);
                    for(var btn in zoomPanel) {
                        onEvents(zoomPanel[btn].button, zoomPanel[btn].handlers);
                    }

                    retObj.moveReset();
                    if(retObj.scales.mbasis) {
                        retObj.zoom();
                    } else {
                        centerImageOut();
                    }

                    image.style.opacity = 1;
                    if (!loader.classList.contains("-icecat-hidden")) loader.classList.add("-icecat-hidden");
                    imageContainer.classList.add("-icecat-animated");
                    imageContainer.classList.add("-icecat-fadeIn");
                    setTimeout(function(){
                        imageContainer.classList.remove("-icecat-animated");
                        imageContainer.classList.remove("-icecat-fadeIn");
                    }, 1000);


                    return retObj;
                }
            }
            var intervalID = setInterval(processZoom, 50);

        }
    };

    return zoom;
});