// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import global_ from './common/global'
import router from './router'
import VueScroller from 'vue-scroller'

Vue.use(VueScroller)
Vue.config.productionTip = false
Vue.prototype.GLOBAL = global_

router.afterEach((to,from,next) => {
  window.scrollTo(0,0);
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
