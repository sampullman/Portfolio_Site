<template>
  <div id="content">
    <div id="app_left">
      <div id="app_selector">
        <div>
          <div
            v-for="(appItem, index) in $options.apps"
            :key="appItem.id"
            class="app_icon_holder"
          >
            <img
              :src="getImage(appItem.icon)"
              class="app_icon"
              @click="appIndex = index"
            />
          </div>
        </div>
        <div>
          <img id="app_arrow" src="/src/static/img/portfolio/app_arrow.png" />
        </div>
      </div>
      <div class="carousel">
        <div v-for="n in [appIndex]" :key="n" class="app">
          <div class="app_content">
            <div class="app_subtitle">
              {{ app.name }}
            </div>
            <div class="app_text section">
              <div class="app_text_desc">
                <a v-if="app.link" :href="app.link" target="_blank">
                  {{ app.name }}
                </a>
                {{ app.description }}
              </div>
              <ul v-if="app.features">
                <li v-for="(feature, index) in app.features" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div id="app_viewer">
      <div id="img_nav_left" class="nav" @click="screenshotPrev" />
      <div id="screenshot_holder">
        <transition-group :name="screenshotDir" tag="div">
          <img
            v-for="n in [`${screenshotIndex} ${appIndex}`]"
            :key="n"
            :src="getImage(app.screenshots[screenshotIndex])"
          />
        </transition-group>
      </div>
      <div id="img_nav_right" class="nav" @click="screenshotNext" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import anime from 'animejs'
import { onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const route = useRoute()

const appIndex = ref(0)
const app = ref()
const screenshotIndex = ref(0)
const screenshotDir = ref('left')

watch(appIndex, (newIndex) => {
  app.value = apps[newIndex]
  router.replace(`/portfolio/${app.value.id}`)
  const pos = 29 + newIndex * 78
  anime({
    targets: '#app_arrow',
    left: `${pos}px`,
    elasticity: 400,
  })
  screenshotIndex.value = 0
  screenshotDir.value = 'none'
})

const screenshotPrev = () => {
  screenshotDir.value = 'left'
  const count = app.value.screenshots.length
  screenshotIndex.value = (count + screenshotIndex.value - 1) % count
}

const screenshotNext = () => {
  screenshotDir.value = 'right'
  const count = app.value.screenshots.length
  screenshotIndex.value = (screenshotIndex.value + 1) % count
}

const getImage = (icon: string) => {
  return `/static/img/${icon}`
}

onMounted(() => {
  if (route.params.app) {
    for (let i = 0; i < apps.length; i += 1) {
      if (route.params.app === apps[i].id) {
        appIndex.value = i
      }
    }
  }
  app.value = apps[appIndex.value]
})

const apps = [
  {
    id: 'SciGraph_Calculator',
    name: 'SciGraph Calculator',
    icon: 'app_icons/scigraph_calc.png',
    link: 'https://github.com/sampullman/android--Scientific-Graphing-Calculator',
    description:
      ' is a powerful calculator app for Android. Some of its capabilities are highlighted below.',
    features: [
      'Standard calculator funtionality',
      'Updates result on the fly as the user enters commands',
      'Stores previous inputs and results, and keeps the last three visible',
      'Complex number expressions and trigonometric functions',
      'Copy/paste between main, conversion, and function entry',
      'Simultaneously graph up to 3 functions',
      'Trace mode prints out function values while sliding across X axis',
      'Calculate all zeros visible on the graph',
      'Optimized for portrait and widescreen modes',
      'Minimal, intuitive interface',
    ],
    screenshots: [
      'SciGraph_Calculator/screenshot0.png',
      'SciGraph_Calculator/screenshot1.png',
      'SciGraph_Calculator/screenshot2.png',
      'SciGraph_Calculator/screenshot3.png',
      'SciGraph_Calculator/screenshot4.png',
      'SciGraph_Calculator/screenshot5.png',
      'SciGraph_Calculator/screenshot6.png',
    ],
  },
  {
    id: 'Molecular_Mass_Calculator',
    name: 'Molecular Mass Calculator',
    icon: 'app_icons/molecular_mass.png',
    link: 'https://github.com/sampullman/android--Molecular-Mass-Calculator',
    description:
      ' is an application for calculating the molecular mass of any chemical formula. The percentages ' +
      'for each mass in the formula are displayed, and the formula is checked against a government database. ' +
      'The name of the formula is printed if a match is found. The interface is optimized for portrait and ' +
      'landscape modes, resulting in a simple but pleasing app.',
    features: [],
    screenshots: [
      'Molecular_Mass_Calculator/screenshot0.png',
      'Molecular_Mass_Calculator/screenshot1.png',
      'Molecular_Mass_Calculator/screenshot2.png',
    ],
  },
  {
    id: 'Cube_Droid',
    name: 'Cube Droid',
    icon: 'app_icons/cube_droid.png',
    link: 'https://github.com/sampullman/android--Puzzle-Droid',
    description:
      " is a Rubik's " +
      'Cube implementation for Android. It was a first attempt at using OpenGL ES to create ' +
      'something interesting in a 3d environment.',
    features: [
      'Rotating the cube is easy and intuitive',
      'A slider toggles the cube dimensions from 2x2 to 8x8',
      'Timer that can be shown, hidden, and reset',
      'Buttons to scramble and reset the cube',
      'Smooth animations for both the cube and menu',
      'Displays alt text/images when available',
      'The cube is saved and restored between sessions',
    ],
    screenshots: [
      'Cube_Droid/screenshot0.png',
      'Cube_Droid/screenshot1.png',
      'Cube_Droid/screenshot2.png',
    ],
  },
  {
    id: 'Quiz_Droid',
    name: 'Quiz Droid',
    icon: 'app_icons/quiz_droid.png',
    link: '',
    description:
      'Quiz Droid is a fun little app that provides quizzes in a variety of topics including ' +
      'geography, history, science, and vocabulary. There are currently 8 quizzes totalling ' +
      'hundreds of questions, and the content expands with every update.',
    features: [
      'Difficulty ratings for each question',
      'Scoring system that takes into account streaks',
      'Maintains stats on correct/total answered, streaks, and scores',
      "Casual, timerless mode that doesn't record scores",
      'Questions/Answers are reversible',
    ],
    screenshots: [
      'Quiz_Droid/screenshot0.png',
      'Quiz_Droid/screenshot1.png',
      'Quiz_Droid/screenshot2.png',
      'Quiz_Droid/screenshot3.png',
    ],
  },
  {
    id: 'Web_Comic_Reader',
    name: 'Web Comic Reader',
    icon: 'app_icons/comic_reader.png',
    link: 'https://github.com/sampullman/android--Web-Comic-Reader',
    description:
      ' is an android app with a simple interface for reading some of the most popular comics on the web.',
    features: [
      '12 different comics currently available',
      'Pre-caches previous and next comics for a smooth experience',
      'Swipe between comics',
      'Jump to random comics',
      'Displays alt text/images when available',
      'Save comics to SD card',
      'Offline comic browser for saved comics',
      "Direct link to the author's merchandise store",
    ],
    screenshots: [
      'Web_Comic_Reader/screenshot0.png',
      'Web_Comic_Reader/screenshot1.png',
      'Web_Comic_Reader/screenshot2.png',
    ],
  },
  {
    id: 'Number_Slide',
    name: 'Number Slide',
    icon: 'app_icons/number_slide.png',
    link: 'https://github.com/sampullman/android--Number-Slider',
    description:
      ' is an implementation of the 8-puzzle and 15-puzzle for android. The app was written as a ' +
      "demonstration for a few of android's backwards compatibilty libraries. It contains " +
      'several unique features, which are listed below.',
    features: [
      'Displays the optimal number of moves in 8-puzzle mode',
      'The built in automated solver animates the solution when activated',
      'Several pre-loaded images are available to use in place of the basic background',
      'A file browser is included to select any image as the background',
    ],
    screenshots: [
      'Number_Slide/screenshot0.png',
      'Number_Slide/screenshot1.png',
      'Number_Slide/screenshot2.png',
      'Number_Slide/screenshot3.png',
    ],
  },
]
</script>

<style lang="postcss">
#content::after {
  display: none;
  content: url('/src/static/img/portfolio/right_btn_pressed.png')
    url('/src/static/img/portfolio/left_btn_pressed.png');
}

