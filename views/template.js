(function(){function template(it
/**/) {
var out='<html> <head></head> <body>';var arr1=it.tweets;if(arr1){var value,index=-1,l1=arr1.length-1;while(index<l1){value=arr1[index+=1];out+='<div>'+(value.text)+'!</div>';} } out+=' </body></html>';return out;
}var itself=template, _encodeHTML=(function (doNotSkipEncoded) {
		var encodeHTMLRules = { "&": "&#38;", "<": "&#60;", ">": "&#62;", '"': "&#34;", "'": "&#39;", "/": "&#47;" },
			matchHTML = doNotSkipEncoded ? /[&<>"'\/]/g : /&(?!#?\w+;)|<|>|"|'|\//g;
		return function(code) {
			return code ? code.toString().replace(matchHTML, function(m) {return encodeHTMLRules[m] || m;}) : "";
		};
	}());if(typeof module!=='undefined' && module.exports) module.exports=itself;else if(typeof define==='function')define(function(){return itself;});else {window.render=window.render||{};window.render['template']=itself;}}());