// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import * as svgicon from 'vue-svgicon';
import VTooltip from 'v-tooltip';

Vue.config.productionTip = false;

Vue.filter('lowercase', function (value) {
    if(!value) return '';
    value = value.toString();
    return value.toLowerCase();
});

Vue.use(svgicon, {
    tagName: 'svgicon'
});

Vue.use(VTooltip);

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
});
