
let GameMode = {
    MENU: 0,
    SINGLE: 1,
    MULTI: 2,
    EDIT: 3
};

let gameState = {
    mode: GameMode.SINGLE,
    score: 0,
    buttons: []
};

export { gameState, GameMode };
