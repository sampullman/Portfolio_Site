
var keyhandler = {
    fns: {},

    keydownHandler: function(event) {
        var key = event.code;
        keyhandler[key] = true;
        console.log(keyhandler[key]);
        if(keyhandler.fns[key]) keyhandler.fns[key]();
        if(keyhandler.ArrowLeft || keyhandler.ArrowRight || keyhandler.ArrowUp || keyhandler.ArrowDown || keyhandler.Space) {
            event.preventDefault();
            return false;
        }
    },

    keyupHandler: function(event) {
        keyhandler[event.code] = false;
    },

    start: function() {
        document.addEventListener('keydown', this.keydownHandler, true);
        document.addEventListener('keyup', this.keyupHandler, true);
    },
    stop: function() {
        document.removeEventListener('keydown', this.keydownHandler, true);
        document.removeEventListener('keyup', this.keyupHandler, true);
    }
};

export { arrayRand, removeSquare, clamp, escapeHtml, keyhandler, findPos, withId, textSize, post };

function clamp(n, min, max) {
    return Math.min(Math.max(n, min), max);
}

function escapeHtml(str) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
};

function textSize(str, font) {
    var f = font || '12px arial';
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    div.style.position = 'absolute';
    div.style.float = 'left';
    div.style.whiteSpace = 'nowrap';
    div.style.visibility = 'hidden';
    div.style.font = f;
    document.body.appendChild(div);
    var w = div.offsetWidth;
    var h = div.offsetHeight;
    document.body.removeChild(div);

    return [w, h];
}

/* eslint-disable no-unused-vars */
function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

/*
function setupAjax() {
    $.ajaxSetup({
        crossDomain: false, // obviates need for sameOrigin test
        beforeSend: function (xhr, settings) {
            if(!csrfSafeMethod(settings.type)) {
                xhr.setRequestHeader('X-CSRFToken', csrftoken);
            }
        }
    });
}
*/

function post(url, data, callback) {
    var http = new XMLHttpRequest();
    http.open('POST', url, true);
    http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    http.onreadystatechange = function() {
        if(http.readyState === 4 && callback !== null) {
            callback(http);
        }
    };
    http.send(JSON.stringify(data));
}

function removeSquare(arr, stride, x, y, w, h) {
    for(var i = y; i < y + h; i += 1) {
        for(var j = x; j < x + w; j += 1) {
            if(i * stride + j < arr.length) {
                arr[i * stride + j].active = false;
            }
        }
    }
}

function arrayRand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function findPos(obj) {
    var curleft = 0;
    var curtop = 0;
    if(obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
            obj = obj.offsetParent;
        } while(obj);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

function withId(id) {
    return document.getElementById(id);
}
