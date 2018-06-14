<template lang="pug">
  .container
    .row
      .col-lg-12.text-center
        a(href="https://musiroots.herokuapp.com/login")
          img(src="@/assets/img/login.png")
</template>

<script>
export default {
  name: 'pageLogin',
  mounted () {
    $('body').css('background-color', '#c0392b')
  }
}
</script>

<style lang="stylus">

</style>
