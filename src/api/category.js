import request from '@/utils/request'

// 获取商品分类数据方法
export const getCategoryData = () => {
  return request.get('/category/list')
}
