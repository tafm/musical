<template lang="pug">
  div
    #map
    #selecaoGeneros
      #accordion
        .card(v-for="l in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']")
          .card-header
            button.btn.btn-link(data-toggle="collapse" v-bind:data-target="'#collapse' + l" aria-expanded="true" v-bind:aria-controls="'collapse' + l")
              | {{ l }}
          .collapse(v-bind:class="{show: l === 'A'}" v-bind:id="'collapse' + l" aria-labelledby="headingOne" data-parent="#accordion")
            .card-body
              ul
                li(v-for="gen in listaGeneros.filter(g => g[0] == l.toLowerCase())" v-on:click="genero = gen" v-bind:class="{selected: gen === genero}")
                  | {{ gen }}
    #alert
      .alert.alert-warning Quantidade de artistas de determinado gênero musical (baseado nos dados de todos os usuários que já passaram pelo MusiRoots)
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'pageGeneros',
  data () {
    return {
      map: null,
      genero: '#',
      generos: null
    }
  },
  async beforeMount () {
    // try {
    //   this.$vs.loading()
    //   const {data: generos} = await this.$axios.get('/genres')
    //   this.generos = generos
    // } catch (e) {
    // } finally {
    //   this.$vs.loading.close()
    // }
  },
  mounted () {
    this.plota()
  },
  computed: {
    listaGeneros () {
      if (this.getGeneros === null) {
        return []
      }
      let generos = Object.keys(this.getGeneros).reduce((ac, a) => {
        for (let g in this.getGeneros[a]) {
          ac[g] = true
        }
        return ac
      }, {})
      return Object.keys(generos)
    },
    artistasGeneros () {
      if (this.getGeneros === null) {
        return {}
      }
      let artistasGeneros = Object.keys(this.getGeneros).reduce((ac, a) => {
        let generoPais = Object.keys(this.getGeneros[a])
        if (generoPais.some(g => g === this.genero)) {
          if (ac[a]) {
            ac[a] += this.getGeneros[a][this.genero]
          } else {
            ac[a] = this.getGeneros[a][this.genero]
          }
        }
        return ac
      }, {})
      return artistasGeneros
    },
    ...mapGetters([
      'getGeoCountries',
      'getCodeCountries',
      'getGeneros'
    ])
  },
  methods: {
    plota () {
      let self = this
      this.$vs.loading()
      this.checaCache().then(() => {
        this.$vs.loading.close()
        self.map = L.map('map', { zoomControl: false, minZoom: 2, maxZoom: 2 }).setView([51.505, -0.09], 2)
        L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
          attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
          maxZoom: 18,
          id: 'mapbox.streets',
          accessToken: 'pk.eyJ1IjoibW9hYmUxMjQiLCJhIjoiY2poc2l6bGo2MDNmaTNrcnYzajZ1eWhjeCJ9.j8grDdlxIHuUggvcLKpTBw'
        })

        let maxArtistas = Object.keys(this.artistasGeneros).reduce((ac, a) => { // descobrir o número máximo de artistas em um país para a escala de cores do d3
          if (this.artistasGeneros[a] > ac) {
            ac = this.artistasGeneros[a]
          }
          return ac
        }, 0)

        let cores = d3.scaleLinear().domain([0, maxArtistas])
          .interpolate(d3.interpolateHcl)
          .range([d3.rgb('#ffe7da'), d3.rgb('#ff6523')])

        L.geoJSON(this.getGeoCountries, {
          style: function (feature) {
            let qtd = self.artistasGeneros[self.getCodeCountries[feature.id]]
            let cor = qtd ? cores(qtd) : '#FFFFFF'
            return {
              fillColor: feature.id === '---' ? '#ddd' : cor, // ignora oceano.
              fillOpacity: 1,
              stroke: true,
              color: 'grey',
              weight: feature.id === '---' ? 0 : 0.2
            }
          }
        }).addTo(self.map)
      })
    },
    ...mapActions([
      'checaCache'
    ])
  },
  watch: {
    genero () {
      this.map.remove()
      this.plota()
    }
  }
}
</script>

<style lang="stylus" scoped>
  #map {
    height: calc(100vh - 60px);
  }
  #alert {
    width: calc(100% - 315px);
    position: absolute;
    bottom: 0;
    z-index: 10000;
  }
  #selecaoGeneros {
    overflow-y : scroll;
    position: absolute;
    top: 60px;
    right: 0px;
    height: calc(100vh - 60px);
    width: 300px;
    background-color: #333333;
    z-index: 10000;
    .card {
      color: #FFFFFF;
      border: 0px;
      .card-header {
        padding: 0px;
        background-color: #333333;
        button {
          color: #FFFFFF;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
          padding: 1rem;
        }
      }
      .card-body {
        background-color: #222222;
        ul {
          li {
            box-sizing: border-box;
            padding: 0.3rem;
            list-style: none;
            cursor: pointer;
          }
          li:hover {
            background-color: #444444;
          }
          .selected {
            cursor: default;
            background-color: lighten(#ff6523, 20%);
            color: #000000
          }
          .selected:hover {
            background-color: lighten(#ff6523, 20%);
            color: #000000
          }
        }
      }
    }
  }
</style>
