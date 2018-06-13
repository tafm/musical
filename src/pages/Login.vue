<template lang="pug">
  div
    a(href="https://musiroots.herokuapp.com/login") Logar com spotfy
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
