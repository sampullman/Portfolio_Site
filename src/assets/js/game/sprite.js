
function Sprite(image, width, height, sourceX, sourceY) {
  const backupWidth = width || image.width;
  const backupHeight = height || image.height;
  return {
    draw: (c, x, y, w, h) => {
      c.drawImage(
        image,
        sourceX || 0,
        sourceY || 0,
        image.width,
        image.height,
        x,
        y,
        w || backupWidth,
        h || backupHeight,
      );
    },
    fill: (c, x, y, w, h, repeat) => {
      const pattern = c.createPattern(image, repeat || 'repeat');
      c.fillColor(pattern);
      c.fillRect(x, y, w, h);
    },
    width,
    height,
  };
}

Sprite.load = (url, w, h, loadedCallback) => {
  const img = new Image();
  const proxy = { loaded: false };
  const self = this;

  img.onload = () => {
    const tile = Sprite(self, w, h);

    Object.assign(proxy, tile);
    proxy.loaded = true;
    if(loadedCallback) {
      loadedCallback(proxy);
    }
  };
  img.onerror = () => {
    console.log(`Load fail: ${url}`);
    if(loadedCallback) {
      loadedCallback(null);
    }
  };
  img.src = url;
  return proxy;
};

function NewSprite(name, w, h, callback) {
  return Sprite.load(NewSprite.imageRoot + name, w, h, callback);
}
NewSprite.imageRoot = '';

export { NewSprite as Sprite }; // eslint-disable-line
