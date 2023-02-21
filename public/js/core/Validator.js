define(function (require, exports, module) {
    var Verification = {
        // 身份证
        Identity: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|[xX])$/,
        Mobile: /^((1[3|4|5|7|8][0-9]{1})+\d{8})$/,
        Email: /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
        Phone: /^0\d{2,3}-?\d{7,8}$/,
        Number: /^[0-9]*$/,
        Double: /^(-?\d+)(\.\d+)?$/,

        // 非零正整数
        NZ_number: /^\+?[1-9][0-9]*$/,
        // 非零负整数
        _NZ_number: /^\-[1-9][0-9]*$/,
        // 非负整数（正整数 + 0）
        _noIntNumber: /^\d+$/,
        // 非正整数（负整数 + 0）
        noIntNumber: /^((-\d+)|(0+))$/,
        // 整数
        intNumber: /^-?\d+$/,
        // 正浮点小数
        Float: /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/,
        // 非正浮点小数（负浮点小数 + 0）
        _noDoubleNum: /^((-\d+(\.\d+)?)|(0+(\.0+)?))$/,
        // 负浮点小数
        _doubleNumber: /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/,

    };

    var SIMPLE_PATTERN = /^(\w+)(\?)?([(.+)])?$/;

    var Checker = {
        isNotNull: function (source) {
            if (source != null && source != undefined && source != 'undefined' && source != "")
                return true;
            return false;
        },
        isNotNullTrim: function (source) {
            if (source != null && source != undefined && source != 'undefined' && $.trim(source) != "")
                return true;
            return false;
        },
        /**
         * 验证字符串最大长度【注：一个汉字的长度为2】
         * @param source 字符串
         * @param num 指定的长度
         */
        textMaxVer: function (source, num) {
            if (source.replace(/[^\x00-\xff]/g, "**").length <= num)
                return true;
            return false;
        },
        /**
         * 验证字符串最小长度【注：一个汉字的长度为2】
         * @param source 字符串
         * @param num 指定的长度
         */
        textMinVer: function (source, num) {
            if (source.replace(/[^\x00-\xff]/g, "**").length >= num)
                return true;
            return false;
        },
    };

    function ParseRule(rule) {
        var ret = null;
        var parts = rule.match(SIMPLE_PATTERN);

        if (parts) {
            ret = {};
            ret.type = parts[1];
            ret.require = (parts[2] !== '?');

            if (parts[4]) {
                var arr = parts[4].split(',');
                var len = arr.length;

                if (len == 1) {
                    ret.length = arr[0];
                } else if (len === 2) {
                    ret.range = arr;
                }
            }
        }

        return ret;
    }

    function LengthCheck(r, v) {
        var ret = true;

        if (r.length) {
            ret = (r.length >= v.length);
        }

        return ret;
    }

    function TypeCheck(r, v) {
        var ret = true;

        var func = Checker['Is' + r.type];
        var veri = Verification[r.type];

        if (func) {
            ret = func(v);
        } else if (veri) {
            ret = veri.test(v);
        }

        return ret;
    }

    module.exports = {
        Check: function (rule, value) {
            var err = null;
            var r = ParseRule(rule);

            if (r) {
                value = value.trim();

                if (value == '' || value == null) {
                    if (r.require) {
                        err = "require";
                    }
                } else {
                    if (!err && !LengthCheck(r, value)) {
                        err = "length";
                    }

                    if (!err && !TypeCheck(r, value)) {
                        err = 'format';
                    }
                }
            }

            return err;
        }
    };
});