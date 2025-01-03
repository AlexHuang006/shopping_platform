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
