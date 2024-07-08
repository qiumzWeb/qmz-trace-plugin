import { setTimer, localStore, getUid } from '../utils';
import { getResult, getObjType } from 'qmz-utils';
import { defaultUpTime, PVKey } from '../config'


export default class PV {
  options = {
    send: null,
    time: defaultUpTime,
  }

  constructor(opt:any) {
    this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
    this.updateCounter();
    this.watchRouterChange();
    if (typeof opt.send === 'function') {
      this.uploadCounter()
    }
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
    const { send, time } = this.options;

    setTimer(async() => {
      const pv:any = await localStore.get(PVKey);
      if (pv > 0) {
        // 接口上传
        await getResult(send, {uid: getUid(), pv, traceType: 'pv'});
        await localStore.set(PVKey, 0)
      }
    }, {interval: isNaN(time) ? defaultUpTime : time})
  }

}