declare interface REST {
    Get(res: string, id?: string | object, opts?: object): Promise<any>;
    Update(res: string, data: any): Promise<void>;
    New(res: string, data: any): Promise<void>;
    Delete(res: string, id: string): Promise<any>;
}

declare interface RPC {
    Call(func: string, params?: any | any[]): Promise<any>;
}

declare interface Ajax {
    Send(method: string, data: any): Promise<any>;
}

declare interface Form {
    Get(node: any, data?: any): any;
    Set(node: any, data: any): void;
    Clean(node: any): void;
    Validate(node: any, res: any): boolean;
}

declare interface Table {
    Export(node: any): any;
}

declare interface FileLoader {
    Upload(url: string, files: any[]): Promise<any>;
    Download(url: string, data: any, file: string): void;
}

declare interface Api {
    REST: REST;
    RPC: RPC;
    Ajax: Ajax;
    FileLoader: FileLoader;
    Request(url: string, data?: any): Promise<any>;
    Config(opts: any): void;

    Form: Form;
    Table: Table;
}

declare interface Url {
    
}

declare var Api: Api;