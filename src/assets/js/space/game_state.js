
let GameMode = {
    MENU: 0,
    SINGLE: 1,
    MULTI: 2,
    EDIT: 3
};

let gameState = {
    mode: GameMode.SINGLE,
    score: 0,
    buttons: [],
    soundOn: false,
    isOver: false,
    eventId: 0,
    shotTimer: 0,
    gameOverTimer: 0,
    attackTimer: 0,
    level: null
};

export { gameState, GameMode };
