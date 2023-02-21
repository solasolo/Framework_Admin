define(function (require, exports, module) {
    "use strict";

    var Utils = {
        AddEventHandler: function (obj, event, func) {
            obj.addEventListener(event, func);
        },

        CreateElement: function (tagName) {
            return document.createElement(tagName);
        },

        isFunction: function (obj) {
            return Object.prototype.toString.call(obj) === "[object Function]";
        },

        isUndefined: function (obj) {
            return typeof (obj) === "undefined";
        },

        isArray: function (obj) {
            return Array.isArray(obj);
        },

        parseJSON: function (data) {
            var ret = null;

            if (typeof data !== "string" || !data) return null;

            if (JSON && JSON.parse) {
                ret = JSON.parse(data);
            } else {
                if (/^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?/g, "]").replace(/(?:^|:|,)(?:\s*\[)+/g, ""))) {
                    ret = new Function("return " + data)();
                } else {
                    throw ("invalid json data: " + data);
                }
            }

            return ret;
        },

        parseXml: function (xmlStr) {
            var xmlDoc;
            try { //IE
                xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                xmlDoc.async = "false";
                xmlDoc.loadXML(xmlStr);
            } catch (e) {
                // Firefox, Mozilla, Opera, etc.
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(xmlStr, "text/xml");
            }
            return xmlDoc;
        },

        MakeUrlParameters: function (data) {
            var args = "";
            if (data) {
                for (var key in data) {
                    args = args + key + "=" + data[key] + "&";
                }
            }

            return args;
        },

        MakePromise: function () {
            var callback;

            var promise = new Promise(function (resolve, reject) {
                callback = function (err, data) {
                    if (err)
                        reject(err);
                    else
                        resolve(data);
                };
            });

            return [promise, callback];
        },

        Debug: function (str) {
            console.log(str);
        },
    };

    module.exports = Utils;
});
