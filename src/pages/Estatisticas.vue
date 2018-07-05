<template lang="pug">
  .container
    .content
      h2 Estatísticas
      div(v-show="carregando") Carregando dados...
      div(v-show="!carregando")
        .row
          .col-lg-3.col-6
            | Artistas/bandas diferentes:&nbsp;
          .col-lg-2.col-6
            span.valor {{ dados.qtdArtistas }}
        .row
          .col-lg-3.col-6
            | Países diferentes de origem:&nbsp;
          .col-lg-2.col-6
            span.valor {{ dados.qtdPaises }}
        .row
          .col-lg-3.col-6
            | Bandas/grupos:&nbsp;
          .col-lg-2.col-6
            span.valor {{ dados.qtdBandas }}
        .row
          .col-lg-3.col-6
            | Artistas/solo:&nbsp;
          .col-lg-2.col-6
            span.valor {{ dados.qtdPessoas }}
        .row
          .col-lg-3.col-6
            | Artista em mais playlists:&nbsp;
          .col-lg-2.col-6
            span.valor {{ dados.maisFrequente.nome }} ({{ dados.maisFrequente.qtd }})

</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'pageEstatisticas',
  data () {
    return {
      carregando: false
    }
  },
  beforeMount () {
    this.carregando = true
    this.$vs.loading()
    this.checaCache().then(() => {
      this.$vs.loading.close()
      this.carregando = false
    })
  },
  computed: {
    dados () {
      if (this.artistas.length === 0) {
        return {
          qtdArtistas: 0,
          qtdPaises: 0,
          qtdBandas: 0,
          qtdPessoas: 0,
          maisFrequente: {
            nome: 'null',
            qtd: 0
          }
        }
      } else {
        // quantidade de artistas
        let qtdArtistas = this.artistas.length

        // quantidade de paises
        let qtdPaises = Object.keys(this.artistas.reduce((ac, a) => {
          if (a.country) {
            ac[a.country] = true
          }
          return ac
        }, {})).length

        // quantidade de bandas
        let qtdBandas = this.artistas.reduce((ac, a) => {
          if (a.type && a.type === 'Group') {
            ac++
          }
          return ac
        }, 0)

        // quantidade de pessoas
        let qtdPessoas = this.artistas.reduce((ac, a) => {
          if (a.type && a.type === 'Person') {
            ac++
          }
          return ac
        }, 0)

        let maisFrequente = this.artistas.reduce((ac, a) => {
          if (a.qtd_playlists > ac.qtd_playlists) {
            return {
              'nome': a.name,
              'qtd': a.qtd_playlists
            }
          } else {
            return ac
          }
        }, {
          'nome': this.artistas[0].name,
          'qtd': this.artistas[0].qtd_playlists
        })

        return {
          qtdArtistas,
          qtdPaises,
          qtdBandas,
          qtdPessoas,
          maisFrequente
        }
      }
    },
    artistas () {
      let artistasAll = {} // pra tirar duplicidade entre as playlists
      for (let p in this.getArtistas) {
        for (let a in this.getArtistas[p]) {
          if (artistasAll[a]) {
            artistasAll[a].qtd_playlists++
          } else {
            artistasAll[a] = this.getArtistas[p][a]
            artistasAll[a].qtd_playlists = 1
          }
        }
      }
      let artistas = []
      for (let a in artistasAll) {
        artistas.push(artistasAll[a])
      }
      return artistas
    },
    ...mapGetters([
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
  .valor {
    font-weight: bold;
  }
</style>
