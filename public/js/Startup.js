let global = window;

let Loader = global.JSLoader;
let JSVersion = global.JSVersion = (new Date()).getMinutes();

global.BaseUrl = ParseBaseUrl();

function ParseBaseUrl() {
    let url = document.location.href;
    let start = url.lastIndexOf('#');

    let ret = url.substring(0, start);  
    
    let slash_pos = ret.lastIndexOf('#');
    if(slash_pos >= 0) ret = ret.substring(0, slash_pos);
    
    return ret; 
}

Loader.Config({
    Base: global.BaseUrl + "/public/js/core/",
    Ver: JSVersion,
});

Loader.Load(global.BaseUrl + '/public/js/Global').then(
    () => {
        Loader.Load(global.BaseUrl + '/dist/app');
    }
);