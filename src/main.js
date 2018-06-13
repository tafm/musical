// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'

Vue.prototype.$axios = axios

axios.defaults.baseURL = 'https://musiroots.herokuapp.com'

axios.interceptors.request.use(function (request) { // interceptor para inserir token nas requisições
  var token = store.getters['getToken']
  if (token) {
    request.headers.access_token = token
  }
  return request
}, function (error) {
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
