
import { enemyData, enemy1Obj, enemy2Obj, enemy3Obj, enemy4Obj, enemy5Obj, enemy6Obj, enemy7Obj, enemy8Obj, enemy9Obj } from './space_enemies.js';
import { player, Sound, Stars } from './space_objects.js';
import { Sprite } from '../game/sprite.js';

var sprites = {
    mines: [],
    explosions: []
};
var sounds = {};

var shotW = 5;
var shotH = 15;

export { sounds, sprites, loadSprites, shotW, shotH };

function loadSprites(c, enemyLoadFn, buttonLoadFn) {
    function initStars() {
        sprites.stars = new Stars(c, sprites.star, 5, 18, 0.2, 0.7, 50);
        for(var i = 0; i < 30; i++) {
            sprites.stars.add(Math.random() * c.width, Math.random() * c.height);
        }
        enemyLoadFn();
    }
    var w = player.width;
    var h = player.height;
    player.sprites = [Sprite('631wm7d11mdr3mj/2uVRXGxf7A/portfolio/static/images/space_sprites/player.png', w, h), Sprite('631wm7d11mdr3mj/CViMOtl02D/portfolio/static/images/space_sprites/playerLeft.png', w, h), Sprite('631wm7d11mdr3mj/MqXFAiIDw6/portfolio/static/images/space_sprites/playerRight.png', w, h)];
    enemy1Obj.sprite = Sprite('631wm7d11mdr3mj/7oPa2yNaIB/portfolio/static/images/space_sprites/enemy1.png', enemyData.width, enemyData.height, enemyLoadFn);
    enemy2Obj.sprite = Sprite('631wm7d11mdr3mj/nTAY8QygYM/portfolio/static/images/space_sprites/enemy2.png', enemyData.width, enemyData.height, enemyLoadFn);
    enemy3Obj.sprite = Sprite('631wm7d11mdr3mj/ok-JoalkfC/portfolio/static/images/space_sprites/enemy3.png', enemyData.width, enemyData.height, enemyLoadFn);
    enemy4Obj.sprite = Sprite('631wm7d11mdr3mj/xK3PxxAch8/portfolio/static/images/space_sprites/enemy4.png', enemyData.width, enemyData.height, enemyLoadFn);
    enemy5Obj.sprite = Sprite('631wm7d11mdr3mj/qQ5Kzklhyy/portfolio/static/images/space_sprites/enemy5.png', enemyData.width * 2, enemyData.height * 2, enemyLoadFn);
    enemy6Obj.sprite = Sprite('631wm7d11mdr3mj/6roKA0hqDT/portfolio/static/images/space_sprites/enemy6.png', enemyData.width, enemyData.height, enemyLoadFn);
    enemy7Obj.sprite = Sprite('631wm7d11mdr3mj/8-8aF0Hgmf/portfolio/static/images/space_sprites/enemy7.png', enemyData.width, enemyData.height, enemyLoadFn);
    enemy8Obj.sprite = Sprite('631wm7d11mdr3mj/sahm-t_RnK/portfolio/static/images/space_sprites/enemy8.png', enemyData.width * 3, enemyData.height, enemyLoadFn);
    sprites.playerShot = [Sprite('631wm7d11mdr3mj/ikWk5YzfJd/portfolio/static/images/space_sprites/laserRed.png', shotW, shotH),
        Sprite('631wm7d11mdr3mj/JU3cMwxn1o/portfolio/static/images/space_sprites/laserRedShot.png', 28, 28)];
    sprites.enemyShot = [Sprite('631wm7d11mdr3mj/LX6Dm97mS3/portfolio/static/images/space_sprites/laserGreen.png', shotW, shotH),
        Sprite('631wm7d11mdr3mj/r2rh_AfaRE/portfolio/static/images/space_sprites/laserGreenShot.png', 28, 28)];
    sprites.playerLife = Sprite('631wm7d11mdr3mj/z3QpEUH-QA/portfolio/static/images/space_sprites/life.png', w / 2, h / 2);
    sprites.explosions.push(Sprite('631wm7d11mdr3mj/8HMg2jgeDZ/portfolio/static/images/space_sprites/explosion1.png', enemyData.width, enemyData.height));
    sprites.explosions.push(Sprite('631wm7d11mdr3mj/NnRsbw5M8i/portfolio/static/images/space_sprites/explosion2.png', enemyData.width, enemyData.height));
    sprites.explosions.push(Sprite('631wm7d11mdr3mj/PXxwqQ73xF/portfolio/static/images/space_sprites/explosion3.png', enemyData.width, enemyData.height));
    sprites.explosions.push(Sprite('631wm7d11mdr3mj/_LJddbHSXL/portfolio/static/images/space_sprites/explosion4.png', enemyData.width, enemyData.height));
    sprites.pause = Sprite('631wm7d11mdr3mj/PjnX4rAH7y/portfolio/static/images/space_sprites/pause.png', 32, 32, buttonLoadFn);
    sprites.play = Sprite('631wm7d11mdr3mj/cc7mbxDjlT/portfolio/static/images/space_sprites/play.png', 32, 32, buttonLoadFn);
    sprites.soundOn = Sprite('631wm7d11mdr3mj/RaJHuLjaHG/portfolio/static/images/space_sprites/sound_on.png', 32, 32, buttonLoadFn);
    sprites.soundOff = Sprite('631wm7d11mdr3mj/Ih0P0EL4Id/portfolio/static/images/space_sprites/sound_off.png', 32, 32, buttonLoadFn);
    sprites.shield = Sprite('631wm7d11mdr3mj/UslOP-1wz2/portfolio/static/images/space_sprites/shield.png', w + 12, h + 5);
    sprites.shieldPowerup = Sprite('631wm7d11mdr3mj/E46JLd7fY2/portfolio/static/images/space_sprites/shieldPowerup.png', 16, 16);
    sprites.missile = Sprite('631wm7d11mdr3mj/eCvEneLNME/portfolio/static/images/space_sprites/missile.png', w / 1.25, h);
    sprites.mines.push(Sprite('631wm7d11mdr3mj/6rCVFvacpH/portfolio/static/images/space_sprites/mine1.png', 28, 28));
    sprites.mines.push(Sprite('631wm7d11mdr3mj/HYtZLisfJZ/portfolio/static/images/space_sprites/mine2.png', 28, 28));
    enemy9Obj.sprite = Sprite('631wm7d11mdr3mj/Hjk8fwkK-A/portfolio/static/images/space_sprites/enemy9.png', enemyData.width * 3, enemyData.height * 3);
    sprites.star = Sprite('631wm7d11mdr3mj/4uGpI1uGwu/portfolio/static/images/space_sprites/star.png', 16, 16, initStars);
    sounds.shot = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/exIW7e0MTO/portfolio/static/sounds/shot.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/E-xBn5g2zL/portfolio/static/sounds/shot.ogg'
    ]);
    sounds.enemyShot = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/kB9IQJutEx/portfolio/static/sounds/enemy_shot.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/_-RTp20zpM/portfolio/static/sounds/enemy_shot.ogg'
    ]);
    sounds.enemyExp = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/M2luGqD1KV/portfolio/static/sounds/enemy_exp.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/hnKY7lllql/portfolio/static/sounds/enemy_exp.ogg'
    ]);
    sounds.ambient = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/cJ5oM2HoIl/portfolio/static/sounds/ambience.mp3']);
    sounds.laser = Sound([
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/H__6HLAZu7/portfolio/static/sounds/laser.mp3',
        'https://dl.dropbox.com/sh/631wm7d11mdr3mj/j0yUd4ncdf/portfolio/static/sounds/laser.ogg']);
}
