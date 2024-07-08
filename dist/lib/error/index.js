import { getUid } from '../utils';
import { getResult, getObjType } from 'qmz-utils';
import { ErrorType } from '../config';
var TraceError = /** @class */ (function () {
    function TraceError(opt) {
        this.options = {
            send: null,
        };
        this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
        // TODO
        this.watchScriptError();
        this.watchFetchError();
        this.watchPromiseError();
        this.watchXHRError();
    }
    // 监听 资源 错误
    TraceError.prototype.watchScriptError = function () {
        var _this = this;
        window.addEventListener('error', function (e) {
            var message = e.message, filename = e.filename, lineno = e.lineno, colno = e.colno, error = e.error;
            getResult(_this.options.send, { message: {
                    filename: filename, lineno: lineno, colno: colno, error: error, message: message
                }, uid: getUid(), traceType: ErrorType.JS }).catch(function (err) { return console.log(err); });
        }, true);
    };
    // 监听 Fetch 请求错误
    TraceError.prototype.watchFetchError = function () {
        var send = this.options.send;
        window.fetch = new Proxy(window.fetch, {
            apply: function (target, thisArg, argumentsList) {
                return Reflect.apply(target, thisArg, argumentsList).then(function (response) {
                    if (!response.ok) {
                        try {
                            var status_1 = response.status, statusText_1 = response.statusText, url_1 = response.url;
                            response.clone().text().then(function (message) {
                                getResult(send, { message: {
                                        status: status_1, statusText: statusText_1, url: url_1, message: message
                                    }, uid: getUid(), traceType: ErrorType.FETCH }).catch(function (err) { return console.log(err); });
                            });
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                    return response;
                }).catch(function (error) {
                    getResult(send, { message: error, uid: getUid(), traceType: ErrorType.FETCH }).catch(function (err) { return console.log(err); });
                    return Promise.reject(error);
                });
            }
        });
    };
    // 监听 XHR 请求错误
    TraceError.prototype.watchXHRError = function () {
        var send = this.options.send;
        window.XMLHttpRequest.prototype.open = new Proxy(window.XMLHttpRequest.prototype.open, {
            apply: function (target, thisArg, argumentsList) {
                var xhr = thisArg;
                var oldSend = xhr.send;
                xhr.send = new Proxy(oldSend, {
                    apply: function (fn, cxt, args) {
                        xhr.addEventListener('readystatechange', function () {
                            if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
                                getResult(send, { message: {
                                        status: xhr.status, statusText: xhr.statusText, url: xhr.responseURL, message: xhr.responseText
                                    }, uid: getUid(), traceType: ErrorType.XHR }).catch(function (err) { return console.log(err); });
                            }
                        }, true);
                        Reflect.apply(fn, cxt, args);
                    }
                });
                Reflect.apply(target, thisArg, argumentsList);
            }
        });
    };
    // 监听 Promise 错误
    TraceError.prototype.watchPromiseError = function () {
        var _this = this;
        window.addEventListener('unhandledrejection', function (e) {
            var reason = e.reason;
            var message = reason.message, stack = reason.stack;
            getResult(_this.options.send, { message: message, stack: stack, uid: getUid(), traceType: ErrorType.PROMISE }).catch(function (err) { return console.log(err); });
        }, true);
    };
    return TraceError;
}());
export default TraceError;
//# sourceMappingURL=index.js.map