// Zepto 'type' plugin, ported from jQuery
// See: http://api.jquery.com/jQuery.type/

// Description: Determine the internal JavaScript [[Class]] of an object.

(function ($) {
	var class2type;

	// Populate the class2type map
	class2type = {
		"[object Boolean]":"boolean",
		"[object Number]":"number",
		"[object String]":"string",
		"[object Function]":"function",
		"[object Array]":"array",
		"[object Date]":"date",
		"[object RegExp]":"regexp",
		"[object Object]":"object"
	};
	// $.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
	// 	class2type[ "[object " + name + "]" ] = name.toLowerCase();
	// });

	// $.type( obj )
	// Param obj {Object} to get the internal JavaScript [[Class]] of.
	$.type = $.fn.type = function( obj ) {
		return obj == null ?
			String( obj ) :
			class2type[ toString.call(obj) ] || "object";
	};
}( Zepto || window.Zepto ));