<template>
  <div id="app">
    <chatMain />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import chatMain from "@/chat/chatMain.vue";

@Component({
  components: {
    chatMain
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
  html, body {
      height: 100%;
      margin: 0;
  }

  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    display: flex;
    margin: 0 auto;
    max-width: 1200px;
    height: 94%;
  }

</style>
