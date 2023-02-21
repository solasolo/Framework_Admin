define(function (require, exports, module) {
    var Core = require('./AjaxCore');
    var Form = require('./Form');

    var RESTFul = Core.RESTFul;
    var Ajax = Core.Ajax;
    var FileLoader = Core.FileLoader;

    var BaseUrl = "";

    var Api = {
        REST_URL: '/api/',

        Get: function (res, data, callback) {
            var id = null;
            var opts = null;

            var data_type = typeof data;
            if (data_type === 'function') {
                callback = data;
            } else if (data_type === 'object') {
                opts = data;
            } else {
                id = data;
            }

            var url = BaseUrl + this.REST_URL + res;
            if(id) url += "/" + id;
            
            if(opts) {
                var params = Object.keys(opts).map(function(key) {
                    return key + "=" + encodeURIComponent(opts[key]);
                });

                url += "?" + params.join("&");
            }

            return RESTFul.Get(url, callback);
        },

        Update: function (res, data, callback) {
            var url = this.REST_URL + res;

            return RESTFul.Put(url, data, callback);
        },

        New: function (res, data, callback) {
            var url = this.REST_URL + res;

            return RESTFul.Post(url, data, callback);
        },

        Delete: function (res, id, callback) {
            var url = this.REST_URL + res + "/" + id;

            return RESTFul.Delete(url, callback);
        },

        FormUpdate: function (res, form) {
            var url = this.REST_URL + res + "/";

            form.action = url;
            form.method = "post";
            form.enctype = "multipart/form-data";
            form.submit();
        },

        Config: function(opt) {
            if(opt.BaseUrl) this.REST_URL = BaseUrl;
        }
    };

    var RPC = {
        RPC_URL: '/rpc/',

        Call: function (func, params, callback) {
            var url = BaseUrl + this.RPC_URL;

            if (typeof params === 'function') {
                callback = params;
                params = null;
            }

            if (params != null && !Array.isArray(params)) {
                params = [params];
            }

            var pos = func.lastIndexOf('/');
            if (pos > 0) {
                url += func.slice(0, pos) + "/";
                func = func.slice(pos + 1);
            }

            var data = {
                'Method': func,
                'Params': params
            };

            return Ajax.getJSON(url, data, null, callback);
        },
    };

    var ApiAjax = {
        APP_URL: '/app/',

        Send: function (method, data, callback) {
            var url = BaseUrl + this.APP_URL + method;

            return Ajax.getJSON(url, data, null, callback);
        },
    };

    var ApiFileLoader = {
        UPLOAD_URL: "/upload/",

        Upload: function (url, form, callback) {
            var req_url = BaseUrl + this.UPLOAD_URL + url;

            return FileLoader.Upload(req_url, form, callback);
        },

        Download: FileLoader.Download,
    };

    module.exports.Request = function(url, data, callback) {
        return Ajax.getJSON(url, data, null, callback);
    };

    module.exports.REST = module.exports.Api;
    module.exports.Form = Form;
    module.exports.Api = Api;
    module.exports.REST = Api;
    module.exports.Ajax = ApiAjax;
    module.exports.RPC = RPC;
    module.exports.FileLoader = ApiFileLoader;

    module.exports.Config = function (opts) {
        const handler = Core.Handler;

        BaseUrl = opts.BaseUrl || "";

        opts.Unauthorized && (handler.Unauthorized = opts.Unauthorized);
        opts.ApiError && (handler.ApiError = opts.ApiError);
        opts.ShowValidate && (Form.ShowValidate = opts.ShowValidate);

        opts.AppRoot && (ApiAjax.APP_URL = opts.AppRoot);
    };
});
