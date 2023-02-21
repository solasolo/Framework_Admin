import UTF8 from "./UTF8";

class CommBuffer {
    Head: number;
    BufferChain: ArrayBuffer[]

    constructor() {
        this.Head = 0;
        this.BufferChain = [];
    }

    public Push(buf: ArrayBuffer) {
        this.BufferChain.push(buf);
    }

    public Scan(ch: number) {
        let ret = -1;

        let pos = this.Head;

        for (let buf of this.BufferChain) {
            let u8 = new Uint8Array(buf);

            let ind = u8.indexOf(ch);
            if (ind < 0) {
                pos += u8.length;
            } else {
                ret = pos + ind;
                break;
            }
        }

        if (ret >= 0) ret -= this.Head;

        return ret;
    }

    public PickString(len: number) {
        let bytes = this.PickData(len);

        return UTF8.Encode(bytes);
    }

    public Pick(len: number) {
        let remain = len;
        let start = this.Head;

        while (this.BufferChain.length > 0 && remain > 0) {
            let buf = this.BufferChain[0];

            let size = buf.byteLength;
            if (remain >= (size - start)) {
                this.BufferChain.shift();

                remain -= (size - start);
                start = 0;
                this.Head = 0;
            } else {
                this.Head += remain;
                remain = 0;
            }
        }
    }

    private PickData(len: number) {
        let ret = new Uint8Array(len);
        let remain = len;
        let start = this.Head;

        while (this.BufferChain.length > 0 && remain > 0) {
            let buf = this.BufferChain[0];

            let size = buf.byteLength;
            if (remain >= (size - start)) {
                let u8 = new Uint8Array(buf, start);
                ret.set(u8, len - remain)

                this.BufferChain.shift();

                remain -= (size - start);
                this.Head = 0;
                start = 0;
            } else {
                let u8 = new Uint8Array(buf, start, remain);
                ret.set(u8, len - remain)

                this.Head += remain;
                remain = 0;
            }
        }

        return ret;
    }
}

class FrameWSClient {
    Socket: WebSocket;
    Buffer: CommBuffer;

    constructor(url: string, opts: any) {
        this.Buffer = new CommBuffer();

        this.Start(url);
    }

    public setHandler() {
    }


    public Send(data: any) {

    }

    public Close() {
        if (this.Socket) this.Socket.close();
    }

    private Start(url: string) {
        this.Socket = new WebSocket(url);
        this.Socket.binaryType = "arraybuffer";

        this.Socket.onmessage = (e) => {
            let data = e.data;
            this.Buffer.Push(data);

            //console.log(data);

            let msg = null;
            while (true) {
                msg = this.Parse();

                if (!msg) break;

                console.log(msg);
            }
        }

        this.Socket.onopen = () => {
            console.log(`WebSocket Connected to ${url}`);
        }

        this.Socket.onclose = (e: CloseEvent) => {
            console.log(`WebSocket Disconect to ${url}`);
        }
    }

    private Parse(): any {
        let ret;

        let len = this.Buffer.Scan(10);
        if (len > 0) {
            ret = this.Buffer.PickString(len);
            this.Buffer.Pick(1);
        } else {
            ret = null;
        }

        return ret;
    }
}

type WSHandler = (obj: any) => void;

class WSClient {
    Socket: WebSocket;
    HandleMap: Map<number, Set<WSHandler>>;

    constructor(url: string, opts: any) {
        this.HandleMap = new Map();
        this.Start(url);
    }

    public Regist(code: number, handle: WSHandler) {
        let HandlerList;

        if (this.HandleMap.has(code)) {
            HandlerList = this.HandleMap.get(code);
        }
        else {
            HandlerList = new Set<WSHandler>();
            this.HandleMap.set(code, HandlerList);
        }

        HandlerList.add(handle);
    }

    public UnRegist(code: number, handle: WSHandler) {
        if (this.HandleMap.has(code)) {
            let HandlerList = this.HandleMap.get(code);
            if (HandlerList) {
                HandlerList.delete(handle);
            }
        }
    }

    public Send(data: any) {
        this.Socket.send(JSON.stringify(data));
    }

    public Close() {
        if (this.Socket) this.Socket.close();
    }

    private Start(url: string) {
        this.Socket = new WebSocket(url);
        this.Socket.binaryType = "arraybuffer";

        this.Socket.onmessage = (e) => {
            let msg = e.data;
            let [code, data] = this.Parse(msg);

            if (this.HandleMap.has(code)) {
                let HandlerList = this.HandleMap.get(code);
                if (HandlerList) {
                    for (let handle of HandlerList) {
                        handle(data);
                    }
                }
            }

            // console.log(data[0], data[1]);
        }

        this.Socket.onopen = () => {
            console.log(`WebSocket Connected to ${url}`);
        }

        this.Socket.onclose = (e: CloseEvent) => {
            console.log(`WebSocket Disconect to ${url}`);
        }
    }

    private Parse(msg: ArrayBuffer) {
        let CodeView = new DataView(msg);
        let Code = CodeView.getUint32(0, true);

        let DataBUffer = new Uint8Array(msg, 4)
        let json = UTF8.Encode(DataBUffer);
        let Data = JSON.parse(json);

        return [Code, Data];
    }
}

export default WSClient;
