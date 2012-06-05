if (!window.HL) { var HL = {}; }

HL.AddStyleSheetElem = function (url) {
    document.write('<link rel="stylesheet" href="'+url+'">');
};

HL.AddScriptElem = function (url) {
    document.write('<script type="text/javascript" src="'+url+'"></script>');
};

HL.AddRJSScriptElem = function (url, rlsUrl) {
    document.write('<script data-main="'+url+'" src="'+rlsUrl+'"></script>');
};