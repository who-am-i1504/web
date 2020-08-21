import axios from 'axios'
import util from '@/libs/util'
const FileDownload = require('js-file-download');

// 创建一个 axios 实例
const service = axios.create({
  baseURL: process.env.VUE_APP_API,
  timeout: 5000 // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在请求发送之前做一些处理
    const token = util.cookies.get('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['X-Token'] = token
    config['responseType'] = 'blob'
    config.headers['Access-Control-Allow-Origin'] = '*'
    // config.headers['Content-Type']
    return config
  },
  error => {
    // 发送失败
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // dataAxios 是 axios 返回数据中的 data
      const fileName = response.headers["content-disposition"].match(/filename=(.*)/)[1]
      
      return FileDownload(response.data, fileName);
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
