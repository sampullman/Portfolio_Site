<template>

<div id="content">
    <div id="app_left">
        <div class="app_selector">
        <!--
        <div app-tip="{{id}}" ng-repeat="(id, image) in apps" class="app_icon_holder">
            <a app-nav="{{id}}" class="app_icon_link" id="{{id}}" href="#/portfolio/?app={{id}}">
                <img class="app_icon" ng-src={{image}} />
            </a>
        </div>
        -->
        </div>
        <div class="app_selector"><img id="app_arrow" src="static/images/app_arrow.png" /></div>
        <div id="android_portfolio_subtitle" class="portfolio_subtitle"></div>
        <p id="android_portfolio_text" class="portfolio_text section"></p>
    </div>
    <div id="app_viewer">
        <img class="img_nav" id="img_nav_left"  src="https://dl.dropbox.com/sh/631wm7d11mdr3mj/zXoFz1gIIO/portfolio/static/images/left_btn.png" />
        <span class="screenshot_holder">
            <img class="screenshot" />
        </span>
        <img class="img_nav" id="img_nav_right"  src="https://dl.dropbox.com/sh/631wm7d11mdr3mj/OAjEfNhU4k/portfolio/static/images/right_btn.png" />
    </div>

    <div class="hidden_portfolio_text" id="SciGraph_Calculator">
        <span class="indent">
            <a href="https://github.com/sampullman/android--Scientific-Graphing-Calculator">SciGraph Calculator</a>
            is a powerful calculator app for Android. Some of its capabilities are highlighted below.
        </span>
        <ul>
            <li>Standard calculator funtionality</li>
            <li>Updates result on the fly as the user enters commands</li>
            <li>Stores previous inputs and results, and keeps the last three visible</li>
            <li>Complex number expressions and trigonometric functions</li>
            <li>Copy/paste between main, conversion, and function entry</li>
            <li>Simultaneously graph up to 3 functions</li>
            <li>Trace mode prints out function values while sliding across X axis</li>
            <li>Calculate all zeros visible on the graph</li>
            <li>Optimized for portrait and widescreen modes</li>
            <li>Minimal, intuitive interface</li>
        </ul>
    </div>
    <div class="hidden_portfolio_text" id="Web_Comic_Reader">
        <span class="indent">
            <a href="https://github.com/sampullman/android--Web-Comic-Reader">Web Comic Reader</a>
            is an android app with a simple interface for reading some of the most popular comics
            on the web.
        </span>
        <ul>
            <li>12 different comics currently available</li>
            <li>Pre-caches previous and next comics for a smooth experience</li>
            <li>Swipe between comics</li>
            <li>Jump to random comics</li>
            <li>Displays alt text/images when available</li>
            <li>Save comics to SD card</li>
            <li>Offline comic browser for saved comics</li>
            <li>Direct link to the author's merchandise store</li>
        </ul>
    </div>
    <div class="hidden_portfolio_text" id="Cube_Droid">
        <span class="indent">
            <a href="https://github.com/sampullman/android--Puzzle-Droid">Cube Droid</a> is a Rubik's
            Cube implementation for Android. It was a first attempt at using OpenGL ES to create
            something interesting in a 3d environment.
        </span>
        <ul>
            <li>Rotating the cube is easy and intuitive</li>
            <li>A slider toggles the cube dimensions from 2x2 to 8x8</li>
            <li>Timer that can be shown, hidden, and reset</li>
            <li>Buttons to scramble and reset the cube</li>
            <li>Smooth animations for both the cube and menu</li>
            <li>Displays alt text/images when available</li>
            <li>The cube is saved and restored between sessions</li>
        </ul>
    </div>
    <div class="hidden_portfolio_text" id="Quiz_Droid">
        <span class="indent">
        Quiz Droid is a fun little app that provides quizzes in a variety of topics including
        geography, history, science, and vocabulary. There are currently 8 quizzes totalling
        hundreds of questions, and the content expands with every update.
        </span>
        <ul>
            <li>Difficulty ratings for each question</li>
            <li>Scoring system that takes into account streaks</li>
            <li>Maintains stats on correct/total answered, streaks, and scores</li>
            <li>Casual, timerless mode that doesn't record scores</li>
            <li>Questions/Answers are reversible</li>
        </ul>
    </div>
    <div class="hidden_portfolio_text" id="Molecular_Mass_Calculator">
        <span class="indent">
        <a href="https://github.com/sampullman/android--Molecular-Mass-Calculator">Molecular Mass Calculator</a>
        is an application for calculating the molecular mass of any chemical formula. The percentages
        for each mass in the formula are displayed, and the formula is checked against a government database.
        The name of the formula is printed if a match is found. The interface is optimized for portrait and
        landscape modes, resulting in a simple but pleasing app.
        </span>
    </div>
    <div class="hidden_portfolio_text" id="Number_Slide">
        <span class="indent">
        <a href="https://github.com/sampullman/android--Number-Slider">Number Slide</a> is an
        implementation of the 8-puzzle and 15-puzzle for android. The app was written as a
        demonstration for a few of android's backwards compatibilty libraries. It contains
        several unique features, which are listed below.
        </span>
        <ul>
            <li>Displays the optimal number of moves in 8-puzzle mode</li>
            <li>The built in automated solver animates the solution when activated</li>
            <li>Several pre-loaded images are available to use in place of the basic background</li>
            <li>A file browser is included to select any image as the background</li>
        </ul>
    </div>
