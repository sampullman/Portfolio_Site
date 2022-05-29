<template>
  <div id="header">
    <div id="header_text">
      <h1>Sam Pullman</h1>
      <h2>Personal Site</h2>
    </div>
    <div id="contact_icons">
      <div v-for="s in social" :key="s.icon" class="contact_icon_holder">
        <a id="Email" target="_blank" :href="s.href">
          <img :src="s.icon" />
        </a>
      </div>
    </div>
    <div id="navlinks" @mouseover="notHover = false" @mouseleave="notHover = true">
      <ul>
        <li
          v-for="link in links"
          :id="link.label.toLowerCase()"
          :key="link.label"
          class="navlink"
          :class="{ active: notHover && link.route === $route.path }"
        >
          <router-link :to="link.route">
            {{ link.label }}
          </router-link>
        </li>
      </ul>
    </div>
    <hr />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Envelope from '/src/static/icons/envelope.svg'
import Android from '/src/static/icons/android.svg'
import Github from '/src/static/icons/github.svg'

const links = [
  { label: 'HOME', route: '/' },
  { label: 'PORTFOLIO', route: '/portfolio' },
  { label: 'GAMES', route: '/games' },
  { label: 'RESUME', route: '/resume' },
]

const social = [
  { icon: Envelope, href: 'mailto:sampullman@gmail.com' },
  { icon: Github, href: 'https://github.com/sampullman' },
  {
    icon: Android,
    href: 'https://play.google.com/store/search?q=threeDBJ&c=apps',
  },
]

const notHover = ref(true)
</script>

<style lang="postcss" scoped>
@import '/src/assets/css/colors.postcss';

#contact_icons {
  margin: 48px 0;
}

.contact_icon_holder {
  display: inline-block;
  padding: 0 15px 0 15px;

  img {
    fill: $text-color;
    width: 40px;
    height: 40px;
  }
}

#header {
  position: relative;
  text-align: center;
  font-family: Copperplate, Copperplate Gothic Light, sans-serif;

  h1 {
    font-size: 2.4em;
    margin: 0;
    padding: 0;
    color: $text-color;
  }
  h2 {
    font-size: 1em;
    margin: 0;
    color: $text-color;
  }
}

hr {
  margin: 0 auto;
  width: 40%;
  height: 1px;
  background-color: $text-color;
  border: none;
}

#navlinks {
  font-family: 'Arial black', sans-serif;
  font-size: 13px;
  color: black;
  cursor: pointer;
}

#navlinks ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 4px;
}

.navlink {
  padding: 0 15px;
  display: inline;
}

.navlink > a {
  color: $text-color;
}

.navlink.active > a,
.navlink > a:hover {
  color: #ddd;
}

.navcur {
  font-weight: bold;
  font-size: 14px;
}
</style>
