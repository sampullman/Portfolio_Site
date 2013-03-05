$(function() {

    function LoaderProxy() {
	return {
	    draw: $.noop,
	    fill: $.noop,
	    frame: $.noop,
	    update: $.noop,
	    width: null,
	    height: null
	};
    }

    function Sprite(image, width, height, sourceX, sourceY) {
	sourceX = sourceX || 0;
	sourceY = sourceY || 0;
	width = width || image.width;
	height = height || image.height;
	return {
	    draw: function(c, x, y, w, h) {
		c.drawImage(
		    image,
		    sourceX,
		    sourceY,
		    image.width,
		    image.height,
		    x,
		    y,
		    w || width,
		    h || height
		);
	    },
	    fill: function(c, x, y, width, height, repeat) {
		repeat = repeat || "repeat";
		var pattern = c.createPattern(image, repeat);
		c.fillColor(pattern);
		c.fillRect(x, y, width, height);
	    },
	    width: width,
	    height: height
	};
    };

    Sprite.load = function(url, w, h, loadedCallback) {
	var img = new Image();
	var proxy = LoaderProxy();

	img.onload = function() {
	    var tile = Sprite(this, w, h);

	    $.extend(proxy, tile);

	    if(loadedCallback) {
		loadedCallback(proxy);
	    }
	};
	img.src = url;
	return proxy;
    };
    var spriteImagePath = "https://dl.dropbox.com/sh/";

    window.Sprite = function(name, w, h, callback) {
	return Sprite.load(spriteImagePath + name, w, h, callback);
    };
    window.Sprite.EMPTY = LoaderProxy();
    window.Sprite.load = Sprite.load;
});
