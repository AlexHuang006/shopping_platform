import request from '@/utils/request'

// 请求获取用户收货地址列表方法
export const getAddressList = () => {
  return request.get('/address/list')
}

// 添加收货地址
export const setAddress = () => {
  return request.post('/address/add', {
    form: {
      name: 'alex',
      phone: '16621302136',
      region: [
        {
          value: 782,
          label: '上海'
        },
        {
          value: 783,
          label: '上海市'
        },
        {
          value: 785,
          label: '徐汇区'
        }
      ],
      detail: '北京路1号楼8888室'
    }
  })
}
