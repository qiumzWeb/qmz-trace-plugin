export default class PV {
    options: {
        send: any;
        time: number;
        uid: any;
    };
    constructor(opt: any);
    onLoad(callback: any): () => void;
    watchRouterChange(): void;
    updateCounter(): Promise<void>;
    uploadCounter(): void;
}
//# sourceMappingURL=index.d.ts.map