
const keyhandler = {
  fns: {},

  Control() {
    return keyhandler.ShiftLeft || keyhandler.ShiftRight;
  },

  Shift() {
    return keyhandler.ControlLeft || keyhandler.ControlRight;
  },

  keydownHandler(event) {
    const key = event.code;
    keyhandler[key] = true;

    if(keyhandler.fns[key]) {
      keyhandler.fns[key]();
    }
    if(keyhandler.ArrowLeft || keyhandler.ArrowRight || keyhandler.ArrowUp || keyhandler.ArrowDown || keyhandler.Space) {
      event.preventDefault();
      return false;
    }
    return true;
  },

  keyupHandler(event) {
    keyhandler[event.code] = false;
  },

  start() {
    document.addEventListener('keydown', this.keydownHandler, true);
    document.addEventListener('keyup', this.keyupHandler, true);
  },
  stop() {
    document.removeEventListener('keydown', this.keydownHandler, true);
    document.removeEventListener('keyup', this.keyupHandler, true);
  },
};

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}

function textSize(str, font) {
  const f = font || '12px arial';
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  div.style.position = 'absolute';
  div.style.float = 'left';
  div.style.whiteSpace = 'nowrap';
  div.style.visibility = 'hidden';
  div.style.font = f;
  document.body.appendChild(div);
  const w = div.offsetWidth;
  const h = div.offsetHeight;
  document.body.removeChild(div);

  return [w, h];
}

/*
function csrfSafeMethod(method) {
  // these HTTP methods do not require CSRF protection
  return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}

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
  const http = new XMLHttpRequest();
  http.open('POST', url, true);
  http.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
  http.onreadystatechange = () => {
    if(http.readyState === 4 && callback !== null) {
      callback(http);
    }
  };
  http.send(JSON.stringify(data));
}

function removeSquare(arr, stride, x, y, w, h) {
  for(let i = y; i < y + h; i += 1) {
    for(let j = x; j < x + w; j += 1) {
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
  let curleft = 0;
  let curtop = 0;
  let curObj = obj;
  if(curObj.offsetParent) {
    do {
      curleft += curObj.offsetLeft;
      curtop += curObj.offsetTop;
      curObj = curObj.offsetParent;
    } while(curObj);
    return { x: curleft, y: curtop };
  }
  return undefined;
}

function withId(id) {
  return document.getElementById(id);
}

export {
  arrayRand,
  removeSquare,
  clamp,
  escapeHtml,
  keyhandler,
  findPos,
  withId,
  textSize,
  post,
};
