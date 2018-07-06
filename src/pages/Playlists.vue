<template lang="pug">
  .container
    .content
      h2 Selecionar playlist
      div(v-show="carregando") Carregando dados...
      .row
        .col-lg-4.col-md-6(v-for="playlist in playlists")
          .playlist.mt-3(v-on:click="showPlaylist(playlist.id)")
            img(v-bind:src="playlist.image", v-bind:alt="playlist.name")
            .desc
              span Nome: {{ playlist.name }}
              br
              span Faixas: {{ playlist.tracks }}

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'PagePlaylists',
  data () {
    return {
      carregando: false,
      playlists: [
        // { 'id': '21vfefwtw6pov4eceihz73f4a/0GxXJUcTPmvW9qwyoINRQA', 'name': 'fun', 'image': 'https://i.scdn.co/image/b9af9f6ffc29faee869aec9af7fcd72221fe4ee4', 'tracks': 2, 'link': 'https://open.spotify.com/user/21vfefwtw6pov4eceihz73f4a/playlist/0GxXJUcTPmvW9qwyoINRQA' },
        // { 'id': '21vfefwtw6pov4eceihz73f4a/0GxXJUcTPmvW9qwyoINRQA', 'name': 'fun', 'image': 'https://i.scdn.co/image/b9af9f6ffc29faee869aec9af7fcd72221fe4ee4', 'tracks': 2, 'link': 'https://open.spotify.com/user/21vfefwtw6pov4eceihz73f4a/playlist/0GxXJUcTPmvW9qwyoINRQA' },
        // { 'id': '21vfefwtw6pov4eceihz73f4a/0GxXJUcTPmvW9qwyoINRQA', 'name': 'fun', 'image': 'https://i.scdn.co/image/b9af9f6ffc29faee869aec9af7fcd72221fe4ee4', 'tracks': 2, 'link': 'https://open.spotify.com/user/21vfefwtw6pov4eceihz73f4a/playlist/0GxXJUcTPmvW9qwyoINRQA' },
        // { 'id': '21vfefwtw6pov4eceihz73f4a/0GxXJUcTPmvW9qwyoINRQA', 'name': 'fun', 'image': 'https://i.scdn.co/image/b9af9f6ffc29faee869aec9af7fcd72221fe4ee4', 'tracks': 2, 'link': 'https://open.spotify.com/user/21vfefwtw6pov4eceihz73f4a/playlist/0GxXJUcTPmvW9qwyoINRQA' }
      ]
    }
  },
  beforeMount () {
    this.carregando = true
    this.$vs.loading()
    this.checaCache().then(() => {
      this.$vs.loading.close()
      this.carregando = false
      this.playlists = this.getPlaylists
    })
    // try {
    //   const {data: playlists} = await this.$axios.get('playlists')
    //   this.playlists = playlists
    // } catch (e) {

    // }
  },
  computed: {
    ...mapGetters([
      'getPlaylists'
    ])
  },
  methods: {
    showPlaylist (id) {
      this.$router.push(`/playlist/${id}`)
    },
    all () {

    },
    ...mapActions([
      'checaCache'
    ])
  }
}
</script>

<style lang="stylus" scoped>
  .playlist {
    float: left;
    background-color: #FFFFFF;
    border: 2px solid lighten(#2c3e50, 80%);
    .desc {
      float: left;
      width: 75%;
      font: arial;
    }
    img {
      float: left;
      width: 25%;
      box-sizing: border-box;
      padding: 0.2rem;
      background-color: #FFFFFF;
    }
  }
  .playlist:hover {
    border: 2px solid lighten(#2c3e50, 20%);
    cursor: pointer;
  }
</style>
