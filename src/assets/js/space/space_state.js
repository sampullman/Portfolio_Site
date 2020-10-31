
export const shotW = 5;
export const shotH = 15;

export const GameMode = {
  MENU: 0,
  SINGLE: 1,
  MULTI: 2,
  EDIT: 3,
};

export const gameState = {
  mode: GameMode.SINGLE,
  score: 0,
  buttons: [],
  soundOn: false,
  isOver: false,
  eventId: 0,
  shotTimer: 0,
  gameOverTimer: 0,
  attackTimer: 0,
  level: null,
  activeEnemies: [],
  editorActiveEnemies: [],
  player: null,
  explosions: [],
  powerups: [],
  enemies: [],
  enemyData: {
    width: 36,
    height: 24,
    numAttacks: 0,
    initEnemyCount: 0,
  },
  mines: [],
  enemyShots: [],
  sprites: {
    mines: [],
    explosions: [],
  },
  sounds: {},
};
