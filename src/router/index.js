import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/Home';
import Portfolio from '@/components/Portfolio';
import Resume from '@/components/Resume';
import Games from '@/components/Games';
import SpaceGame from '@/games/SpaceGame';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home
        },
        {
            path: '/portfolio/:app?',
            name: 'Portfolio',
            component: Portfolio
        },
        {
            path: '/resume',
            name: 'Resume',
            component: Resume
        },
        {
            path: '/games',
            name: 'Games',
            component: Games,
            children: [
                {
                    path: 'space',
                    name: 'SpaceGame',
                    component: SpaceGame
                }
            ]
        }
    ]
});
