import Vue from 'vue'
import Router from 'vue-router'
import store from '../store'

Vue.use(Router)

var router = new Router({
  routes: [
    {
      path: '/auth/:token/:expires/:refresh',
      name: 'Auth',
      component: () => import('@/pages/Auth')
    },
    {
      path: '/',
      name: 'Login',
      component: () => import('@/pages/Login')
    },
    {
      path: '/',
      name: 'Content',
      component: () => import('@/layouts/Default'),
      meta: {
        protected: true // rotas que exigem token
      },
      children: [
        {
          path: 'playlists',
          name: 'Playlists',
          component: () => import('@/pages/Playlists'),
          meta: {
            protected: true
          }
        },
        {
          path: 'playlist/:iduser/:idplaylist',
          name: 'Playlist',
          component: () => import('@/pages/Playlist'),
          meta: {
            protected: true
          }
        },
        {
          path: 'grafico',
          name: 'Grafico',
          component: () => import('@/pages/Grafico'),
          meta: {
            protected: true
          }
        },
        {
          path: 'estatisticas',
          name: 'Estatisticas',
          component: () => import('@/pages/Estatisticas'),
          meta: {
            protected: true
          }
        }
      ]
    },
    {
      path: '*',
      component: () => import('@/pages/NotFound')
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(m => m.meta.protected)) {
    if (store.getters['getToken']) {
      next()
    } else {
      store.dispatch('checaTokenLocal').then(() => {
        if (store.getters['getToken']) {
          next()
        } else {
          router.push('/')
        }
      })
    }
  } else {
    next()
  }
})

export default router
