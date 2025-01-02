import { setInfo, getInfo } from '@/utils/storage' // 导入存取本地数据的两个方法，导入方法用{}

// 新建 vuex user 模块 =》 挂载到 vuex 上 =》提供 mutations =》 页面中 commit 调用
export default {
  namespaced: true,
  state () { // vuex 中提供和保存数据
    return {
      // user token
      userInfo: getInfo() // 优先从本地获取用户信息，方法中有判断，如何本地没有数据的场景
    }
  },

  mutations: { // vuex 中修改数据的方法
    // 所有mutations中的方法第一个参数都是state
    // 修改state中userInfo数据的方法
    setUserInfo (state, obj) {
      state.userInfo = obj // 将数据存入vuex中状态管理
      setInfo(obj) // 将数据存入本地
    }
  },
  actions: {}, // vuex 异步async操作
  getters: {} // vuex 基于state中数据的属性操作
}
