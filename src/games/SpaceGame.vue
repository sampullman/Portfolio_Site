<template>
  <div id="wrap">
    <link rel="canonical" href="http://www.sampullman.com/game/space_game" />
    <canvas id="canvas" width="480" height="560" />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, nextTick, onUnmounted } from 'vue'
import { loadGame, pause } from '/src/assets/js/space/space_game.js'

onMounted(async () => {
  console.log('Starting the game')
  await nextTick()
  loadGame()
})

onUnmounted(() => {
  console.log('Ending the game')
  pause()
})
</script>

<style lang="postcss">
#wrap {
  text-align: center;
}
#canvas {
  position: relative;
  float: left;
  background-color: #777;
  border: 1px solid;
  background-image: url('/src/static/img/space_game/background.png');
}
</style>
