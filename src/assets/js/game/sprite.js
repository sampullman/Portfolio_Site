function Sprite(image, width, height, sourceX, sourceY) {
  const backupWidth = width || image.width
  const backupHeight = height || image.height
  return {
    draw(c, x, y, w, h) {
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
      )
    },
    fill(c, x, y, w, h, repeat) {
      const pattern = c.createPattern(image, repeat || 'repeat')
      c.fillColor(pattern)
      c.fillRect(x, y, w, h)
    },
    width,
    height,
  }
}

function SpriteLoader(name, w, h, callback) {
  const img = new Image()
  const proxy = { loaded: false }

  img.onload = () => {
    const tile = Sprite(img, w, h)

    Object.assign(proxy, tile)
    proxy.loaded = true
    if (callback) {
      callback(proxy)
    }
  }
  img.onerror = () => {
    console.log(`Load fail: /static/img/${name}`)
    if (callback) {
      callback(null)
    }
  }
  img.src = `/src/static/img/${SpriteLoader.imageRoot}${name}`
  return proxy
}
SpriteLoader.imageRoot = ''

export { SpriteLoader as Sprite }
