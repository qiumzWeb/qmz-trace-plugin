import { Bus, getObjType } from 'qmz-utils';
import { setIpAdress } from './lib/utils'

import TracePv from './lib/pv'
import TraceError from './lib/error'

export default class QmzTrace {
  options = {
    send: null,
    uid: null,
    time: 100000,
    domain: window.location.hostname
  }
  constructor(opt:any) {
    this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
    const { uid, domain, ...options } = this.options;
    Bus.setState({uid})
    // 注册uid
    setIpAdress(domain)
    // 监控PV/UV
    new TracePv(options);
    // 监听 异常错误
    new TraceError(options);
  }
}