import Vue from 'vue'
import VCharts from 'v-charts'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
Vue.use(VCharts)

export default {
  data () {
    return {
      pubSetting: {
        height: '100%'
      }
    }
  }
}
