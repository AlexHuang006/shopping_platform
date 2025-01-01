import axios from 'axios'

// 创建一个axios实例（instance）
const request = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000
})

// 自定义配置
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 发送请求前，需要提前做的事情
  return config
}, function (error) {
  // 对请求发送错误时做的事情
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对请求后得到的响应数据做点什么
  // 设置为response.data，直接预处理返回的数据，避免层级过深，axios默认会多包一层data
  return response.data
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

export default request
