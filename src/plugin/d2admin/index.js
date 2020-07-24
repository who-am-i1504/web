// Element
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import D2Crud from 'd2-crud-x'
import D2Crud from '@/d2crud'
import '@/d2crud'
// flex 布局库
import 'flex.css'
// 组件
import '@/components'
// svg 图标
import '@/assets/svg-icons'
// 国际化
import i18n from '@/i18n.js'

// 功能插件
import pluginError from '@/plugin/error'
import pluginLog from '@/plugin/log'
import pluginOpen from '@/plugin/open'
import { d2CrudPlus } from 'd2-crud-plus'
import request from '../axios'

export default {
  async install (Vue, options) {
    // 设置为 false 以阻止 vue 在启动时生成生产提示
    // https://cn.vuejs.org/v2/api/#productionTip
    Vue.config.productionTip = false
    // 当前环境
    Vue.prototype.$env = process.env.NODE_ENV
    // 当前的 baseUrl
    Vue.prototype.$baseUrl = process.env.BASE_URL
    // 当前版本
    Vue.prototype.$version = process.env.VUE_APP_VERSION
    // 构建时间
    Vue.prototype.$buildTime = process.env.VUE_APP_BUILD_TIME
    // Element
    Vue.use(ElementUI, {
      i18n: (key, value) => i18n.t(key, value)
    })
    // 插件
    Vue.use(pluginError)
    Vue.use(pluginLog)
    Vue.use(pluginOpen)
    Vue.use(D2Crud)
    Vue.use(d2CrudPlus, {
      getRemoteDictFunc(url){
        return request({
          url:url,
          method:'get'
        }).then(ret => {
          return ret.data
        })
      }
    })
  }
}
