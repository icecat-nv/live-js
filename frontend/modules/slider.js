let $ = require('jquery'),
    slick = require('slick-carousel'),
    _ = require('underscore');
/*
    By calling 'slick' in define call we modify jquery object by adding to it new method $.fn.slick,
    therefore we can use now $(container).slick(config);
 */
module.exports = function Slider(container, config) {
    config = config || {};

    // var container = config.container;
    container = (container.__proto__ == $.fn) ? container : $(container);

    var defaults = {
        dots: true,
        infinite: true,
        speed: 300,
        respondTo: 'slider',
        responsive: [
            {
                breakpoint: 620,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    };

    /*
        furthermore this config is being extended by data attributes of the container:
        it happens internally in plugin's code - and we just carry some config properties
        in the data attributes

        see:
             - /js/templates/video.tpl
             - /js/templates/tours.tpl
        and read docs:
             - http://kenwheeler.github.io/slick/ (section 'Data Attribute Settings')
     */
    config = _.extend(defaults, config);

    // constructor
    Object.defineProperties(this, {
        API: {
            get: function () {
                return container.slick('getSlick')
            }
        },
        render: {
            value: function (_container) {
                (_container) ? _container.slick(config) : container.slick(config);
            }
        },
        items: {
            // implemented as getter because every time we have to keep the persistence with the DOM state
            get: function () {
                return container.find('.slick-preview');
            }
        },
        itemsCount: {
            get: function () {
                return this.API.slideCount;
            }
        },
        arrows: {
            // implemented as getter because every time we have to keep the persistence with the DOM state
            get: function () {
                return container.find('.slick-arrow');
            }
        },
        /**
             Handle dragging and single click:

             if click - load video from preview
             if drag - let the slider slide without loading of video
         * @param event
         * @param el
         * @returns {boolean}
         */
        filterClick: {
            value: function (event, callback) {
                var $doc = $(document),
                    moved = false,
                    pos = { x: null, y: null },
                    abs = Math.abs,
                    mclick = {
                        'mousedown.mclick': function (e) {
                            pos.x = e.pageX;
                            pos.y = e.pageY;
                            moved = false;
                        },
                        'mouseup.mclick': function (e) {
                            moved = abs(pos.x - e.pageX) > $.clickMouseMoved.threshold
                                || abs(pos.y - e.pageY) > $.clickMouseMoved.threshold;
                        }
                    };
                $doc.on(mclick);

                $.clickMouseMoved = function () {
                    return moved;
                };
                $.clickMouseMoved.threshold = 3;

                $(event.target).on('click', '.delegated', function (e) {
                    if ($.clickMouseMoved()) {
                        return;
                    }
                });
                $(event.target).on('click', function (e) {
                    if ($.clickMouseMoved()) {
                        return;
                    }


                    // Execute callback only if clicked nor dragged!
                    if (callback instanceof Function) callback();
                });

                return moved;
            }
        }
    });
}
