import Vue from 'vue';
import Router from 'vue-router';
import Site from '@/Site';
import Home from '@/components/Home';
import Portfolio from '@/components/Portfolio';
import Resume from '@/components/Resume';
import Games from '@/components/Games';
import SpaceGame from '@/games/SpaceGame';
import Game from '@/Game';

Vue.use(Router);

const router = new Router({
  mode: 'history',
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
});

export default router;
