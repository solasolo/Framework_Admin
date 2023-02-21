declare module "*.css";

declare class Url {
    Host: string;
    Domain: string;
    Params: any;
    Hash: string;
    Path: string;
    
    toString(): string;
}

declare interface IGlobal {
    Theme: string;
}

declare var Global: IGlobal;
declare var BASE_DOMAIN_URL: string;
declare var BASE_URL: string;

