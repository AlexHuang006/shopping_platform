import request from '@/utils/request'

// 加入购物车请求方法
export const addCart = (goodsId, goodsNum, goodsSkuId) => {
  return request.post('/cart/add', {
    goodsId,
    goodsNum,
    goodsSkuId
  })
}

// 购物车商品列表请求方法
export const getCartList = () => {
  return request.get('/cart/list')
}