</div>
</template>

<script>
export default {
    name: 'Portfolio',
    data() {
        return {
        }
    }
}
</script>

<style lang="scss">

#app_left {
    position:relative;
    float: left;
    width: 60%;
}

.portfolio_title {
    font-family: 'Arial', sans-serif;
    position: absolute;
    left: -210px;
    top: 20px;
    font-size: 20px;
    font-weight: bold;
    margin: 0;
    padding: 0;
}

.app_selector {
    position: relative;
    left: 40px;
}

#app_arrow {
    position: relative;
    width: 20px;
    height: 20px;
}

.app_icon_holder {
    display: inline-block;
    width: 48px;
    height: 48px;
    margin: 5px 15px 8px 15px;
}

.app_icon {
    width: 100%;
    height: 100%;
}

#app_viewer {
    position: relative;
}

.img_nav {
    position: relative;
    float: left;
    top: 180px;
    padding: 5px;
    width: auto;
    height: 60px;
}

#img_nav_left {
    visibility: hidden;
}

.screenshot_holder {
    position: relative;
    float: left;
    height: 460px;
    width: 170px;
    background-image: url("https://dl.dropbox.com/sh/631wm7d11mdr3mj/kaVVT2CgsM/portfolio/static/images/phone.png");
    background-repeat: no-repeat;
    background-size: contain;
    padding: 40px;
}

.screenshot {
    position: absolute;
    top: 13.6%;
    left: 10%;
    width: 82%;
    height: 63.4%;
}

.portfolio_subtitle {
    display: inline-block;
    font-family: 'Arial', sans-serif;
    font-size: 26px;
    margin-bottom: 0px;
    margin-left: 15%;
    margin-top: 0;
    padding: 5px 12px 5px 12px;
    text-align: center;
    color: #556699;
    font-weight: bold;
    /*text-shadow: 1px 1px 2px #444;*/
}

.portfolio_text {
    float: left;
    line-height: 140%;
    font-size: 15px;
    font-family: 'Arial', sans-serif;
    width: 80%;
    margin: 0px;
    margin-left: 5%;
    padding: 10px 10px 8px 10px;
    /*text-shadow: 1px 1px 2px #000;*/
}

.portfolio_text ul {
    margin-left: -10px;
    margin-top: 5px;
}

.hidden_portfolio_text {
    display: none;
}
</style>