#app_left {
  position: relative;
  float: left;
  width: 60%;
}

#app_selector {
  width: fit-content;
  margin: 0 auto;
}

#app_arrow {
  position: relative;
  width: 20px;
  height: 20px;
  left: 29px;
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

.carousel {
  width: 100%;
  box-sizing: border-box;
  padding: 0 8% 0 15%;
}

.app_subtitle {
  font-family: 'Arial', sans-serif;
  font-size: 26px;
  padding: 5px 12px 5px 16%;
  color: #569;
  font-weight: bold;
}

.app_content .app_text {
  line-height: 140%;
  font-size: 15px;
  margin: 0;
  padding: 16px 10px 8px 16px;
  .app_text_desc {
    padding-left: 16px;
    max-width: 700px;
  }
}

#app_viewer {
  position: relative;

  > .nav {
    position: relative;
    float: left;
    top: 180px;
    padding: 5px;
    width: 32px;
    height: 72px;
    background-repeat: no-repeat;
    background-size: contain;
  }
  #img_nav_left {
    background-image: url('/src/static/img/portfolio/left_btn.png');

    &:hover {
      background-image: url('/src/static/img/portfolio/left_btn_pressed.png');
    }
  }
  #img_nav_right {
    background-image: url('/src/static/img/portfolio/right_btn.png');

    &:hover {
      background-image: url('/src/static/img/portfolio/right_btn_pressed.png');
    }
  }
}

#screenshot_holder {
  position: relative;
  float: left;
  height: 460px;
  width: 170px;
  background-image: url('/src/static/img/portfolio/phone.png');
  background-repeat: no-repeat;
  background-size: contain;
  padding: 40px;

  > div {
    position: absolute;
    top: 13.6%;
    left: 10%;
    width: 205px;
    height: 63.4%;
    overflow: hidden;
  }

  img {
    width: 100%;
    height: 100%;
    user-select: none;
  }
}

.left-enter-active,
.left-leave-active,
.right-enter-active,
.right-leave-active {
  transition: all 0.6s ease;
  overflow: hidden;
  visibility: visible;
  opacity: 1;
  position: absolute;
}
.left-enter {
  transform: translateX(205px);
}
.left-leave-active {
  transform: translateX(-205px);
}
.right-enter {
  transform: translateX(-205px);
}
.right-leave-active {
  transform: translateX(205px);
}
.left-enter,
.left-leave-to,
.right-enter,
.right-leave-to {
  opacity: 0;
  visibility: hidden;
}
</style>
