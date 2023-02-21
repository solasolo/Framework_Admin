function DetectIE8() {
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf('MSIE 8');

    return (msie > 0);
}

if (DetectIE8()) {
    Utils = {
        AddEventHandler: function (obj, event, func) {
            if ("on" + event in obj) {
                obj.attachEvent("on" + event, func);
            }
        },
    };
}