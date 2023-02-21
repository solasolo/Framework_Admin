
declare interface REST {
    Get(res: string, id: string): Promise<any>;
    Update(res: string, data: any): Promise<void>;
    New(res: string, data: any): Promise<void>;
    Delete(res: string, id: string): Promise<any>;    
}

declare interface RPC {
    Call(func: string, params?: any|any[]): Promise<any>;
}

declare interface Ajax {
    Send(method: string, data: any): Promise<any>;    
}

declare interface Form {
    Get(obj: any, data?: any): any;
    Set(obj: any, data: any): void;
}

declare interface Api {
    REST: REST;
    RPC: RPC;
    Ajax: Ajax;
    Form: Form;
}

declare var Api: Api;