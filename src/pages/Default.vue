<template lang="pug">
  #wrapper
    #topmenu
      img(src="@/assets/img/logotop.png", alt="", srcset="")
      .title
        h5
          | MUSIROOTS
    .container-fluid
      .content
        router-view/
</template>

<script>
export default {
  mounted () {
    $('body').css('background-color', '#FBFBFB')
  }
}
</script>

<style lang="stylus">
  #wrapper {
    background-color: #FBFBFB;
  }
  #topmenu {
    img {
      width: 50px;
      float: left;
      margin-left: 1rem;
    }
    .title {
      color: #FFFFFF;
      padding: 1rem;
      float: left;
    }
    height: 60px;
    background-color: #c0392b;
  }
  .content {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
</style>
