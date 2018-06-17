
<template>
    <div id="wrap">
        <link rel="canonical" href="http://www.sampullman.com/game/space_game" />
        <canvas id="canvas" width="480" height="560"></canvas>
    </div>
</template>

<script>
import { loadGame, resume, pause } from '@/assets/js/space/space_game.js';
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
        pause();
    },
    methods: {
        resume: resume
    }
};
</script>

<style lang="scss">
#canvas {
    position: relative;
    float: left;
    background-color: #777;
    border: 1px solid;
    background-image: url("/static/img/space_game/background.png");
}
</style>
