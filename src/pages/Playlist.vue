<template lang="pug">
  .container-fluid.p-0
    #map
    .list
      .listaartistas
        div
          div(v-for="(artista, key) in artistasFiltrados")
            .artista
              span.flag-icon(v-bind:class="['flag-icon-' + artista.country.toLowerCase()]") {{ artista.country ? '' : '?' }}
              span(v-bind:style="{'text-decoration': artista.country ? 'none' : 'line-through'}") {{ key }} {{ artista.year ? `(${artista.year.split('-')[0]})` : '' }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'pagePlaylist',
  data () {
    return {
      artistas: {},
      artistasFiltrados: {},
      map: null
    }
  },
  beforeMount () {
  },
  mounted () {
    $('body').css('overflow-x', 'hidden')

    this.checaCache().then(() => {
      let artistas = {}
      if (this.$route.params.iduser && this.$route.params.idplaylist) {
        artistas = this.getArtistas[`${this.$route.params.iduser}/${this.$route.params.idplaylist}`]
      } else {
        for (var p in this.getArtistas) {
          let artistasplaylist = this.getArtistas[p]
          for (var a in artistasplaylist) {
            artistas[a] = artistasplaylist[a]
          }
        }
      }
      // let artistas = this.getArtistas[`${this.$route.params.iduser}/${this.$route.params.idplaylist}`]
      let artistasdata = {}
      for (let a in artistas) {
        artistasdata[a] = {}
        for (let p in artistas[a]) {
          artistasdata[a][p] = artistas[a][p]
        }
      }
      this.artistas = artistasdata

      var self = this
      this.mymap = L.map('map', { zoomControl: false, maxZoom: 2 }).setView([51.505, -0.09], 2)
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoibW9hYmUxMjQiLCJhIjoiY2poc2l6bGo2MDNmaTNrcnYzajZ1eWhjeCJ9.j8grDdlxIHuUggvcLKpTBw'
      })

      // mapeia um pais na quantidade de artistas (país no formato alpha-2)

      let artistasPaises = Object.keys(this.artistas).reduce((ac, a) => {
        if (this.artistas[a].country) {
          if (!ac[this.artistas[a].country]) {
            ac[this.artistas[a].country] = 1
          } else {
            ac[this.artistas[a].country]++
          }
        }
        return ac
      }, {})

      // zera todos os outros pra ficar com cor de menor escala no mapa

      let paises = this.getGeoCountries.features
      paises.forEach(p => {
        let pais = this.getCodeCountries[p.id]
        if (!artistasPaises[pais]) {
          artistasPaises[pais] = 0
        }
      })

      // console.log(artistasPaises)

      let maxArtistas = Object.keys(artistasPaises).reduce((ac, a) => { // descobrir o número máximo de artistas em um país para a escala de cores do d3
        if (artistasPaises[a] > ac) {
          ac = artistasPaises[a]
        }
        return ac
      }, 0)

      let cores = d3.scaleLinear().domain([0, maxArtistas])
        .interpolate(d3.interpolateHcl)
        .range([d3.rgb('#FFFFFF'), d3.rgb('#ff6523')])

      L.geoJSON(this.getGeoCountries, {
        onEachFeature: function (feature, layer) {
          layer.on('click', function (e) {
            // if (feature.id === '---') { // clicou no oceano
            //   console.log('ocean')
            // } else {
            // }
            let artistas = {}
            for (let a in self.artistas) {
              if (self.artistas[a].country && self.artistas[a].country === self.getCodeCountries[feature.id]) {
                artistas[a] = {}
                for (let p in self.artistas[a]) {
                  artistas[a][p] = self.artistas[a][p]
                }
              }
            }
            self.artistasFiltrados = artistas

            if (Object.keys(artistas).length > 0) {
              $('.list').animate({
                right: 0
              }, 400)
            } else {
              $('.list').animate({
                right: -315
              }, 400)
            }
            // e = event
            // console.log(e)
            // You can make your ajax call declaration here
            // $.ajax(...
          })
        },
        style: function (feature) {
          let paisalpha2 = self.getCodeCountries[feature.id]
          let qtdartistas = artistasPaises[paisalpha2]
          let cor = cores(qtdartistas)
          return {
            fillColor: feature.id === '---' ? '#ddd' : cor, // Default color of countries.
            fillOpacity: 1,
            stroke: true,
            color: 'grey', // Lines in between countries.
            weight: feature.id === '---' ? 0 : 0.2
          }
        }
      }).addTo(self.mymap)
    })
  },
  computed: {
    ...mapGetters([
      'getCentroids',
      'getGeoCountries',
      'getCodeCountries',
      'getArtistas'
    ])
  },
  methods: {
    ...mapActions([
      'checaCache'
    ])
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
    width: 315px;
    top: 60px; // do menu
    position: absolute;
    right: -315px;
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
