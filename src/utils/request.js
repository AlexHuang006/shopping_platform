import axios from 'axios'
import { Toast } from 'vant' // 从vant中导入toast提示组件
import store from '@/store'

// 创建一个axios实例对象（instance）
const request = axios.create({
  baseURL: 'http://smart-shop.itheima.net/index.php?s=/api',
  timeout: 5000,
  headers: {
    platform: 'H5'
  }
})

// 自定义配置请求，使用axios模块里面的内置方法
// 添加请求拦截器
request.interceptors.request.use(function (config) {
  // 发送请求前，需要提前做的事情
  // 添加请求loading的toast提示
  Toast.loading({
    message: 'Loading...',
    forbidClick: true, // 禁止背景点击
    loadingType: 'spinner', // 样式
    duration: 0 // toast的持续时间，0为一直持续
  })

  // 在请求拦截器中添加统一headers参数：token
  const token = store.getters.token // 从vuex中拿到token数据
  if (token) {
    config.headers['Access-Token'] = token
  }
  return config
}, function (error) {
  // 对请求发送错误时做的事情
  return Promise.reject(error)
})

// 添加响应拦截器
request.interceptors.response.use(function (response) {
  // 对请求成功后得到的响应数据做点什么
  // 设置为response.data，直接预处理返回的数据，避免层级过深，axios默认会多包一层data
  // return response.data
  const res = response.data
  if (res.status !== 200) {
    Toast(res.message)
    return Promise.reject(res.message)
  } else {
    // 请求响应成功后清除toast提示。
    Toast.clear()
  }
  return res
}, function (error) {
  // 对请求失败响应错误做点什么
  return Promise.reject(error)
})

export default request
