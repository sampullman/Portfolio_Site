<template>
<div id="home_content">
    <div id="inner">
        <div id="home_text" class="section">
            <span class="indent"></span>
                Hi, I'm Sam Pullman, and this is my home page.
                I've been the CTO of <a href="https://podolabs.com">Podo Labs</a> since 2013,
                and right now we're working on a crowdfunding platform called <a href="https://pledgecamp.com">Pledgecamp</a>.
            <br />
            <br />
            <span class="indent"></span>If you'd like to request a cover letter, commission an android application, or collaborate on a
            project you can reach me <a href="mailto:sampullman@gmail.com">here</a>. My current <router-link to="/resume"><a>resum&eacute;</a></router-link> is
            available in html and pdf form.
            </div>
            <div id="game_holder">
                <canvas id="canvas" width="400" height="300" >
            </canvas>
            <div id="game_description" class="section">
                <p class="description_paragraph">
                    <span class="indent"></span>
                    Here's a simple breakout clone I wrote using the html5 canvas element. Click in the game to begin,
                    and use arrow keys to move left or right.
                </p>
                <p class="description_paragraph">
                    <span class="indent"></span>
                    The blocks are icons of some technologies/platforms I'm familiar with. Destroying the UNIX blocks will
                    award another ball, and some blocks will change the size of the ball that hits it.
                    Clear the blocks to face the boss!
                </p>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    name: 'Home',
    data() {
        return {
            msg: 'Welcome to Your Vue.js App'
        }
    }
}
</script>

<style lang="scss">
#home_content {
    position: relative;
    padding-top: 15px;
    padding-left: 20px;
}

#home_text {
    position: relative;
    float: left;
    font-size: 18px;
    width: 420px;
    margin-right: 20px;
}

#game_holder {
    color: #DDDDDD;
    position: relative;
    float: left;
    width: 400px;
    padding: 0px 12px 15px 12px;
}

#canvas {
    background-color: #777;
    border: 1px solid;
}

#game_description {
    margin-top: 10px;
    font-size: 14px;
    line-height: 130%;
}

#game_description p {
    margin: 5px 0px;
}
</style>
