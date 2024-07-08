var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { Bus, getObjType } from 'qmz-utils';
import { setIpAdress } from './lib/utils';
import TracePv from './lib/pv';
import TraceError from './lib/error';
var QmzTrace = /** @class */ (function () {
    function QmzTrace(opt) {
        this.options = {
            send: null,
            uid: null,
            time: 100000,
            domain: window.location.hostname
        };
        this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
        var _a = this.options, uid = _a.uid, domain = _a.domain, options = __rest(_a, ["uid", "domain"]);
        Bus.setState({ uid: uid });
        // 注册uid
        setIpAdress(domain);
        // 监控PV/UV
        new TracePv(options);
        // 监听 异常错误
        new TraceError(options);
    }
    return QmzTrace;
}());
export default QmzTrace;
//# sourceMappingURL=index.js.map