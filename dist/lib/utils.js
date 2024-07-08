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
import { getResult, IndexDBStore, Cookie, Bus } from 'qmz-utils';
import { localCacheName } from './config';
import moment from 'moment';
// 本地缓存
/* tslint:disable */
export var localStore = IndexDBStore(localCacheName);
export var uidKey = 'qtrace-uid';
// 注册设备ID
export function setIpAdress(domain) {
    if (domain === void 0) { domain = location.hostname; }
    var ipKey = uidKey;
    var win = window;
    var db = win.indexedDB && localStore;
    if (db) {
        db.get(ipKey).then(function (id) {
            getDeviceId(id, Cookie, localStorage, sessionStorage);
        });
    }
    else {
        getDeviceId(null, Cookie, localStorage, sessionStorage);
    }
    function getDeviceId(dbId, Cookie, ls, session) {
        var local_ip = dbId || getId(ls, ipKey) || getId(session, ipKey) || Cookie.get(ipKey);
        if (!local_ip) {
            local_ip = getRandom(999) + "." + getRandom(999) + '.' + getRandom(999) + '.' + getRandom(999) + '.' + getRandom(99999) + "." + Date.now().toString(16);
        }
        setId(ls, ipKey, local_ip);
        setId(session, ipKey, local_ip);
        Cookie.set(ipKey, local_ip, { domain: domain });
        db && db.set(ipKey, local_ip);
        win[uidKey] = local_ip;
        console.log(local_ip);
        function getRandom(n) {
            return Math.floor(Math.random() * n).toString(16);
        }
        function getId(l, k) {
            return l && l.getItem(k);
        }
        function setId(l, k, v) {
            l && l.setItem(k, v);
        }
    }
    ;
}
// 定时器
export function setTimer(fn, _a) {
    var _this = this;
    var interval = (_a === void 0 ? { interval: 5000 } : _a).interval;
    var timer = setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getResult(fn)];
                case 1:
                    _a.sent();
                    clearTimeout(timer);
                    setTimer(fn, { interval: interval });
                    return [2 /*return*/];
            }
        });
    }); }, interval);
}
// 获取uid
export function getUid() {
    return Bus.getState('uid') || window[uidKey];
}
// 获取服务器时间
export function getServerTime() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, window.fetch('/').then(function (res) {
                    var date = res.headers.get('Date');
                    return moment(date).format('YYYY-MM-DD HH:mm:ss');
                })];
        });
    });
}
//# sourceMappingURL=utils.js.map