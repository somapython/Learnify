<template>
<div class="flex flex-col min-h-screen">
    <router-view class="flex-1" />
  </div>
</template>

<script>
export default {
  name: 'App',
}
</script>

<style>
#app {
   font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  margin: 0;
  padding: 0;
}
</style>
