
<template>
<div id="app">
  <div class="header">
    <Header />
  </div>
  <router-view />
</div>
</template>

<script>
import Header from './components/Header';

export default {
  name: 'site',
  components: {
    Header,
  },
};
</script>

<style lang="scss">
@import 'main';

.svg-icon {
  display: inline-block;
  color: inherit;
  vertical-align: middle;
  fill: none;
  stroke: #aaa;
}
</style>
