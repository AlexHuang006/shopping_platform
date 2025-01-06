import request from '@/utils/request'

// 获取搜索的结果列表数据
export const getProList = (obj) => {
  const { sortType, SortPrice, categoryId, goodsName, page } = obj
  return request.get('/goods/list', {
    params: {
      sortType,
      SortPrice,
      categoryId,
      goodsName,
      page
    }
  })
}

// 获取商品详情数据
export const getProDetail = (goodsId) => {
  return request.get('/goods/detail', {
    params: {
      goodsId
    }
  })
}

// 获取商品评论数据
export const getProComments = (goodsId, limit) => {
  return request.get('/comment/listRows', {
    params: {
      goodsId,
      limit
    }
  })
}
