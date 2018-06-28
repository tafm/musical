<template lang="pug">
  .container-fluid.p-0
    .row.w-100
      .col-lg-12
        #map
      .col-lg-3.list
        .listaartistas
          div
            div(v-for="(artista, key) in artistas")
              .artista(v-bind:class="{active: artista.hover}")
                span.flag-icon(v-bind:class="['flag-icon-' + artista.country.toLowerCase()]") {{ artista.country ? '' : '?' }}
                span(v-bind:style="{'text-decoration': artista.country ? 'none' : 'line-through'}") {{ key }}
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'pagePlaylist',
  data () {
    return {
      artistas: {},
      map: null
    }
  },
  async beforeMount () {
    try {
      var {data: artistas} = await this.$axios.get(`artists/${this.$route.params.iduser}/${this.$route.params.idplaylist}`)
      for (var a in artistas) {
        artistas[a].hover = false
      }
      this.artistas = artistas
      this.marcacoes()
    } catch (e) {
      console.log(e)
    }
  },
  mounted () {
    var self = this
    this.mymap = L.map('map').setView([51.505, -0.09], 2)
    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox.streets',
      accessToken: 'pk.eyJ1IjoibW9hYmUxMjQiLCJhIjoiY2poc2l6bGo2MDNmaTNrcnYzajZ1eWhjeCJ9.j8grDdlxIHuUggvcLKpTBw'
    }).addTo(self.mymap)
    // var marker = L.marker([51.5, -0.09]).addTo(self.mymap)
    // var artistas = { 'Young Thug': { 'name': 'Young Thug', 'country': 'FR', 'area': 'France', 'year': '1987-12-24', 'type': 'Person' }, 'Camila Cabello': { 'name': 'Camila Cabello', 'country': 'US', 'area': 'United States', 'year': '1997-03-03', 'type': 'Person' }, 'Biltre': { 'name': '', 'country': '', 'area': '', 'year': '', 'type': '' } }
    this.marcacoes()
  },
  computed: {
    ...mapGetters([
      'getCentroids'
    ])
  },
  methods: {
    marcacoes () {
      // var self = this
      var countryes = {}
      for (var a in this.artistas) {
        var { country } = this.artistas[a]
        if (country) {
          if (!countryes[country]) {
            countryes[country] = true
            var { LAT, LONG } = this.getCentroids[country]
            var m = L.marker([LAT, LONG]).addTo(this.mymap)
            m.on('mouseover', ((n) => {
              return () => {
                for (var b in this.artistas) {
                  if (this.artistas[b].country === n) {
                    this.artistas[b].hover = true
                  }
                }
              }
            })(country))
            m.on('mouseout', ((n) => {
              return () => {
                for (var b in this.artistas) {
                  if (this.artistas[b].country === n) {
                    this.artistas[b].hover = false
                  }
                }
              }
            })(country))
          }
        }
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
  #map {
    height: calc(100vh - 60px);
  }
  .artista {
    box-sizing: border-box;
    padding: 1rem 1rem;
    border-bottom: 1px solid lighten(#333333, 20%);
  }
  .active {
    background-color: lighten(#333333, 20%)
  }
  .listaartistas {
    height: calc(100vh - 60px);
    overflow-y : scroll;
    box-sizing: border-box;
    color: #FFFFFF;
    background-color: #333333;
    .artista {
      .flag-icon {
        margin-right: 1rem;
      }
    }
  }
  .list{
    position: absolute;
    right: 0;
    z-index: 9999;
    padding: 0px;
  }
  .p-0{
    padding: 0px;
  }
  .w-100{
    width: 100%;
  }
</style>
