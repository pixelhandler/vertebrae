if (!window.PX) { var PX = {}; }

PX.AddStyleSheetElem = function (url) {
    document.write('<link rel="stylesheet" href="'+url+'">');
};

PX.AddScriptElem = function (url) {
    document.write('<script type="text/javascript" src="'+url+'"></script>');
};

PX.AddRJSScriptElem = function (url, rlsUrl) {
    document.write('<script data-main="'+url+'" src="'+rlsUrl+'"></script>');
};