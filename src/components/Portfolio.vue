<template>

<div id="content">
    <div id="app_left">
        <div class="app_selector">
            <div v-for="(icon, index) in $options.app_icons" :key="icon[0]" class="app_icon_holder">
                <img @click="app_index = index" class="app_icon" :src="icon[1]" />
            </div>
        </div>
        <div class="app_selector"><img id="app_arrow" src="/static/img/portfolio/app_arrow.png" /></div>
        <transition-group class='carousel' tag="div">
            <div
                v-for="(app, id, index) in $options.apps"
                class='app'
                :key="id">
                <div v-if="app_index == index" class="app_content">
                    <div class="app_subtitle">{{ app.name }}</div>
                    <p class="app_text section">
                        <span class="indent">
                            <a v-if="app.link" :href="app.link" target="_blank">
                                {{ app.name }}
                            </a>
                            {{ app.description }}
                        </span>
                        <ul v-if="app.features">
                            <li v-for="(feature, index) in app.features" :key="index">{{ feature }}</li>
                        </ul>
                    </p>
                </div>
            </div>
        </transition-group>
    </div>
    <div id="app_viewer">
        <img id="img_nav_left" @click="screenshot_prev" src="/static/img/portfolio/left_btn.png" />
        <span class="screenshot_holder">
            <img class="screenshot" />
        </span>
        <img id="img_nav_right" @click="screenshot_next" src="/static/img/portfolio/right_btn.png" />
    </div>
</div>
</template>

<script>
export default {
    name: 'Portfolio',
    data() {
        return {
            app_index: 0
        };
    },
    methods: {
        screenshot_prev: function() {

        },
        screenshot_next: function() {

        }
    },
    watch: {
        app_index: function (newIndex, oldIndex) {
            this.$router.replace('/portfolio/' + this.$options.app_icons[this.app_index][0]);
        }
    },
    created() {
        this.$options.app_icons = [
            ['SciGraph_Calculator', '/static/img/app_icons/scigraph_calc.png'],
            ['Molecular_Mass_Calculator', '/static/img/app_icons/molecular_mass.png'],
            ['Cube_Droid', '/static/img/app_icons/cube_droid.png'],
            ['Quiz_Droid', '/static/img/app_icons/quiz_droid.png'],
            ['Web_Comic_Reader', '/static/img/app_icons/comic_reader.png'],
            ['Number_Slide', '/static/img/app_icons/number_slide.png']
        ];
        if(this.$route.params.app) {
            for(var i = 0; i < this.$options.app_icons.length; i++) {
                if(this.$route.params.app === this.$options.app_icons[i][0]) {
                    this.app_index = i;
                }
            }
        }
        this.$options.apps = {
            'SciGraph_Calculator': {
                'name': 'SciGraph Calculator',
                'link': 'https://github.com/sampullman/android--Scientific-Graphing-Calculator',
                'description': ' is a powerful calculator app for Android. Some of its capabilities are highlighted below.',
                'features': [
                    'Standard calculator funtionality',
                    'Updates result on the fly as the user enters commands',
                    'Stores previous inputs and results, and keeps the last three visible',
                    'Complex number expressions and trigonometric functions',
                    'Copy/paste between main, conversion, and function entry',
                    'Simultaneously graph up to 3 functions',
                    'Trace mode prints out function values while sliding across X axis',
                    'Calculate all zeros visible on the graph',
                    'Optimized for portrait and widescreen modes',
                    'Minimal, intuitive interface'
                ]
            },
            'Molecular_Mass_Calculator': {
                'name': 'Molecular Mass Calculator',
                'link': 'https://github.com/sampullman/android--Molecular-Mass-Calculator',
                'description': ' is an application for calculating the molecular mass of any chemical formula. The percentages ' +
                    'for each mass in the formula are displayed, and the formula is checked against a government database. ' +
                    'The name of the formula is printed if a match is found. The interface is optimized for portrait and ' +
                    'landscape modes, resulting in a simple but pleasing app.',
                'features': []
            },
            'Cube_Droid': {
                'name': 'Cube Droid',
                'link': 'https://github.com/sampullman/android--Puzzle-Droid',
                'description': ' is a Rubik\'s ' +
                    'Cube implementation for Android. It was a first attempt at using OpenGL ES to create ' +
                    'something interesting in a 3d environment.',
                'features': [
                    'Rotating the cube is easy and intuitive',
                    'A slider toggles the cube dimensions from 2x2 to 8x8',
                    'Timer that can be shown, hidden, and reset',
                    'Buttons to scramble and reset the cube',
                    'Smooth animations for both the cube and menu',
                    'Displays alt text/images when available',
                    'The cube is saved and restored between sessions'
                ]
            },
            'Quiz_Droid': {
                'name': 'Quiz Droid',
                'link': '',
                'description': 'Quiz Droid is a fun little app that provides quizzes in a variety of topics including ' +
                    'geography, history, science, and vocabulary. There are currently 8 quizzes totalling ' +
                    'hundreds of questions, and the content expands with every update.',
                'features': [
                    'Difficulty ratings for each question',
                    'Scoring system that takes into account streaks',
                    'Maintains stats on correct/total answered, streaks, and scores',
                    'Casual, timerless mode that doesn\'t record scores',
                    'Questions/Answers are reversible'
                ]
            },
            'Web_Comic_Reader': {
                'name': 'Web Comic Reader',
                'link': 'https://github.com/sampullman/android--Web-Comic-Reader',
                'description': ' is an android app with a simple interface for reading some of the most popular comics on the web.',
                'features': [
                    '12 different comics currently available',
                    'Pre-caches previous and next comics for a smooth experience',
                    'Swipe between comics',
                    'Jump to random comics',
                    'Displays alt text/images when available',
                    'Save comics to SD card',
                    'Offline comic browser for saved comics',
                    'Direct link to the author\'s merchandise store'
                ]
            },
            'Number_Slide': {
                'name': 'Number Slide',
                'link': 'https://github.com/sampullman/android--Number-Slider',
                'description': ' is an ' +
                    'implementation of the 8-puzzle and 15-puzzle for android. The app was written as a ' +
                    'demonstration for a few of android\'s backwards compatibilty libraries. It contains ' +
                    'several unique features, which are listed below.',
                'features': [
                    'Displays the optimal number of moves in 8-puzzle mode',
                    'The built in automated solver animates the solution when activated',
                    'Several pre-loaded images are available to use in place of the basic background',
                    'A file browser is included to select any image as the background'
                ]
            }
        };
    }
};
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
    cursor: pointer;
}

#app_viewer {
    position: relative;

    > img {
        position: relative;
        float: left;
        top: 180px;
        padding: 5px;
        width: auto;
        height: 60px;
    }
    .app {
        transition: transform 0.3s ease-in-out;
    }
}

#img_nav_left {
    visibility: hidden;
}

.screenshot_holder {
    position: relative;
    float: left;
    height: 460px;
    width: 170px;
    background-image: url("/static/img/portfolio/phone.png");
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

.app_subtitle {
    display: inline-block;
    font-family: 'Arial', sans-serif;
    font-size: 26px;
    padding: 5px 12px 5px 16%;
    text-align: center;
    color: #556699;
    font-weight: bold;
}

.app_text {
    line-height: 140%;
    font-size: 15px;
    font-family: 'Arial', sans-serif;
    width: 80%;
    margin: 0px;
    margin-left: 5%;
    padding: 10px 10px 8px 10px;
}

.app_text ul {
    margin-left: -10px;
    margin-top: 5px;
}

.hidden_app_text {
    display: none;
}
</style>
