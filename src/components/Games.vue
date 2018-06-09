<template>

<div id="wrap">
    <link rel="canonical" href="http://www.sampullman.com/games" />
    <div id="games_content">
        <!--
        <iframe id="game" width="980" height="565" style="visibility:hidden;" onload="this.style.visibility = 'visible';"
                    src="/games/space_game/">
        </iframe>
        -->
        <div style="clear: both;"></div>
        <div class="instructions section">
            <p id="instr_p">Xenophobia is a Galaga clone in the works. It uses free graphics created by
            <a href="http://www.kenney.nl/" target="_blank">Kenney</a>.</p>
            <p>Arrow keys or w/a/s/d move the ship around, space shoots the main weapon, and shift fires a missile. Enemies have a small
            chance of dropping powerups. Toggle the volume or pause the game with buttons in the right hand corner. Your progress is
            saved each level if cookies are enabled, and you can restart a level if you lose all your lives. </p>
        </div>
    </div>
    <div id="feedback">
        <textarea id="feedback_input" rows="5" cols="55">Feedback</textarea>
        <input id="feedback_button" type="submit" value="Submit" />
    </div>
</div>

</template>

<script>
export default {
    name: 'Games'
}
</script>

<style lang="scss">

.instructions {
    font-family: 'Arial', sans-serif;
    width: 530px;
    text-align: center;
    margin-left: -30px;
    margin-bottom: 20px;
}

#game {
    border: none;
}

#games_content {
    padding-top: 20px;
}

#feedback_input {
    margin: 0;
    padding: 4px;
}

#feedback_button {
    display: block;
    padding: 4px;
    margin: -7px 0 0 15%;
}
</style>
