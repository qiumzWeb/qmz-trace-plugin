export default class TracePerf {
    options: {
        name: string;
        entryType: string;
        startTime: number;
        duration: number;
        initiatorType: string;
        nextHopProtocol: string;
        renderBlockingStatus: string;
        workerStart: number;
        redirectStart: number;
        redirectEnd: number;
        fetchStart: number;
        domainLookupStart: number;
        domainLookupEnd: number;
        connectStart: number;
        secureConnectionStart: number;
        connectEnd: number;
        requestStart: number;
        responseStart: number;
        responseEnd: number;
        transferSize: number;
        encodedBodySize: number;
        decodedBodySize: number;
        responseStatus: number;
        serverTiming: any[];
        unloadEventStart: number;
        unloadEventEnd: number;
        domInteractive: number;
        domContentLoadedEventStart: number;
        domContentLoadedEventEnd: number;
        domComplete: number;
        loadEventStart: number;
        loadEventEnd: number;
        type: string;
        redirectCount: number;
        activationStart: number;
    };
    constructor();
    onLoad(callback: any): () => void;
    getNavigationPerformance(): void;
}
//# sourceMappingURL=index.d.ts.map