// Cookie interface
// ----------------
// See <https://developer.mozilla.org/en/DOM/document.cookie>
// return {Object} `docCookies` - interface: getItem, setItem, removeItem, hasItem

define(function () {

    var docCookies = {
        getItem: function (sKey) {
            var data;
            if (!sKey || !this.hasItem(sKey)) { return null; }
            data = unescape(document.cookie.replace(new RegExp("(?:^|.*;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=\\s*((?:[^;](?!;))*[^;]?).*"), "$1"));
            return (!this.isExpired(data)) ? data : null;
        },

        // `docCookies.setItem(sKey, sValue, vEnd, sPath, sDomain, bSecure)`
        //
        // Param {String} `sKey`: the name of the cookie  
        // Param {String} `sValue`: the value of the cookie  
        // 
        // Optional Param {Number, String, Date Object or null} `vEnd`: 
        //   the max-age in seconds (e.g., 31536e3 for a year) or the expires date in 
        //   GMTString format or in Date Object format; if not specified it will expire at the end of session;  
        // Optional Param {String or null} `sPath`: e.g., "/", "/mydir"; if not specified, defaults to the 
        //   current path of the current document location;  
        // Optional Param {String or null} `sDomain`: e.g., "example.com", ".example.com" (includes all subdomains) or
        //   "subdomain.example.com"; if not specified, defaults to the host portion of the current document location;  
        // Optional Param {Boolean or null} `bSecure`: cookie will be transmitted only over secure protocol as https;
        //
        // Return undefined;
        setItem: function (sKey, sValue, vEnd, sPath, sDomain, bSecure) {
            if (!sKey || /^(?:expires|max\-age|path|domain|secure)$/.test(sKey)) { return; }
            var sExpires = "";
            if (vEnd) {
                switch (typeof vEnd) {
                    case "number": sExpires = "; max-age=" + vEnd; break;
                    case "string": sExpires = "; expires=" + vEnd; break;
                    case "object": if (vEnd.hasOwnProperty("toGMTString")) { sExpires = "; expires=" + vEnd.toGMTString(); } break;
                }
            }
            document.cookie = escape(sKey) + "=" + escape(sValue) + sExpires + (sDomain ? "; domain=" + sDomain : "") + (sPath ? "; path=" + sPath : "") + (bSecure ? "; secure" : "");
        },
        removeItem: function (sKey) {
            if (!sKey || !this.hasItem(sKey)) { return; }
            var oExpDate = new Date();
            oExpDate.setDate(oExpDate.getDate() - 1);
            document.cookie = escape(sKey) + "=; expires=" + oExpDate.toGMTString() + "; path=/";
        },
        hasItem: function (sKey) { return (new RegExp("(?:^|;\\s*)" + escape(sKey).replace(/[\-\.\+\*]/g, "\\$&") + "\\s*\\=")).test(document.cookie); },
        isExpired: function (val) {
            var parsed = JSON.parse(val);
            return (parsed.expires) ? (new Date(parsed.expires).valueOf() < Date.now().valueOf()) : false;
        }
    };

    return docCookies;
});