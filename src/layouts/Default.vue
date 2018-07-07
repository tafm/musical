<template lang="pug">
  #wrapper
    #topmenu
      img(src="@/assets/img/logotop.png", alt="", srcset="")
      .title
        h5
          router-link(to="/playlist/all") MUSIROOTS
      nav.navbar.navbar-expand-lg.navbar-light
        //- a.navbar-brand(href="#") Navbar
        button.navbar-toggler(type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation")
          span.navbar-toggler-icon
        #navbarNavAltMarkup.collapse.navbar-collapse
          .navbar-nav
            router-link.a.nav-item.nav-link(to="/playlists") Playlists
            router-link.a.nav-item.nav-link(to="/grafico") Gráfico
            router-link.a.nav-item.nav-link(to="/estatisticas") Estatísticas
            router-link.a.nav-item.nav-link(to="/generos") Gêneros por país
    router-view/
</template>

<script>
export default {
  mounted () {
    $('body').css('background-color', '#FBFBFB')
  }
}
</script>

<style lang="stylus">
  #wrapper {
    background-color: #FBFBFB;
  }
  #topmenu {
    img {
      width: 48px;
      float: left;
      margin-left: 1rem;
    }
    .title {
      color: #FFFFFF;
      padding: 1rem;
      padding-bottom: 0px;
      float: left;
      a {
        color: #FFFFFF;
      }
    }
    .navbar-nav {
      a {
        color: #FFFFFF;
      }
      a:hover {
        text-decoration: underline;
      }
    }
    height: 60px;
    background-color: #c0392b;
  }
  .content {
    margin-top: 1rem;
    margin-bottom: 2rem;
  }
</style>
