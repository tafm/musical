import localforage from 'localforage'
import centroids from './centroids.json'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    token: null,
    'centroids': centroids.reduce((P, a, index, array) => { P[a.ISO3136] = a; return P }, {})
  },
  mutations: {
    setToken (state, token) {
      state.token = token
    }
  },
  getters: {
    getToken (state) {
      return state.token
    },
    getCentroids (state) {
      return state.centroids
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
    }
  }
})
