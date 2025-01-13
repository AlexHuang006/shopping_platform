import request from '@/utils/request'

// 请求获取用户收获地址列表方法
export const getAddressList = () => {
  return request.get('/address/list')
}
