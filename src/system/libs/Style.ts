export function MakeStyle(styles: any[]) {
    let ret: any = {};

    for (let s of styles) {
        if (s) {
            for (let k of Object.keys(s)) {
                if (s[k] != null) {
                    ret[k] = s[k];
                }
            }
        }
    }

    return ret;
};
