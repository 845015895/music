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
    margin: 0 auto;
    height: 100%;
    /*background: #383B44;*/
    background: url("./assets/back.jpg") no-repeat;
    background-size: cover;
    padding: px(20) px(30);
    box-sizing: border-box;
  }
</style>
