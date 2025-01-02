// 用于存入本地storage时，使用的键名。
const INFO_KEY = 'shopping_user_info'

// 存入（设置）个人信息至本地
export const setInfo = (info) => {
  // 传入键名和数据，同时转换成JSON格式
  localStorage.setItem(INFO_KEY, JSON.stringify(info))
}

// 从本地获取个人信息
export const getInfo = () => {
  const result = localStorage.getItem(INFO_KEY)
  return result ? JSON.parse(result) : { token: '', userId: '' } // 先判断本地是否有数据，如果有就将数据从JSON转换成对象并传出，没有数据就传出空对象数据。
}

// 移除个人信息本地数据
export const removeInfo = () => {
  localStorage.removeItem(INFO_KEY)
}
