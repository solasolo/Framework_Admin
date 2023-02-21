export default {
    Link(route: string, query?: any) {
        let url = BASE_URL;

        if (query) {
            for (let key of Object.keys(query)) {
                url += `&${key}=${query[key]}`;
            }
        }

        url += "#" + route;

        return url;
    },

    Params() {
        let url = new Url();

        return url.Params;
    },

    IsPromise(val: any) {
        return (val && typeof val.then === 'function');
    },

    PromiseInvoke(func: any, args: any[], callback: any) {
        if (func) {
            let ret = func.apply(null, args);

            if (this.IsPromise(ret)) {
                ret.then((val: any) => {
                    callback(val);
                });
            } else {
                callback(ret);
            }
        } else {
            callback(undefined);
        }
    },

    Invoke(func: any, ...args: any[]) {
        return this.DefaultInvoke.apply(this, [undefined, func, ...args]);
    },

    DefaultInvoke(def: any, func: any, ...args: any[]) {
        let ret = def;

        if (func) {
            ret = func.apply(null, args);
        }

        return ret;
    },

    Sort(data: any, fields: string[]) {
        return data.sort((a: any, b: any) => {
            let ret = 0;

            function cp(p: string) {
                if (ret === 0) {
                    let k = p;
                    let v = 1;

                    if (p[0] === "~") {
                        k = p.slice(1);
                        v = -1;
                    }

                    if (a[k] != b[k]) {
                        ret = (a[k] > b[k]) ? v : -v;
                    }
                }
            }

            for (let p of fields) {
                cp(p);
            }

            return ret;
        });
    },
};