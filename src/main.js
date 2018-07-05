// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import Vuesax from 'vuesax'
import 'vuesax/dist/vuesax.css'

Vue.use(Vuesax)

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'https://musiroots.herokuapp.com'

axios.interceptors.request.use(function (request) { // interceptor para inserir token nas requisições
  var token = store.getters['getToken'].value
  if (token) {
    request.headers.access_token = token
  }
  return request
}, function (error) {
  return Promise.reject(error)
})

axios.interceptors.response.use(null, (error) => {
  if (error.config && error.response && error.response.status === 401) {
    return store.dispatch('updateToken').then((token) => {
      error.config.headers.access_token = token.value
      return axios.request(error.config)
    })
  }
  return Promise.reject(error)
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
