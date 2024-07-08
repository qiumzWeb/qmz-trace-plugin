var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { setTimer, localStore, getUid } from '../utils';
import { getResult, getObjType } from 'qmz-utils';
import { defaultUpTime, PVKey } from '../config';
var PV = /** @class */ (function () {
    function PV(opt) {
        this.options = {
            send: null,
            time: defaultUpTime,
        };
        this.options = getObjType(opt) === 'Object' ? Object.assign(this.options, opt) : this.options;
        this.updateCounter();
        this.watchRouterChange();
        if (typeof opt.send === 'function') {
            this.uploadCounter();
        }
    }
    // 监听路由
    PV.prototype.watchRouterChange = function () {
        var _self = this;
        // 监听路由变化
        window.addEventListener('hashchange', this.updateCounter);
        window.addEventListener('popstate', this.updateCounter);
        window.history && typeof window.history.pushState === 'function' &&
            (window.history.pushState = new Proxy(window.history.pushState, {
                apply: function (fn, cxt, args) {
                    _self.updateCounter();
                    Reflect.apply(fn, cxt, args);
                }
            }));
        window.history && typeof window.history.replaceState === 'function' &&
            (window.history.replaceState = new Proxy(window.history.replaceState, {
                apply: function (fn, cxt, args) {
                    _self.updateCounter();
                    Reflect.apply(fn, cxt, args);
                }
            }));
    };
    // 更新访问量
    PV.prototype.updateCounter = function () {
        return __awaiter(this, void 0, void 0, function () {
            var count;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localStore.get(PVKey)];
                    case 1:
                        count = _a.sent();
                        count = isNaN(count) ? 1 : count + 1;
                        return [4 /*yield*/, localStore.set(PVKey, count)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    // 上报访问量, 默认10S上报一次
    PV.prototype.uploadCounter = function () {
        var _this = this;
        var _a = this.options, send = _a.send, time = _a.time;
        setTimer(function () { return __awaiter(_this, void 0, void 0, function () {
            var pv;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, localStore.get(PVKey)];
                    case 1:
                        pv = _a.sent();
                        if (!(pv > 0)) return [3 /*break*/, 4];
                        // 接口上传
                        return [4 /*yield*/, getResult(send, { uid: getUid(), pv: pv, traceType: 'pv' })];
                    case 2:
                        // 接口上传
                        _a.sent();
                        return [4 /*yield*/, localStore.set(PVKey, 0)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); }, { interval: isNaN(time) ? defaultUpTime : time });
    };
    return PV;
}());
export default PV;
//# sourceMappingURL=index.js.map