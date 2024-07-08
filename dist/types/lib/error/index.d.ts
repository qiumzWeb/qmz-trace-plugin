export default class TraceError {
    options: {
        send: any;
        uid: any;
    };
    constructor(opt: any);
    onLoad(callback: any): () => void;
    watchScriptError(): void;
    watchFetchError(): void;
    watchXHRError(): void;
    watchPromiseError(): void;
}
//# sourceMappingURL=index.d.ts.map