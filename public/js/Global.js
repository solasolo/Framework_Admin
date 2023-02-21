define(function (require, exports, module) {
    const global = window;

    let Api = require('Api');
    global.Api = Api;
   
    Api.Form = require('Form');
    Api.Table = require('Table');

    const URL = require('Url');
    global.Url = URL;

    const url = new URL();
    let params = url.Params;
    global.BASE_DOMAIN_URL = url.Protocol + "://" + url.Host + (url.Port ? (":" + url.Port) : "");

    url.Params = {
        route: params.route,
        token: params.token,
    };
    global.BASE_URL = url.toString();

    global.Trim = function (s) {
        return s.toString().trim();
    };
});