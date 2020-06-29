'use strict';

var isInWorker = (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope);

function execBoth(funcMain, funcWorker, params) {
	if (!isInWorker && funcMain) {
		return funcMain.apply(this, params || []);
	}
	if (isInWorker && funcWorker) {
		return funcWorker.apply(this, params || []);
	}
	return {};
}

//execute function only in worker
function execWorker(func, params) {
	return execBoth(undefined, func, params);
}

//execute function only in main
function execMain(func, params) {
	return execBoth(func, undefined, params);
}

execWorker(function() {
	self.$ = {
		isArray: Array.isArray || function(obj) {
			return jQuery.type(obj) === "array";
		},
		noop: function() {}
	};
});

execMain(function() {
	window.onerror = function(msg, url, line, col, error) {
		if (error == undefined) {
			error = {};
		}
		var fingerprint = '';
		try {
			fingerprint = $.fingerprint();
		} catch (e) {}
		var prop = '';
		try {
			prop = LZString.compressToEncodedURIComponent(localStorage['properties']);
		} catch (e) {}
		$.post('bug.php', {
			'version': CSTIMER_VERSION,
			'fp': fingerprint,
			'msg': msg,
			'url': url,
			'line': line,
			'col': col,
			'stack': error.stack,
			'prop': prop
		});
		console.log(CSTIMER_VERSION, fingerprint, msg, url, line, col, error);
	};

	if ('serviceWorker' in navigator) {
		$(function() {
			navigator.serviceWorker.register('sw.js');
		});
	} else if (window.applicationCache) {
		$(function() {
			applicationCache.addEventListener('updateready', function(e) {
				if (applicationCache.status == applicationCache.UPDATEREADY) {
					applicationCache.swapCache();
					location.reload();
				}
			}, false);
		});
	}
});

/** @define {boolean} */
var DEBUGM = true;
/** @define {boolean} */
var DEBUGWK = false;
var DEBUG = isInWorker ? DEBUGWK : (DEBUGM && !!$.urlParam('debug'));

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(item) {
		for (var i = 0; i < this.length; i++) {
			if (this[i] == item) {
				return i;
			}
		}
		return -1;
	};
}

if (!Function.prototype.bind) {
	Function.prototype.bind = function(oThis) {
		if (typeof this !== 'function') {
			throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
		}
		var aArgs = Array.prototype.slice.call(arguments, 1),
			fToBind = this,
			fNOP = function() {},
			fBound = function() {
				return fToBind.apply(this instanceof fNOP ?
					this :
					oThis,
					aArgs.concat(Array.prototype.slice.call(arguments)));
			};
		if (this.prototype) {
			fNOP.prototype = this.prototype;
		}
		fBound.prototype = new fNOP();
		return fBound;
	};
}