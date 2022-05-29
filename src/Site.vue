<template>
  <div id="app">
    <div class="header">
      <Header />
    </div>
    <router-view />
  </div>
</template>

<script lang="ts" setup>
import Header from './components/Header.vue'
</script>

<style lang="postcss" scoped>
#app {
  margin-top: 72px;
}
</style>
