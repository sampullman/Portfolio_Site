
<template>
    <div id="app">
        <div class="header">
            <Header></Header>
        </div>
        <router-view/>
    </div>
</template>

<script>
import Header from './components/Header';
export default {
    name: 'App',
    components: {
        Header
    }
};
</script>

<style lang="scss">
@import 'assets/scss/main.scss';
.svg-icon {
    display: inline-block;
    color: inherit;
    vertical-align: middle;
    fill: none;
    stroke: #AAA;
}
</style>
