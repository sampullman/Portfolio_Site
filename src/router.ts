import { createRouter, createWebHistory } from 'vue-router'
import Site from '/src/Site.vue'
import Home from '/src/components/Home.vue'
import Portfolio from '/src/components/Portfolio.vue'
import Resume from '/src/components/Resume.vue'
import Games from '/src/components/Games.vue'
import SpaceGame from '/src/games/SpaceGame.vue'
import Game from '/src/Game.vue'

declare module 'vue-router' {
  interface RouteMeta {
    title?: string
    noScroll?: boolean
    scrollAnchor?: string
  }
}

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Site,
      children: [
        {
          path: '',
          name: 'Home',
          component: Home,
        },
        {
          path: '/portfolio/:app?',
          name: 'Portfolio',
          component: Portfolio,
        },
        {
          path: '/resume',
          name: 'Resume',
          component: Resume,
        },
        {
          path: '/games',
          name: 'Games',
          component: Games,
        },
      ],
    },
    {
      path: '/game',
      name: 'Game',
      component: Game,
      children: [
        {
          path: 'space',
          name: 'SpaceGame',
          component: SpaceGame,
        },
      ],
    },
  ],
})

router.afterEach((to, _from) => {
  const parent = to.matched.find((record) => record.meta.title)
  const parentTitle = parent ? parent.meta.title : null
  document.title = to.meta.title || parentTitle || "Sam Pullman's Portfolio"
})

export default router
