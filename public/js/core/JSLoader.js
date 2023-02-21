(function () {
    let global = window;

    let UrlBase = "";
    let Ver = "";
    let ModuleCache = {};

    function CreatePromise() {
        var callback;

        let promise = new Promise(function (resolve, reject) {
            callback = function (err, data) {
                if (err)
                    reject(err);
                else
                    resolve(data);
            };
        });

        return [promise, callback];
    }

    function ParseModule(module) {
        let absolute =  module[0] == '/' || module.slice(0, 7) === 'http://' || module.slice(0, 8) === 'https://';

        let FullPath = absolute ? module : UrlBase + module;

        return FullPath;
    }

    function GetModuleDepends(func) {
        let dep_modules = null;
        let script = func.toString();

        let dep_list = script.match(/require\((.+?)\)/g);
        if (dep_list) {
            dep_modules = dep_list.map(
                (req) => req.replace(/(^require\(['"])|(['"]\)$)/g, '')
            );
        }

        return dep_modules;
    }

    function Require(module) {
        let id = ParseModule(module);

        let ret = ModuleCache[id];

        return ret;
    }

    function Excute(id, func) {
        let module = {
            exports: {},
        };

        let exports = module.exports;

        func(Require, exports, module);
        let ret = module.exports;

        if (id) {
            ModuleCache[id] = ret;
        }

        return ret;
    }

    global.JSLoader = {
        Load(path) {
            let [promise, callback] = CreatePromise();

            let tag_head = document.getElementsByTagName('head').item(0);
            let tag_script = document.createElement("script");
            let id = ParseModule(path);

            let src = id + ".js" + (Ver ? "?v=" + Ver : "");

            tag_script.type = "text/javascript";
            tag_script.src = src;

            tag_script.info = {
                id: id,
                callback: callback,
                status: "padding",
            };

            tag_script.onload = () => {
                console.log(id, "loaded!");

                if (tag_script.info.status == "padding") {
                    callback();
                }
            };

            tag_head.appendChild(tag_script);

            return promise;
        },

        Config(opt) {
            UrlBase = opt.Base;
            Ver = opt.Ver;
        },
    };

    global.define = function (func) {
        let tag_script = document.currentScript;
        let info = tag_script.info;

        let id = info.id;
        let callback = info.callback;
        info.status = "runing";
        console.log(id, "runing!");

        function Fine() {
            let ret = Excute(id, func);
            info.status = "finished";
            console.log(id, "finished!");

            if (callback) callback(null, ret);
        }

        let dep_modules = GetModuleDepends(func);

        if (dep_modules) {
            let dep_promise = dep_modules.map(
                (module) => global.JSLoader.Load(module)
            );

            Promise.all(dep_promise).then(Fine);
        } else {
            Fine();
        }
    };

    global.use = function(module, fn) {
        var mod = Require(module);
        if(mod == undefined) {
            mod = global.JSLoader.Load(module).then((m) => {
                fn(m);
            });
        }
    };
})();