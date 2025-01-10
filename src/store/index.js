import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import cart from './modules/cart'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  getters: {
    token (state) {
      return state.user.userInfo.token // 配置全局getters数据
    }
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    user, // 注册user
    cart // 注册cart
  }
})
