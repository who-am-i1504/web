import Vue from 'vue'
import VCharts from '@/vCharts'
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
