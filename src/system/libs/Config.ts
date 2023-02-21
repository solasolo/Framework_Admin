export default {
    Set(key: string, value: string, ) {
        localStorage.setItem(key, value);
    },

    Get(key: string, defvalue?: string) {
        let ret = localStorage.getItem(key);

        if (ret == null) {
            ret = defvalue;
        }

        return ret;
    },
};
