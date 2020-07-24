/**
 * @namespace FIREBASE
 */
var utf8 = utf8 || {};
var stringFromCharCode = String.fromCharCode;
utf8.toByteArray = function (str) {
	var i, j;
	var bytes = [];
	for (i = 0; i < str.length; i++) {
		if (str.charCodeAt(i) <= 0x7F) {
			bytes.push(str.charCodeAt(i));
		}
	}
	return emojiStringToArray(str);
};
var emojiStringToArray = function (str) {
	var save = [];
	split = str.split(/([\uD800-\uDBFF][\uDC00-\uDFFF])/);
	arr = [];
	for (var i = 0; i < split.length; i++) {
		char = split[i];
		if (char !== "") {
			if (char.search(/([\uD800-\uDBFF][\uDC00-\uDFFF])/) >= 0) { 
				var h = encodeURIComponent(char).substr(1).split('%');
				for (j = 0; j < h.length; j++) {
					save.push(parseInt(h[j], 16));
				}
			}
			else {
				for (let j = 0; j < char.length; j++) {
					if (char.charCodeAt(j) <= 0x7F) {
						save.push(char.charCodeAt(j));
					}else{
						var h = encodeURIComponent(char.charAt(j)).substr(1).split('%');
						for (let n = 0; n < h.length; n++) {
							save.push(parseInt(h[n], 16));
						}
					}		
				}
			}
		}
	}
	return save;
};

utf8.fromByteArray = function (bytes) {
	var i;
	var str = '';
	for (i = 0; i < bytes.length; i++) {
		if (bytes[i] <= 0x7F) {
			if (bytes[i] === 0x25) {
				str += "%25";
			} else {
				str += String.fromCharCode(bytes[i]);
			}
		} else {
			str += "%" + bytes[i].toString(16).toUpperCase();
		}
	}
	return decodeURIComponent(str);
};