import { getResult, IndexDBStore, Cookie, Bus } from 'qmz-utils';
import { localCacheName } from './config';
import moment from 'moment';

// 本地缓存
 /* tslint:disable */
export const localStore = IndexDBStore(localCacheName);

export const uidKey = 'qtrace-uid';

// 注册设备ID
export function setIpAdress(domain = location.hostname) {
  var ipKey = uidKey;
  var win = window as any;
  var db = win.indexedDB && localStore;
  if (db) {
    db.get(ipKey).then(function(id){
      getDeviceId(id, Cookie, localStorage, sessionStorage);
    })
  } else {
    getDeviceId(null, Cookie, localStorage, sessionStorage);
  }
  function getDeviceId (dbId:any, Cookie:any, ls:any, session:any){
    var local_ip = dbId || getId(ls,ipKey) || getId(session, ipKey) || Cookie.get(ipKey);
    if (!local_ip) {
      local_ip = getRandom(999) + "." + getRandom(999) + '.' + getRandom(999) + '.' + getRandom(999) + '.' + getRandom(99999) + "." + Date.now().toString(16);
    }
    setId(ls,ipKey, local_ip);
    setId(session, ipKey, local_ip);
    Cookie.set(ipKey, local_ip, {domain});
    db && db.set(ipKey, local_ip)
    win[uidKey] = local_ip;
    console.log(local_ip)
    function getRandom(n:number){
      return Math.floor(Math.random() * n).toString(16);
    }
    function getId(l:any, k:any) {
      return l && l.getItem(k);
    }
    function setId(l:any, k:any, v:any) {
      l && l.setItem(k, v);
    }
  };
}

// 定时器
export function setTimer (fn:any, {interval} = {interval: 5000}) {
  let timer = setTimeout(async () => {
    await getResult(fn);
    clearTimeout(timer);
    setTimer(fn, {interval});
  }, interval)
}

// 获取uid
export function getUid ():any {
  return Bus.getState('uid') || window[uidKey];
}

// 获取服务器时间
export async function getServerTime () {
  return window.fetch('/').then(res => {
    const date = res.headers.get('Date');
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  })
}
