define(function (require, exports, module) {
    module.exports = {
        Set: function (name, value) {
            var Days = 30;
            var exp = new Date();

            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + "path=/";
        },

        Get: function (name) {
            var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

            var arr = document.cookie.match(reg);
            var ret = arr ? unescape(arr[2]) : null;

            return ret;
        },

        Delete: function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = this.Get(name);

            if (cval != null) {
                document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
            }
        }
    };
});