import Vue from 'vue'
import Router from 'vue-router'
import index from '@/components/index'
import recordChart from '@/components/recordChart'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'index',
      component: index
    },
    {
      path: '/record',
      name: 'recordChart',
      component: recordChart
    }
  ]
})
