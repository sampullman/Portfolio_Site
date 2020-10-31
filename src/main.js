// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VTooltip from 'v-tooltip';
import * as svgicon from 'vue-svgicon';
import App from './App';
import router from './router';

Vue.config.productionTip = false;

Vue.filter('lowercase', (value) => {
  if(!value) {
    return '';
  }
  return value.toString().toLowerCase();
});

Vue.use(svgicon, {
  tagName: 'svgicon',
});

Vue.use(VTooltip);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
