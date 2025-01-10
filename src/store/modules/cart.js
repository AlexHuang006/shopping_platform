import { getCartList } from '@/api/cart'
// 1. 构建 vuex cart模块 - 获取数据&存储
// 2. 挂载到 store 上面
export default {
  namespaced: true,
  state () {
    return {
      cartList: [] // 用于存储购物车的商品列表数据
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList // 用于定义同步的方法来更新状态。这里的 setCartList 将新的购物车数据直接赋值给 cartList。
    }
  },
  actions: { // 在组件中调用 dispatch 来触发 actions 中的代码。
    // 这里的 getCartAction 从服务器获取购物车数据，处理后通过 commit 调用 Mutation 来更新状态。
    async getCartList (context) { // 在 Vuex 的 actions 中，形参 context 是一个常规的命名，它表示了 dispatch 或 commit 方法的上下文环境。通过 context，你可以访问 Vuex 的 state 和 getters，并可以使用 commit 提交 mutation 或 dispatch 触发其他 action。
      const { data } = await getCartList()
      data.list.forEach(item => {
        item.isChecked = true // 为了当进入购物车页面时，选中全部商品
      })
      console.log(data)
      context.commit('setCartList', data.list)
    }
  },
  getters: {}
}

// 1. export default
// 表示这是一个 Vuex 模块，将其导出以便在 Vuex 的 store 中注册使用。

// 2. namespaced: true
// 启用了命名空间模式，使该模块的状态、getters、mutations 和 actions 可以被隔离，不与全局的 Vuex 命名冲突。
// 例如，如果这个模块叫 cart，则访问 getters 或触发 actions 时需要通过模块名访问，如：store.getters['cart/someGetter'] 或 store.dispatch('cart/someAction')。

// 3. state ()
// 这是模块的状态，定义了这个模块需要管理的数据。
// 这里 state 是一个函数，返回一个对象。这样做是为了在模块被复用时，每个模块实例都有独立的数据，而不是共享一个对象。
// 当前的 state 中只有一个属性：cartList，它是一个空数组，用于存储购物车的商品数据。

// 4. mutations
// 用于定义同步修改 state 的方法。
// 这个对象通常包含许多方法，每个方法可以修改 state 中的特定属性。
// 当前 mutations 是空的，意味着还没有定义修改 cartList 的逻辑。

// 5. actions
// 用于定义异步操作（如 API 调用），然后通过调用 mutations 修改状态。
// 当前 actions 是空的，还没有定义异步操作逻辑。

// 6. getters
// 用于定义对 state 数据的计算属性，类似于 Vue 的 computed。
// 当前 getters 也是空的，还没有定义任何派生状态。
