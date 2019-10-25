define([], function () {
    var effects = {
        fadeIn: function(element, ms) {
            var delay = 40;
            if (ms !== undefined) {
                delay = ms;
            }
            element.style.opacity = 0;
            (function fade(){
                var step = parseFloat(element.style.opacity) + 0.1;
                element.style.opacity = step;
                (step >= 1) ? element.style.opacity = 1 : setTimeout(fade, delay)
            })();
        }
    };

    return effects;
});