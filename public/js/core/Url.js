define(function (require, exports, module) {
    "use strict";

    var FULL_REGEX = /^((\w+):\/\/)?((\w+):?(\w+)?@)?([^\/\?:]+):?(\d+)?(\/?[^\?#]+)?\??([^#]+)?#?(\w*)/;

    var Fields = {
        'Username': 4,
        'Password': 5,
        'Port': 7,
        'Protocol': 2,
        'Host': 6,
        'Path': 8,
        'Querystring': 9,
        'Fragment': 10
    };

    var QueryRegex = function (key) {
        return new RegExp("(^|&)" + key + "=([^&]*)(&|$)", "i");
    };

    function SetPart(key, value) {
        this[key] = value;
    }

    function Parse() {
        var r = FULL_REGEX.exec(this.Url);
        if (!r) {
            throw "DPURLParser::_parse -> Invalid URL";
        }

        for (var f in Fields) {
            if (typeof r[Fields[f]] !== 'undefined') {
                SetPart.call(this, f, r[Fields[f]]);
            }
        }
    }

    function ParseDomain() {
        var host = this.Host;
        this.Domain = host;
        var pos = host.lastIndexOf('.');
        if (pos > 0) {
            pos = host.lastIndexOf('.', pos - 1);
            if (pos > 0) {
                var pos2 = pos;
                pos = host.lastIndexOf('.', pos - 1);
                if (pos === -1) {
                    this.Domain = host.substring(pos2 + 1);
                }
            }
        }
    }

    function ParseParams() {
        var query = this.Querystring;
        var pairs = query.split("&");
        for (var i = 0; i < pairs.length; i++) {
            var pos = pairs[i].indexOf('='); // look for "name=value"                 
            if (pos === -1) {
                continue;
            }

            var name = pairs[i].substring(0, pos);
            var value = pairs[i].substring(pos + 1);
            value = decodeURIComponent(value);
            this.Params[name] = value;
        }
    }

    var URL = function (url) {
        this.Params = {};
        this.Url;
        this.Domain;
        if (url === undefined) {
            var loc = document.location;
            this.Url = loc.href;
            var protocol = loc.protocol || "http";
            SetPart.call(this, 'Protocol', protocol.replace(":", ""));
            SetPart.call(this, 'Host', loc.hostname);
            SetPart.call(this, 'Path', loc.pathname);
            SetPart.call(this, 'Port', loc.port);
            SetPart.call(this, 'Querystring', loc.search);
            SetPart.call(this, 'Hash', loc.hash ? loc.hash.slice(1) : "");
        } else {
            this.Url = url;
            Parse.call(this);
        }

        if (this.Querystring && this.Querystring.charAt(0) === "?") {
            this.Querystring = this.Querystring.substr(1);
        }
        ParseParams.call(this);
        ParseDomain.call(this);
    };

    URL.prototype.toString = function () {
        var ret = this.Protocol + "://" + this.Host;

        if (this['Port']) {
            ret += ":" + this.Port;
        }

        ret += this.Path;

        var q = [];
        for (var key in this.Params) {
            var value = this.Params[key];
            if (value && typeof value !== 'function') {
                q.push(key + "=" + encodeURIComponent(value));
            }
        }

        if (q.length > 0) {
            ret += "?" + q.join("&");
        }

        return ret;
    };

    URL.prototype.get = function (key) {
        return decodeURIComponent(this.Params[key]);
    };

    URL.prototype.set = function (key, value) {
        if (key) {
            this.Params[key] = encodeURIComponent(value);
        }

        return this;
    };

    module.exports = URL;
});