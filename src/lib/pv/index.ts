import { setTimer, localStore, getUid } from '../utils';
import { getResult, getObjType } from 'qmz-utils';
import { defaultUpTime, PVKey } from '../config'


export default class PV {
  options = {
    send: null,
    time: defaultUpTime,
    uid: getUid(),
  }

  constructor(opt:any) {
    this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
    this.onLoad(() => {
      this.options.uid = getUid();
      this.updateCounter();
      this.watchRouterChange();
      if (typeof opt.send === 'function') {
        this.uploadCounter()
      }
    })
  }
  onLoad(callback:any) {
    let timer:any;
    function setTimeoutOnWindow() {
      timer = setTimeout(callback);
  };
    if (document.readyState === "complete") {
      timer = setTimeout(callback)
    } else {
      window.addEventListener("load", setTimeoutOnWindow);
    }
    return function() {
      if (timer) clearTimeout(timer);
      window.removeEventListener("load", setTimeoutOnWindow);
    };
  }
  // 监听路由
  watchRouterChange() {
    const _self = this;
    // 监听路由变化
    window.addEventListener('hashchange', this.updateCounter);
    window.addEventListener('popstate', this.updateCounter);
    window.history && typeof window.history.pushState === 'function' &&
    (window.history.pushState = new Proxy(window.history.pushState, {
      apply(fn, cxt, args) {
        _self.updateCounter();
        Reflect.apply(fn, cxt, args)
      }
    }));
    window.history && typeof window.history.replaceState === 'function' &&
    (window.history.replaceState = new Proxy(window.history.replaceState, {
      apply(fn, cxt, args) {
        _self.updateCounter();
        Reflect.apply(fn, cxt, args)
      }
    }));
  }

  // 更新访问量
  async updateCounter() {
    let count:any = await localStore.get(PVKey);
    count = isNaN(count) ? 1 : count + 1;
    await localStore.set(PVKey, count);
  }

  // 上报访问量, 默认10S上报一次
  uploadCounter() {
    const { send, uid, time } = this.options;

    setTimer(async() => {
      const pv:any = await localStore.get(PVKey);
      if (pv > 0) {
        // 接口上传
        await getResult(send, {uid, pv, traceType: 'pv'});
        await localStore.set(PVKey, 0)
      }
    }, {interval: isNaN(time) ? defaultUpTime : time})
  }

}