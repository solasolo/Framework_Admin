export default {
    Decode: function (e: string) {
        var t = "";

        for (var n = 0; n < e.length; n++) {
            var r = e.charCodeAt(n);

            if (r < 128) {
                t += String.fromCharCode(r);
            } else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            } else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
            }
        }

        return t;
    },

    Encode: function (buf: Uint8Array) {
        let ret = "";

        var n = 0;
        while (n < buf.length) {
            let c1 = buf[n++];

            if (c1 < 128) {
                ret += String.fromCharCode(c1);
            } else {
                let c2 = buf[n++];

                if (c1 > 191 && c1 < 224) {
                    ret += String.fromCharCode((c1 & 31) << 6 | c2 & 63);
                } else {
                    let c3 = buf[n++];

                    ret += String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                }
            }
        }

        return ret;
    },
}