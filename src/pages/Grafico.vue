<template lang="pug">
  .container
    .content
      h2 Gráfico
      .row
        .col-12#bargraph
          div(v-if="carregando") Carregando dados...
          svg
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'pageGrafico',
  data () {
    return {
      carregando: false
    }
  },
  mounted () {
    this.carregando = true
    this.$vs.loading()
    this.checaCache().then(() => {
      this.$vs.loading.close()
      this.carregando = false
      let artistas = {}
      for (let p in this.getArtistas) {
        for (let a in this.getArtistas[p]) {
          let artista = this.getArtistas[p][a]
          if (artista.area) {
            if (artistas[artista.area]) {
              artistas[artista.area]++
            } else {
              artistas[artista.area] = 1
            }
          }
        }
      }
      let dados = []
      for (let key in artistas) {
        dados.push({
          pais: key,
          artistas: artistas[key]
        })
      }
      this.plota(dados.sort((a, b) => a.artistas - b.artistas))
    })
  },
  computed: {
    ...mapGetters([
      'getArtistas'
    ])
  },
  methods: {
    plota (dados) {
      let margin = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
      }
      let width = 800
      let height = dados.length * 50
      let realwidth = width - margin.left - margin.right // tamanho máximo dos componentes dentro do SVG respeitando a margem
      let realheight = height - margin.top - margin.bottom

      let margemnomes = 100
      let widthgrafico = realwidth - margemnomes
      let heightgrafico = realheight

      let svg = d3.select('#bargraph')
        .select('svg')

      svg.style('width', width + 'px')
        .style('height', height + 'px')

      svg = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      let grafico = svg.append('g')
        .attr('transform', 'translate(' + margemnomes + ', 0)')

      // adiciona o eixo X
      let x = d3.scaleLinear()
        .domain([0, d3.max(dados, (s) => s.artistas)])
        .range([0, widthgrafico])

      grafico.append('g')
        .attr('transform', 'translate(0,' + heightgrafico + ')')
        .call(d3.axisBottom(x))

      // adiciona o eixo Y

      let y = d3.scaleBand()
        .rangeRound([heightgrafico, 0])
        .domain(dados.map(function (d) { return d.pais }))
        .paddingInner(0.20)

      grafico.append('g')
        .call(d3.axisLeft(y))

      // adiciona barras

      var cores = d3.scaleOrdinal()
        .domain(dados.map(function (d) { return d.pais }))
        .range(d3.schemeCategory10)
        // .range(['#e9724d', '#d6d727', '#92cad1', '#79ccb3', '#868686'])

      grafico.append('g')
        .selectAll('rect')
        .data(dados)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', 0)
        .attr('y', function (dados, index) { return y(dados.pais) })
        .attr('width', function (dados) { return x(dados.artistas) })
        .attr('height', y.bandwidth())
        .attr('fill', (dados) => { return cores(dados.pais) })
        .attr('stroke', 'black')
    },
    ...mapActions([
      'checaCache'
    ])
  }
}
</script>

<style lang="stylus">

</style>
