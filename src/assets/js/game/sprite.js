
export { NewSprite as Sprite };

var spriteImagePath = '/static/img/home_game/';

function NewSprite(name, w, h, callback) {
    return Sprite.load(spriteImagePath + name, w, h, callback);
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
            repeat = repeat || 'repeat';
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
    var proxy = {};

    img.onload = function() {
        var tile = Sprite(this, w, h);

        Object.assign(proxy, tile);
        if(loadedCallback) {
            loadedCallback(proxy);
        }
    };
    img.onerror = function() {
        console.log('Load fail' + url);
        if(loadedCallback) {
            loadedCallback(null);
        }
    };
    img.src = url;
    return proxy;
};
