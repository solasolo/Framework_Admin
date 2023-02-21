const DICT_BASE64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

export default {
    Encode: function (e: Uint8Array): string {
        let t = "";
        let n, r, i, s, o, u, a;
        let f = 0;

        while (f < e.length) {
            n = e.at(f++);
            r = e.at(f++);
            i = e.at(f++);

            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;

            if (isNaN(r)) {
                u = a = 64;
            } else if (isNaN(i)) {
                a = 64;
            }

            t = t + DICT_BASE64.charAt(s) + DICT_BASE64.charAt(o) + DICT_BASE64.charAt(u) + DICT_BASE64.charAt(a);
        }

        return t;
    },

    Decode: function (s: string): Uint8Array {
        let str_len = s.length;

        let end = s.indexOf("=");
        if(end == -1) end = str_len;

        let bytes_len = Math.trunc(end * 3 / 4);
        let ret = new Uint8Array(bytes_len);

        let code_len = Math.ceil(str_len / 4) * 4;
        let codes = new Uint8Array(code_len);
        for(let i = 0; i < code_len; i++) {
            codes[i] = i < str_len ? DICT_BASE64.indexOf(s.charAt(i)) : 0;
        }

        let pc = 0;
        let pb = 0;

        let b = [0, 0, 0];
        while (pc < code_len) {
            b[0] = codes[pc] << 2 | codes[++pc] >> 4;
            b[1] = (codes[pc] & 15) << 4 | codes[++pc] >> 2;
            b[2] = (codes[pc] & 3) << 6 | codes[++pc];
            ++pc;

            for (let i = 0; i < 3; i++) {
                if(pb < bytes_len) ret[pb++] = b[i];
            }
        }

        return ret;
    },
}