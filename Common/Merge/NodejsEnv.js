if (typeof window === 'undefined') {
	//Run under nodejs
	/*var Canvas = require('canvas');
	var Image = Canvas['Image'];
	var jsdom = require('jsdom')['jsdom'];
	var document = jsdom();
	var window = document['createWindow']();
	var navigator = require('navigator');
	var XMLHttpRequest = require('xmlhttprequest').XMLHttpRequest;
	var $ = require('jQuery');
	var jq = require('jQuery').create();
	var jQuery = require('jQuery').create(window);*/
}
else {
	//Run under browser
	window.exports = window;
}

