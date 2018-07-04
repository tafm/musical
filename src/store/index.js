import localforage from 'localforage'
import centroids from './centroids.json'
import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null, // {value, refresh, expires}
    'centroids': centroids.reduce((P, a, index, array) => { P[a.ISO3136] = a; return P }, {}),
    playlists: null,
    artistas: null,
    datacache: null
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    },
    setPlaylists (state, playlists) {
      state.playlists = playlists
    },
    setArtistas (state, artistas) {
      state.artistas = artistas
      state.datacache = new Date()
    }
  },
  getters: {
    getToken (state) {
      return state.token
    },
    getCentroids (state) {
      return state.centroids
    },
    getPlaylists (state) {
      return state.playlists
    },
    getArtistas (state) {
      return state.artistas
    }
  },
  actions: {
    armazenaToken (context, token) {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            await localforage.setItem('token', token)
            context.commit('setToken', token)
            resolve()
          } catch (e) {
            reject(e)
          }
        })()
      })
    },
    checaTokenLocal (context) {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            var token = await localforage.getItem('token')
            context.commit('setToken', token)
            resolve()
          } catch (e) {
            reject(e)
          }
        })()
      })
    },
    checaCache (context) {
      return new Promise((resolve, reject) => {
        if (context.state.playlists == null || ((new Date().getTime() / 1000 / 60) - (context.state.datacache.getTime() / 1000 / 60)) > 60) { // se não tiver cache ou tiver mais de 60 minutos
          (async () => {
            try {
              const {data: playlists} = await axios.get('playlists')
              let artistas = {}
              for (let i = 0; i < playlists.length; i++) {
                const {data: playlist} = await axios.get(`artists/${playlists[i].id}`)
                artistas[playlists[i].id] = playlist
              }
              context.commit('setPlaylists', playlists)
              context.commit('setArtistas', artistas)
              resolve()
            } catch (e) {
              reject(e)
            }
          })()
        } else {
          resolve()
        }
      })
    },
    updateToken (context) {
      return new Promise((resolve, reject) => {
        (async () => {
          try {
            const {data: token} = await axios.post('refresh', {}, {
              headers: {
                refresh_token: context.state.token.refresh
              }
            })
            const {expires_in: expires, access_token: value} = token
            let novotoken = {
              value: value,
              refresh: context.state.token.refresh,
              expires: expires
            }
            await localforage.setItem('token', novotoken)
            context.commit('setToken', novotoken)
            resolve(novotoken)
          } catch (e) {
            reject(e)
          }
        })()
      })
    }
  }
})
