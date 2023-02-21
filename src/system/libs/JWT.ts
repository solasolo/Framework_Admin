import Base64 from './Base64';
import UTF8 from './UTF8';

const KEY_TOKEN = "JWT_TOKEN";

function Decode(s: string) {
    var json = UTF8.Encode(Base64.Decode(s));

    return JSON.parse(json);
}

function getToken() {
    return localStorage.getItem(KEY_TOKEN);
}

export default {
    Check() {
        var ret = false;
        let token = getToken();

        if (token) {
            var parts = token.split('.');
            if (parts.length == 3) {
                var head = Decode(parts[0]);
                ret = head.ExpireTime > (new Date()).valueOf();
            }
        }

        return ret;
    },

    Info() {
        let ret = {};
        let token = getToken();

        if (token) {
            let parts = token.split('.');
            if (parts.length == 3) {
                ret = Decode(parts[1]);
            }
        }

        return ret;
    },

    Keep(token: string) {
        localStorage.setItem(KEY_TOKEN, token);
    },

    Clean() {
        localStorage.setItem(KEY_TOKEN, undefined);
    }
};
