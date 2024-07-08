import { getUid } from '../utils';
import { getResult, getObjType } from 'qmz-utils';
import { ErrorType } from '../config';

export default class TraceError {
  options = {
    send: null,
    uid: getUid()
  }

  constructor(opt:any) {
    this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
    // TODO
    this.watchScriptError();
    this.watchFetchError();
    this.watchPromiseError();
    this.watchXHRError();
  }
// 监听 资源 错误
  watchScriptError() {
    window.addEventListener('error', (e: any) => {
      const { message, filename, lineno, colno, error } = e;
      const { uid } = this.options;
      getResult(this.options.send, {message: {
        filename, lineno, colno, error, message
      }, uid, traceType: ErrorType.JS}).catch(err => console.log(err));
    }, true)
  }
// 监听 Fetch 请求错误
  watchFetchError() {
    const { uid, send } = this.options;
    window.fetch = new Proxy(window.fetch, {
      apply: function(target, thisArg, argumentsList) {
        return Reflect.apply(target, thisArg, argumentsList).then((response) => {
          if (!response.ok) {
            try {
              const { status, statusText, url } = response;
              response.clone().text().then((message) => {
                getResult(send, {message: {
                  status, statusText, url, message
                }, uid, traceType: ErrorType.FETCH}).catch(err => console.log(err));
              })
            } catch(e) {console.log(e)}
          }
          return response;
        }).catch((error) => {
          getResult(send, {message: error, uid, traceType: ErrorType.FETCH}).catch(err => console.log(err));
          return Promise.reject(error);
        });
      }
    })
  }
// 监听 XHR 请求错误
  watchXHRError() {
    const { uid, send } = this.options;
    window.XMLHttpRequest.prototype.open = new Proxy(window.XMLHttpRequest.prototype.open, {
      apply: function(target, thisArg, argumentsList) {
        const xhr = thisArg;
        const oldSend = xhr.send;
        xhr.send = new Proxy(oldSend, {
          apply: function(fn, cxt, args) {
            xhr.addEventListener('readystatechange', function() {
              if (xhr.readyState === XMLHttpRequest.DONE && xhr.status !== 200) {
                getResult(send, {message: {
                    status: xhr.status, statusText: xhr.statusText, url: xhr.responseURL, message: xhr.responseText
                }, uid, traceType: ErrorType.XHR}).catch(err => console.log(err));
              }
            }, true)
            Reflect.apply(fn, cxt, args);
          }
        })
        Reflect.apply(target, thisArg, argumentsList);
      }
    })

  }
// 监听 Promise 错误
  watchPromiseError() {
    window.addEventListener('unhandledrejection', (e: any) => {
      const { reason } = e;
      const { message, stack } = reason;
      const { uid } = this.options;
      getResult(this.options.send, {message, stack, uid, traceType: ErrorType.PROMISE}).catch(err => console.log(err));
    }, true)
  }

}
