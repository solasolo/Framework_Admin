declare interface IColumnDefine {
    Title: string;
    Width?: string;
    Field?: string;
    Key?: string;
    Align?: "left" | "right" | "center";
    Text?(data: any): string;
    Render?(record: any, data?: any): any;
}