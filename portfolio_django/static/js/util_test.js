var keysEnabled = false;

Number.prototype.clamp = function(min, max) {
    return Math.min(Math.max(this, min), max);
};

Array.prototype.insert = function (index, item) {
  this.splice(index, 0, item);
};

if(!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(what, i) {
        i = i || 0;
        var L = this.length;
        while (i < L) {
            if(this[i] === what) return i;
            ++i;
        }
        return -1;
    };
}

Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
};

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

function setupAjax() {
    $.ajaxSetup({
	    crossDomain: false, // obviates need for sameOrigin test
	    beforeSend: function(xhr, settings) {
            if (!csrfSafeMethod(settings.type)) {
		        xhr.setRequestHeader("X-CSRFToken", csrftoken);
            }
	    }
    });
}

function removeSquare(arr, stride, x, y, w, h) {
    for(var i=y;i<y+h;i+=1) {
	    for(var j=x;j<x+w;j+=1) {
	        if(i*stride+j < arr.length)
		        arr[i*stride+j].active = false;
	    }
    }
}

function arrayRand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

String.prototype.size = function(font) {
    var f = font || '12px arial';
    var o = $('<div>'+this+'</div>')
	    .css({'position': 'absolute', 'float': 'left', 'white-space': 'nowrap', 'visibility': 'hidden', 'font': f})
        .appendTo($('body'));
    var w = o.width();
    var h = o.height();

    return [w, h];
}

$(function() {
    window.keydown = {};
    window.keydownFns = {};

    function keyName(event) {
	    return jQuery.hotkeys.specialKeys[event.which] ||
	        String.fromCharCode(event.which).toLowerCase();
    }

    $(document).bind("keydown", function(event) {
	    var key = keyName(event);
	    keydown[key] = true;
	    if(keydownFns[key]) keydownFns[key]();
	    if(!keysEnabled && (keydown.left || keydown.right || keydown.up || keydown.down || keydown.space)) {
	        event.preventDefault();
	        return false;
	    }
    });

    $(document).bind("keyup", function(event) {
	    keydown[keyName(event)] = false;
    });
});
