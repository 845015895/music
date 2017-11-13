<template>
  <div class="loading">
    <div>
      <div class="logo"></div>
      <div class="name">橙子音乐</div>
      <div class="donghua"></div>
    </div>

  </div>
</template>
<script>
  export default {}
</script>
<style lang="scss" scoped="">
  @import "../scss/_size.scss";
  .loading{
    position: absolute;
    z-index: 100;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: #ECE8DE;

  }
  .logo {
    margin: px(130) auto 0 auto;
    width: px(80);
    height: px(80);
    border-radius: 100%;
    border:px(5) solid #FC6336;
    background: url("../assets/player_logo.png") no-repeat;
    background-size: cover;
  }
  .name{
    text-align: center;
    color: #fff;
    font-size: px(25);
    margin: px(20) auto;
    font-weight: 600;
  }
  .donghua{
    margin: 0 auto;
    width: px(300);
    height:px(225);
    background-image: url("../assets/donghua.gif");
    background-size: cover;
  }

</style>
