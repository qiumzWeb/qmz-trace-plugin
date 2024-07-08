
export default class TracePerf {

  options = {
    "name": "",
    "entryType":"navigation",
    "startTime":0,
    "duration":7461.700000047684,
    "initiatorType":"navigation",
    "nextHopProtocol":"http/1.1",
    "renderBlockingStatus":"non-blocking",
    "workerStart":0,
    "redirectStart":0,
    "redirectEnd":0,
    "fetchStart":6.5,
    "domainLookupStart":33.5,
    "domainLookupEnd":78.90000009536743,
    "connectStart":78.90000009536743,
    "secureConnectionStart":118.5,
    "connectEnd":182,
    "requestStart":182.5,
    "responseStart":287.7000000476837,
    "responseEnd":297.40000009536743,
    "transferSize":1500,
    "encodedBodySize":1200,
    "decodedBodySize":2716,
    "responseStatus":200,
    "serverTiming":[],
    "unloadEventStart":0,
    "unloadEventEnd":0,
    "domInteractive":614,
    "domContentLoadedEventStart":2481.2999999523163,
    "domContentLoadedEventEnd":2481.2999999523163,
    "domComplete":7452.799999952316,
    "loadEventStart":7453,
    "loadEventEnd":7461.700000047684,
    "type":"navigate",
    "redirectCount":0,
    "activationStart":0
  }

  constructor() {
    this.onLoad(this.getNavigationPerformance)
  }

  // 如果初始化插件时页面已经onload，直接获取performance并发送
  // 如果初始化插件时页面还没有onload，则等页面onload时再获取performance并发送
  onLoad(callback) {
    let timer;
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
  // 获取导航性能条目
  getNavigationPerformance() {
    const performanceEntries = window.performance.getEntriesByType('navigation');
    if (performanceEntries.length > 0) {
      const navigationEntry:any = performanceEntries[0];
      
      console.log('Navigation Timing:');
      console.log('  - Redirect Count:', navigationEntry.redirectCount);
      console.log('  - Transfer Size:', navigationEntry.transferSize);
      console.log('  - Server Connect Time:', navigationEntry.serverConnectEnd - navigationEntry.serverConnectStart);
      console.log('  - Domain Lookup Time:', navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart);
      console.log('  - Redirect Time:', navigationEntry.redirectEnd - navigationEntry.redirectStart);
      console.log('  - Appcache Time:', navigationEntry.appcacheEnd - navigationEntry.appcacheStart);
      console.log('  - DOM Parsing Time:', navigationEntry.domInteractive - navigationEntry.domComplete);
      console.log('  - DOM Content Loaded Time:', navigationEntry.domContentLoadedEventEnd - navigationEntry.domContentLoadedEventStart);
      console.log('  - Load Event Start:', navigationEntry.loadEventStart);
      console.log('  - Load Event End:', navigationEntry.loadEventEnd);
      console.log('  - Load Time:', navigationEntry.loadEventEnd - navigationEntry.startTime);
    } else {
      console.error('No navigation performance entries found.');
    }
  }
}