<template>
  <div id="wrap">
    <div id="games_content">
      <iframe id="game" width="485" height="565" src="/game/space/" />
      <div style="clear: both" />
      <div class="instructions section">
        <p id="instr_p">
          Xenophobia is a Galaga clone in the works. It uses free graphics created by
          <a href="http://www.kenney.nl/" target="_blank">Kenney</a>.
        </p>
        <p>
          Arrow keys or w/a/s/d move the ship around, space shoots the main weapon, and
          shift fires a missile. Enemies have a small chance of dropping powerups. Toggle
          the volume or pause the game with buttons in the right hand corner. Your
          progress is saved each level if cookies are enabled, and you can restart a level
          if you lose all your lives.
        </p>
      </div>
    </div>
    <div id="feedback">
      <textarea id="feedback_input" placeholder="Feedback" rows="5" cols="55" /><br />
      <input id="feedback_button" type="submit" value="Submit" />
    </div>
  </div>
</template>

<style lang="postcss">
.instructions {
  width: 530px;
  margin: 0 auto;
  text-align: center;
  margin-bottom: 20px;
  padding-left: 32px;
  padding-right: 24px;

  > p {
    text-align: left;
  }
}

#game {
  border: none;
}

#games_content {
  padding-top: 20px;
  text-align: center;
}

#feedback {
  text-align: center;
  margin-bottom: 64px;
}

#feedback_input {
  margin: 0;
  padding: 4px;
}
</style>
