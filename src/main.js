import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//导入ElementUI
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//导入echarts
import * as echarts from 'echarts'
import moment from 'moment'
//全局过滤器
Vue.filter('dateFmt', (input, formatString = "YYYY-MM-DD") => {
    return moment(input).format(formatString)
})

Vue.config.productionTip = false

//注册ElementUI
Vue.use(ElementUI)

//注册echarts，使用方法为:this.$echarts
Vue.prototype.$echarts = echarts

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
