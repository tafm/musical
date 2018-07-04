<template lang="pug">
  div
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'pageAuth',
  async beforeMount () {
    var token = {
      value: this.$route.params.token,
      expires: this.$route.params.expires,
      refresh: this.$route.params.refresh
    }
    try {
      await this.armazenaToken(token)
      this.$router.push('/playlists')
    } catch (e) {
      this.$router.push('/')
    }
  },
  methods: {
    ...mapActions([
      'armazenaToken'
    ])
  }
}
</script>

<style>

</style>
