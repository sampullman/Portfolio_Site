
var Evade = {
    started: false,
    initialize: function() {
        Evade.startText1 = new TextObject("Evade", C_WIDTH/2, C_HEIGHT/2, 48);
        Evade.startText2 = new TextObject("Press space to start", C_WIDTH/2, 0.7*C_HEIGHT, 24);
        Evade.startText2.add(new Base.InputKeyComponent({ 'space':function() { Evade.startGame(); } }));
        root.push(Evade.startText1);
        root.push(Evade.startText2);
    },
    startGame: function() {
        root.remove(Evade.startText1);
        root.remove(Evade.startText2);
        var v = 35;
        Evade.player = Base.makeCircle(collisionSystem, 200, 100, 20,
                                         { 'color': "#A0A" });
        var player = Evade.player;
        player.add(new Base.PhysicsComponent(physics), 0);
        //player.add(new Evade.PlayerResponse(collisionSystem, player));
        player.add(new Base.InputKeyComponent({ 'up':velInc(player, 0, -v), 'w':velInc(player, 0, -v) }, 0));
        //player.add(new Evade.PlayerMoveComponent(200), 0);
        //player.add(new Evade.PlayerLogic());
        entityManager.add(player);
        Evade.started = true;
    },
    gameOver: function() {
        Evade.started = false;
    },
    cleanup: function() {
        root.remove(Evade.startText1);
        root.remove(Evade.startText2);
    }
}