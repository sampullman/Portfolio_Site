<template>
  <div id="home_content">
    <div id="home_text" class="section">
      <span class="indent" />
      Hello, I'm Sam Pullman, and this is my home page. I've been the CTO of
      <a href="https://podolabs.com">Podo Labs</a> since 2013, and right now we're working
      on a crowdfunding platform called <a href="https://pledgecamp.com">Pledgecamp</a>.
      <br />
      <br />
      <span class="indent" />
      If you'd like to chat about Pledgecamp or other Podo Labs products, you can reach me
      <a href="mailto:spullman@pledgecamp.com">here</a> or join the Pledgecamp
      <a href="https:/t.me/pledgecamp" target="_blank">Telegram group</a>. For
      collaborations or contract work you can contact me
      <a href="mailto:sampullman@gmail.com">here</a>.
    </div>
    <div id="game_holder">
      <canvas id="breakout-canvas" width="400" height="300" />
      <div id="game_description" class="section">
        <p>
          <span class="indent" />
          A simple Breakout clone written with Javascript and canvas. Click in the game to
          begin, and use arrow keys to move left or right.
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { nextTick, onMounted, onUnmounted } from 'vue'
import { loadGame, pauseGame } from '/src/assets/js/home/home_game.js'

onMounted(async () => {
  console.log('Starting the game')
  await nextTick()
  loadGame()
})

onUnmounted(() => {
  console.log('Ending the game')
  pauseGame()
})
</script>

<style lang="postcss">
#home_content {
  position: relative;
  padding-top: 15px;

  > div {
    margin-left: auto;
    margin-right: auto;
    width: 480px;
  }
}

#home_text {
  font-size: 18px;
}

#game_holder {
  color: #ddd;
  box-sizing: border-box;
  padding: 0 2px 0 0;
  margin-top: 16px;
}

#breakout-canvas {
  width: 100%;
  background-color: #777;
  border: 1px solid;
}

#game_description {
  margin-top: 10px;
  margin-bottom: 48px;
  font-size: 14px;
  line-height: 130%;
}

#game_description p {
  margin: 5px 0;
}
</style>
