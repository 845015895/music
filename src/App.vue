<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>
<style lang="scss">
  @import "scss/_size.scss";
  #app{
    width: px(375);
    height: 100%;
  }
</style>
