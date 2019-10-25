let $ = require('jquery'),
    _ = require('underscore');

/*
example how we can store module name in the variable;
read https://github.com/mishoo/UglifyJS2 how to save functions name from uglifying
 */
// var moduleName = arguments.callee.name;

module.exports = function ExceptionCatcher() {
    /*
        check if client already hung the window.onerror
     */
    if (window.onerror && window.onerror instanceof Function) var oldErrorHandler = window.onerror;

    window.onerror = function (errorMsg, url, lineNumber, column, errorObj) {

        // call client's handler
        if (oldErrorHandler) oldErrorHandler.apply(window, arguments);

        var error = {
            err: errorObj,
            stack: {
                message: errorMsg,
                line: lineNumber,
                column: column,
                filename: url
            }
        };

        // Check if the error occured in our production script
        if (error.stack.filename.search(/live-current\.js/) !== -1) {
            // sendError(error);
        }
    };


    window.LiveError = function (options) {
        var defaults = {
            errorMsg: '',
            url: '',
            lineNumber: '',
            column: '',
            errorObj: '',
            date: new Date,
            userAgent: navigator.userAgent,
            link: window.location.href
        };
        options = _.extend(defaults, options);

        Error.call(this);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, LiveError);
        } else {
            this.trace = (new Error()).stack;
        }

        this.err = options.errorObj;

        this.origin = options;
    };
    LiveError.prototype = Object.create(Error.prototype);


    window.LiveErrorEvent = function (error) {
        var _LiveErrorEvent = CustomEvent.bind(null, 'LiveError', {
            detail: new LiveError(error),
            bubbles: true,
            cancelable: true
        });
        dispatchEvent(new _LiveErrorEvent);
    };


    window.addEventListener("LiveError", function (e) {
        console.log('error ', e);
        // sendError(e.detail);
    })
};


function sendError(error) {
    $.ajax({
        url: '',
        type: 'POST',
        data: error,
        dataType: 'json'
    })
}