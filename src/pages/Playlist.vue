<template lang="pug">
  .container-fluid.p-0
    #map
    .list
      .listaartistas
        div(v-if="artistaSelecionado == null")
          div
            .pais(v-if="Object.keys(artistasFiltrados).length > 0")
              span.flag-icon(v-bind:class="'flag-icon-' + artistasFiltrados[Object.keys(artistasFiltrados)[0]].country.toLowerCase()")
              span {{ getNameCountries[artistasFiltrados[Object.keys(artistasFiltrados)[0]].country] }} ({{ Object.keys(artistasFiltrados).length }})
          div(v-for="(artista, key) in artistasFiltrados" v-on:click="artistaSelecionado = artista")
            //- atualmente este bind nem é realmente necessário, pois só mostra na lista artistas que tem informações de país
            .artista(v-bind:class="{temartista: artista.name}")
              // span.flag-icon(v-bind:class="['flag-icon-' + artista.country.toLowerCase()]") {{ artista.country ? '' : '?' }}
              span(v-bind:style="{'text-decoration': artista.country ? 'none' : 'line-through'}") {{ key }}
        div.artistaBox(v-else)
          button.btn.btn-dark.form-control(v-on:click="artistaSelecionado = null")
            i.fa.fa-arrow-left(style="margin-right: 0.5rem;")
            | Voltar
          #artistaImagem
            // img(src="~@/assets/img/unknown_dp.png")
            img(v-bind:src="artistaSelecionado.images.length > 0 ? artistaSelecionado.images[0].url : 'static/img/unknown_dp.png'")
            .spotify
              a(v-bind:href="artistaSelecionado.spotify_link" target="_blank")
                img(src="static/img/spotify_w.png")
                br
                | ouvir no spotify
          #artistaNome
            | {{ artistaSelecionado.name }}
          #artistaInfo
            .info(v-if="artistaSelecionado.country")
              span.tipo País de origem:
              span.valor &nbsp; {{ getNameCountries[artistasFiltrados[Object.keys(artistasFiltrados)[0]].country] }}
            .info(v-if="artistaSelecionado.year")
              span.tipo Ano de {{ artistaSelecionado.type == 'Person' ? 'nascimento:' : 'fundação:' }}
              span.valor &nbsp; {{ artistaSelecionado.year.split('-')[0] }}
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'pagePlaylist',
  data () {
    return {
      carregando: false,
      artistas: {},
      artistasFiltrados: {},
      map: null,
      artistaSelecionado: null
    }
  },
  beforeMount () {
  },
  mounted () {
    $('body').css('overflow-x', 'hidden')
    this.plota()
  },
  computed: {
    playlistURL () {
      return this.$route.params.idplaylist
    },
    ...mapGetters([
      'getCentroids',
      'getGeoCountries',
      'getCodeCountries',
      'getNameCountries',
      'getArtistas'
    ])
  },
  methods: {
    plota () {
      this.carregando = true
      this.$vs.loading()
      this.checaCache().then(() => {
        this.$vs.loading.close()
        this.carregando = false
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
        this.map = L.map('map', { zoomControl: false, minZoom: 2, maxZoom: 2 }).setView([51.505, -0.09], 2)
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
          .range([d3.rgb('#ffe7da'), d3.rgb('#ff6523')])

        L.geoJSON(this.getGeoCountries, {
          onEachFeature: function (feature, layer) {
            layer.on('click', function (e) {
              self.artistaSelecionado = null
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
            let cor = qtdartistas === 0 ? '#FFFFFF' : cores(qtdartistas)
            return {
              fillColor: feature.id === '---' ? '#ddd' : cor, // Default color of countries.
              fillOpacity: 1,
              stroke: true,
              color: 'grey', // Lines in between countries.
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
    playlistURL () {
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
  .artista {
    box-sizing: border-box;
    padding: 1rem 1rem;
    border-bottom: 1px solid lighten(#333333, 20%);
  }
  .temartista:hover {
    background-color: lighten(#333333, 20%);
    cursor: pointer;
  }
  .pais {
    box-sizing: border-box;
    font-size: 1.6rem;
    padding: 1rem 1rem;
    border-bottom: 1px solid lighten(#333333, 20%);
    .flag-icon {
      margin-right: 1rem;
    }
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
    .artistaBox {
      margin: 1rem;
      #artistaImagem {
        display: table;
        margin-top: 1rem;
        > img {
          float: left;
          box-sizing: border-box;
          width: 135px;
          border: 1px solid lighten(#000000, 10%);
          padding: 0.2rem;
          background-color: lighten(#333333, 30%);
        }
        .spotify {
          margin-top: 2rem;
          margin-left: 1rem;
          float: left;
          text-align: center;
          font-size: 0.8rem;
          img {
            width: 40px;
          }
          a {
            opacity: 0.5;
            color: #FFFFFF;
            text-decoration: none;
          }
          a:hover {
            opacity: 1;
          }
        }
      }
      #artistaNome {
        width: 100%;
        float: left;
        font-size: 2rem;
        font-family: arial;
        border-bottom: 1px solid lighten(#333333, 10%);
      }
      #artistaInfo {
        float: left;
        margin-top: 0.5rem;
        .info {
          float: left;
        }
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
