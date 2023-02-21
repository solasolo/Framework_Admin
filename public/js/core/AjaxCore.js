global = window;

define(function (require, exports, module) {
    "use strict";

    var Utils = require('./Utils');

    function HiddenField(form, name, data) {
        var input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = JSON.stringify(data);

        form.appendChild(input);
    }

    //
    // Classes
    // 

    var Loader = {
        Load: function (element, callback) {
            var head = document.getElementsByTagName("head")[0];

            if (Browser.Type.ie) {
                element.onreadystatechange = function () {
                    if (!this.readyState || this.readyState === "loaded" || this.readyState === "complete") {
                        element.onreadystatechange = null;
                        callback();
                    }
                };
            } else if (Browser.Type.gecko) {
                element.onload = function () {
                    element.onload = null;
                    callback();
                };
            } else {
                callback();
            }

            head.appendChild(element);
        },

        LoadCss: function (url, callback) {
            var cssNode = Utils.CreateElement$("link");
            cssNode.setAttribute('type', 'text/css');
            cssNode.setAttribute('rel', 'stylesheet');
            cssNode.setAttribute('href', url);

            this.Load(cssNode, callback);
        },

        LoadScript: function (url, callback) {
            var scriptNode = Utils.CreateElement("script");
            scriptNode.setAttribute('charset', 'utf-8');
            scriptNode.setAttribute('type', 'text/javascript');
            scriptNode.setAttribute('src', url);

            this.Load(scriptNode, callback);
        },

        GetResourceType: function (url) {
            var ext = "";
            var pos = url.lastIndexOf('.');
            if (pos > -1) {
                ext = url.substring(pos + 1).toLowerCase();
            }

            return ext;
        },
    };

    var Handler = {
        Unauthorized: function () {

        },

        ApiError: function () {

        },

        GetToken: function () {
            return localStorage.getItem("JWT_TOKEN");
        },

        UploadProgress: function () {

        }
    };

    /********************************** Ajax **************************************/
    //
    //  Ajax Sets
    //.

    //
    // RESTFul
    //
    var RESTFul = {
        Get: function (url, callback) {
            return HTTPClient.JSONRequest(url, "GET", null, callback);
        },
        Post: function (url, data, callback) { // New
            return HTTPClient.JSONRequest(url, "POST", data, callback);
        },
        Put: function (url, data, callback) { // Update
            return HTTPClient.JSONRequest(url, "PUT", data, callback);
        },
        Delete: function (url, callback) {
            return HTTPClient.JSONRequest(url, "DELETE", null, callback);
        }
    };

    //
    // Ajax
    //
    var Ajax = {
        getJSON: function (url, data, context, callback) {
            if (data && Utils.isFunction(data)) {
                callback = data;
                data = null;
                context = null;
            } else if (context && Utils.isFunction(context)) {
                callback = context;
                context = null;
            }

            return HTTPClient.JSONRequest(url, "POST", data, callback);
        },

        getXml: function (url, data, callback) {
            if (data && data.call) {
                callback = data;
                data = null;
            }

            return HTTPClient.XMLRequest(url, "POST", data, callback);
        },

        getHtml: function (url, data, callback) {
            if (Utils.isFunction(data)) {
                callback = data;
                data = null;
            }

            return HTTPClient.HTMLRequest(url, "POST", data, callback);
        },

        XDA: function (url, data, callback) {
            Loader.XDA(url, data, callback);
        }
    };

    //
    // HTTPClient
    // 
    function HTTPClient(url, options) {
        this.URL = url;
        this.Http = null;
        this.Async = true;

        var opts = options || {};

        this.Method = opts.Method || "POST";
        this.RequestType = opts.RequestType || "json";
        this.Success = opts.Success;
        this.Error = opts.Error;

        this.Context = null; //Set excute option for response info.

        this.CreateHttpRequestObj();
    }

    //映射关系  input--accept    output--contentType
    HTTPClient.prototype.ProtocolType = {
        xml: {
            input: "application/xml, text/xml; charset=utf-8",
            output: "application/xml,text/xml"
        },
        form: {
            input: "application/x-www-form-urlencoded; charset=utf-8",
            output: "application/json"
        },
        json: {
            input: "application/json; charset=utf-8",
            output: "application/json"
        },
        html: {
            input: null,
            output: "text/html; charset=utf-8"
        },
        script: {
            input: null,
            output: "text/javascript,application/javascript;charset=utf-8"
        },
        file: {
            input: "multipart/form-data",
            output: "application/json"
        }
    };

    HTTPClient.prototype.CreateHttpRequestObj = function () {
        this.Http = new XMLHttpRequest();

        if (this.Http === null) {
            Utils.Debug("Your browser does not suppert AJAX.");
            return;
        }

        var me = this;

        function ProcessResponse() {
            var code = me.Http.status;
            var text = me.Http.responseText;

            switch (code) {
                case 200:
                    me.SuccessCallBack(text);
                    break;

                case 204:
                    me.SuccessCallBack(null);
                    break;

                default:
                    me.ErrorCallBack(code, text);
            }
        }

        if (this.Http.addEventListener) {
            Utils.AddEventHandler(this.Http, 'error', function () {
                console.log("error");
            });

            Utils.AddEventHandler(this.Http, 'timeout', function () {
                me.ErrorCallBack(999, 'Time OUt');
            });

            Utils.AddEventHandler(this.Http, 'progress', function () {

            });

            Utils.AddEventHandler(this.Http, 'load', ProcessResponse);
        } else {
            this.Http.onreadystatechange = function () {
                switch (me.Http.readyState) {
                    case 4:
                        ProcessResponse();
                        break;
                }
            };
        }
    };

    HTTPClient.prototype.DoRequest = function (data) {
        var Result = false;

        if (this.URL) {
            var url;

            try {
                url = this.RandomlizeUrl(this.URL);

                this.Http.open(this.Method, url, this.Async);

                if ((this.Method === "POST" || this.Method === "PUT")) {
                    this.Http.setRequestHeader("Content-Type", this.ProtocolType[this.RequestType].input);
                    //this.Http.setRequestHeader("Content-Length", Content ? Content.length : 0);
                } else {
                    data = null;
                }

                // JWT Token
                var token = Handler.GetToken();
                if (token) {
                    this.Http.setRequestHeader("Authorization", "Bearer " + token);
                }

                this.Http.setRequestHeader("Accept", this.ProtocolType[this.RequestType].output);

                this.Http.send(data);

                Result = true;
            } catch (e) {
                Utils.Debug("URL: " + url, e);
            }
        }

        return Result;
    };

    HTTPClient.prototype.DoUpload = function (data) {
        var Result = false;

        if (this.URL) {
            var url;

            try {
                url = this.URL;

                this.Http.open("POST", url, true);
                //this.Http.setRequestHeader("Content-Type", this.ProtocolType[this.RequestType].input);
                //this.Http.setRequestHeader("Accept", this.ProtocolType[this.RequestType].output);
                //this.Http.setRequestHeader("X-File-Name", file.name);
                //this.Http.setRequestHeader("X-File-Size", file.size);
                //this.Http.setRequestHeader("X-File-Type", file.type);

                this.Http.send(data);

                Result = true;
            } catch (e) {
                Utils.Debug("URL: " + url, e);
            }
        }

        return Result;
    };

    HTTPClient.prototype.RandomlizeUrl = function (url) {
        var new_url = url;
        /*
         if (new_url.indexOf("?") > 0) {
         new_url += "&xxx=" + Math.random();
         } else {
         new_url += "?xxx=" + Math.random();
         }
         */

        return new_url;
    };


    HTTPClient.prototype.SuccessCallBack = function (response) {
        if (this.Success) {
            this.Success(response, this.Options);
        } else {
            Utils.Debug("Warning: From HttpRequest Success CallBack. Here should have an callback method.");
        }
    };

    HTTPClient.prototype.ErrorCallBack = function (error, text) {
        if (this.Error) {
            this.Error(error, text, this.Options);
        }

        Utils.Debug(error);
    };

    // Static Functions

    HTTPClient.CommonErrorHandle = function (code, text, callback) {
        var info;
        try{
            info = Utils.parseJSON(text);
        }
        catch(e)
        {
            Utils.Debug(e);
            info = text;
        }

        var err = {
            Code: code,
            Info: info
        };        
        
        switch (code) {
            case 400:
                if (Handler.ApiError) Handler.ApiError(info);
                break;
            
            case 401:
                if (Handler.Unauthorized) Handler.Unauthorized();
                break;
        }

        if (callback) {
            callback(err);
        }
    };

    HTTPClient.XDA = function (url, data, callback) {
        var d = new Date();
        var CallBackWrapName = "callback" + d.valueOf();
        global[CallBackWrapName] = callback;

        if (callback) {
            if (!data) {
                data = {};
            }
            data["callback"] = CallBackWrapName;
        }

        if (data) {
            url += (url.toString().indexOf("?") > -1) ? "&" : "?";
            url += Utils.MakeUrlParameters(data);
        }

        this.LoadScript(url, function () {
            global[CallBackWrapName] = null;
        });
    };

    HTTPClient.JSONRequest = function (url, method, data, callback) {
        var promise = null;

        if (callback === undefined) {
            var gen = Utils.MakePromise();
            promise = gen[0];
            callback = gen[1];
        }

        var rq = new HTTPClient(url, {
            Method: method,
            RequestType: "json",
            Success: function (text) {
                var data;

                try {
                    data = Utils.parseJSON(text);
                } catch (e) {
                    if (callback) {
                        callback(e);
                    }

                    Utils.Debug("JSON Parse error:", e, text);
                }

                if (callback) {
                    callback(null, data);
                }
            },
            Error: function (code, text) {
                HTTPClient.CommonErrorHandle(code, text, callback);
            },
        });

        var content = data === null ? "" : JSON.stringify(data);
        var ret = rq.DoRequest(content);

        return promise ? promise : ret;
    };

    HTTPClient.XMLRequest = function (url, method, data, callback) {
        if (data && data.call) {
            callback = data;
            data = null;
        }

        var rq = new HTTPClient(url, {
            Method: method,
            RequestType: "xml",
            Success: function (text) {
                var data;

                try {
                    data = Utils.parseXml(text);
                } catch (e) {
                    if (callback) {
                        callback(e, null);
                    }

                    Utils.Debug("Parser XML", e);
                }

                if (callback) {
                    callback(null, data);
                }
            },

            Error: function (code, text) {
                HTTPClient.CommonErrorHandle(code, text, callback);
            },
        });

        return rq.DoRequest(data);
    };

    HTTPClient.HTMLRequest = function (url, method, data, callback) {
        var rq = new HTTPClient(url, {
            RequestType: "html",
            Method: "POST",
            Success: function (text) {
                if (callback) {
                    callback(null, text);
                }
            },
            Error: function (code, text) {
                HTTPClient.CommonErrorHandle(code, text, callback);
            },
        });

        return rq.DoRequest(data);
    };

    HTTPClient.Upload = function (url, form, callback) {
        var rq = new HTTPClient(url, {
            Method: "POST",
            RequestType: "file",
            Success: function (text) {
                var data;

                try {
                    data = Utils.parseJSON(text);
                } catch (e) {
                    if (callback) {
                        callback(e);
                    }

                    Utils.Debug("JSON Parse error:", e, text);
                }

                if (callback) {
                    callback(null, data);
                }
            },
            Error: function (code, text) {
                HTTPClient.CommonErrorHandle(code, text, callback);
            },
        });

        var fd = new FormData();

        for (var k in form) {
            var field = form[k];
            if (field instanceof FileList) {
                var count = field.length;
                for (var i = 0; i < count; i++) {
                    var file = field[i];
                    var name = (count > 1) ? (k + i) : k;

                    fd.append(name, file);
                }
            } else {
                fd.append(k, field);
            }
        }

        rq.DoUpload(fd);
    };

    //
    // FileLoader
    //
    var FileLoader = {
        Upload: function (url, form, callback) {
            var promise = null;

            if (callback === undefined) {
                var gen = Utils.MakePromise();
                promise = gen[0];
                callback = gen[1];
            }

            var ret = HTTPClient.Upload(url, form, callback);

            return promise ? promise : ret;
        },

        Download: function (url, data, file) {
            var form = document.createElement("form");
            form.setAttribute("method", "post");
            form.setAttribute("action", url);
            form.setAttribute("target", "_blank");

            HiddenField(form, "file", file);
            HiddenField(form, "data", data);

            document.body.appendChild(form);

            form.submit();

            document.body.removeChild(form);
        },

        FileSize: function (file) {
            var fileSize = 0;

            if (file.size > 1024 * 1024) {
                fileSize = (Math.round(file.size * 100 / (1024 * 1024)) / 100).toString() + 'MB';
            } else {
                fileSize = (Math.round(file.size * 100 / 1024) / 100).toString() + 'KB';
            }

            return fileSize;
        },

        Preview: function (file) {
            var ImageElement;

            if (ImageElement && typeof FileReader !== "undefined" && (/image/i).test(file.type)) {
                var reader = new FileReader();

                Utils.AddEventHandler(reader, 'load', function (evt) {
                    ImageElement.src = evt.target.result;
                });

                reader.readAsDataURL(file);
            }
        },

        Progress: function (evt) {
            if (evt.lengthComputable) {
                var percentComplete = Math.round(evt.loaded * 100 / evt.total);
                if (Handler.UploadProgress) Handler.UploadProgress(percentComplete);
            }
        }
    };

    //
    // ResourceManager
    //
    function GetLoadedScritp() {
        var tags = document.getElementsByTagName("script");
        for (var i = 0, len = tags.length; i < len; i++) {
            var node = tags[i];
            var url = node.getAttribute("src");

            this.ResourceList.push(url);
        }
    }

    function GetLoadedCSS() {
        var tags = document.getElementsByTagName("link");
        for (var i = 0, len = tags.length; i < len; i++) {
            var node = tags[i];
            if (node.getAttribute("rel") === 'stylesheet') {
                var url = tags[i].getAttribute("href");
                this.ResourceList.push(url);
            }
        }
    }

    function ResourceManager() {
        this.ResourceList = [];

        GetLoadedScritp.call(this);
        GetLoadedCSS.call(this);
    }

    ResourceManager.prototype.HasLoaded = function (url) {
        var Result = false;

        if (this.ResourceList[url] !== undefined) {
            Result = true;
        } else {
            var ext = Loader.GetResourceType(url);

            var NodeName = ext === "js" ? "script" : "link";
            var RefName = ext === "js" ? "src" : "href";
            var nodes = document.getElementsByTagName(NodeName);
            for (var i = 0, len = nodes.length; i < len; i++) {
                if (nodes[i].getAttribute(RefName) === url) {
                    Result = true;
                    break;
                }
            }
        }

        return Result;
    };

    ResourceManager.prototype.Load = function (url, callback) {
        var func = function () {
            ResourceList[url] = {
                Status: 'Loaded'
            };
            if (callback) {
                callback();
            }
        };

        if (!this.HasLoaded(url)) {
            var ext = Loader.GetResourceType(url);
            var ResourceList = this.ResourceList;

            ext === "js" ? Loader.LoadScript(url, func) : Loader.LoadCss(this, url, func);
        } else {
            func();
        }
    };

    ResourceManager.prototype.InResourceList = function (url) {
        var Reslult = false;
        for (var i = 0; i < this.ResourceList.length; i++) {
            if (url === this.ResourceList[i]) {
                Reslult = true;
                break;
            }

            return Reslult;
        }
    };

    //
    //  Module
    //
    module.exports = {
        Ajax: Ajax,
        RESTFul: RESTFul,
        FileLoader: FileLoader,
        Handler: Handler,
    };
});