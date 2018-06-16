
import { enemyData, Enemy1Obj, Enemy2Obj, Enemy3Obj, Enemy4Obj, Enemy5Obj, Enemy6Obj, Enemy7Obj, Enemy8Obj, Enemy9Obj } from './space_enemies.js';
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
    Sprite.imageRoot = '/static/img/space_game/';
    player.sprites = [Sprite('player.png', w, h), Sprite('playerRight.png', w, h)];
    Enemy1Obj.sprite = Sprite('enemy1.png', enemyData.width, enemyData.height, enemyLoadFn);
    Enemy2Obj.sprite = Sprite('enemy2.png', enemyData.width, enemyData.height, enemyLoadFn);
    Enemy3Obj.sprite = Sprite('enemy3.png', enemyData.width, enemyData.height, enemyLoadFn);
    Enemy4Obj.sprite = Sprite('enemy4.png', enemyData.width, enemyData.height, enemyLoadFn);
    Enemy5Obj.sprite = Sprite('enemy5.png', enemyData.width * 2, enemyData.height * 2, enemyLoadFn);
    Enemy6Obj.sprite = Sprite('enemy6.png', enemyData.width, enemyData.height, enemyLoadFn);
    Enemy7Obj.sprite = Sprite('enemy7.png', enemyData.width, enemyData.height, enemyLoadFn);
    Enemy8Obj.sprite = Sprite('enemy8.png', enemyData.width * 3, enemyData.height, enemyLoadFn);
    sprites.playerShot = [Sprite('laserRed.png', shotW, shotH),
        Sprite('laserRedShot.png', 28, 28)];
    sprites.enemyShot = [Sprite('laserGreen.png', shotW, shotH),
        Sprite('laserGreenShot.png', 28, 28)];
    sprites.playerLife = Sprite('life.png', w / 2, h / 2);
    sprites.explosions.push(Sprite('explosion1.png', enemyData.width, enemyData.height));
    sprites.explosions.push(Sprite('explosion2.png', enemyData.width, enemyData.height));
    sprites.explosions.push(Sprite('explosion3.png', enemyData.width, enemyData.height));
    sprites.explosions.push(Sprite('explosion4.png', enemyData.width, enemyData.height));
    sprites.pause = Sprite('pause.png', 32, 32, buttonLoadFn);
    sprites.play = Sprite('play.png', 32, 32, buttonLoadFn);
    sprites.soundOn = Sprite('sound_on.png', 32, 32, buttonLoadFn);
    sprites.soundOff = Sprite('sound_off.png', 32, 32, buttonLoadFn);
    sprites.shield = Sprite('shield.png', w + 12, h + 5);
    sprites.shieldPowerup = Sprite('shieldPowerup.png', 16, 16);
    sprites.missile = Sprite('missile.png', w / 1.25, h);
    sprites.mines.push(Sprite('mine1.png', 28, 28));
    sprites.mines.push(Sprite('mine2.png', 28, 28));
    Enemy9Obj.sprite = Sprite('enemy9.png', enemyData.width * 3, enemyData.height * 3);
    sprites.star = Sprite('star.png', 16, 16, initStars);
    sounds.shot = new Sound([
        '/static/sounds/shot.mp3',
        '/static/sounds/shot.ogg'
    ]);
    sounds.enemyShot = new Sound([
        '/static/sounds/enemy_shot.mp3',
        '/static/sounds/enemy_shot.ogg'
    ]);
    sounds.enemyExp = new Sound([
        '/static/sounds/enemy_exp.mp3',
        '/static/sounds/enemy_exp.ogg'
    ]);
    sounds.ambient = new Sound([
        '/static/sounds/ambience.mp3']);
    sounds.laser = new Sound([
        '/static/sounds/laser.mp3',
        '/static/sounds/laser.ogg']);
}
