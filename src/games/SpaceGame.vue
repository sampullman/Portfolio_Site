
<template>
    <div id="wrap">
        <link rel="canonical" href="http://www.sampullman.com/games/space_game" />
        <canvas id="canvas" width="480" height="560"></canvas>
    </div>
</template>

<script>
import { loadGame, startGame } from '@/assets/js/space/space_game.js';
export default {
    name: 'SpaceGame',
    mounted: function () {
        console.log('Starting the game');
        this.$nextTick(function () {
            loadGame();
        });
    },
    beforeDestroy: function () {
        console.log('Ending the game');
        pauseGame();
    },
    methods: {
        startGame: startGame
    }
};
</script>

<style lang="scss">
</style>
