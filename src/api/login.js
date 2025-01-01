// login全部的借口请求模块
import request from '@/utils/request'

// 1. 获取图形验证码请求函数
export const getPicCode = () => {
  return request.get('/captcha/image', {
    headers: { platform: 'H5' }
  })
}
