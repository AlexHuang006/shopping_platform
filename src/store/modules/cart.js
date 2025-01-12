import { changeCount, getCartList, delSelect } from '@/api/cart'
import { Toast } from 'vant'
// 1. 构建 vuex cart模块 - 获取数据&存储
// 2. 挂载到 store 上面
export default {
  namespaced: true,
  state () {
    return {
      cartList: [] // 用于存储购物车的商品列表数据，在组件中使用辅助函数mapstate并在computed（计算属性）中拿到此列表数据
    }
  },
  mutations: {
    setCartList (state, newList) {
      state.cartList = newList // 用于定义同步的方法来更新状态。这里的 setCartList 将新的购物车数据直接赋值给 cartList。
    },

    toggleCheck (state, goodsId) { // 此方法用于将选中的购物车中的商品的选中状态取反
      const goods = state.cartList.find(item => item.goods_id === goodsId) // 先根据页面传过来的商品ID找到对应的数据
      goods.isChecked = !goods.isChecked // 将对应商品ID的isChecked状态取反，达到选中or未选中的效果
    },

    // 配合页面中的“全选”按钮2
    toggleAllCheck (state, flag) {
      state.cartList.forEach(item => {
        item.isChecked = flag
      })
    },

    // 配合更新购物车商品列表数据
    changeCount (state, { goodsId, goodsNum }) {
      // 先根据商品Id找出原数据中对应的商品，然后修改goodsNum
      const goods = state.cartList.find(item => item.goods_id === goodsId)
      goods.goods_num = goodsNum
    }
  },

  actions: { // 在组件中调用 dispatch 来触发 actions 中的代码。
    // 这里的 getCartAction 从服务器获取购物车数据，处理后通过 commit 调用 Mutation 来更新状态。
    async getCartAction (context) { // 在 Vuex 的 actions 中，形参 context 是一个常规的命名，它表示了 dispatch 或 commit 方法的上下文环境。通过 context，你可以访问 Vuex 的 state 和 getters，并可以使用 commit 提交 mutation 或 dispatch 触发其他 action。
      const { data } = await getCartList()
      data.list.forEach(item => {
        item.isChecked = true // 给数据中每一项添加复选框选中状态的数据，为了当进入购物车页面时，选中全部商品
      })
      // console.log(data)
      context.commit('setCartList', data.list) // 使用 commit 提交 mutation
    },

    // 更新购物车商品列表方法
    async changeCountAction (context, obj) {
      const { goodsId, goodsNum, goodsSkuId } = obj

      // 先修改本地购物车商品列表数据，但修改本地vuex数据，需要在mutations中定义一个方法
      context.commit('changeCount', { goodsId, goodsNum })

      // 再同步给后台
      await changeCount(goodsId, goodsNum, goodsSkuId)
    },

    // 删除购物车商品方法
    async delSelect (context) {
      // 1. 选出被选中的商品，并找出对应的商品ID存到一个数组中
      const cartIds = context.getters.selCartList.map(item => item.id)
      await delSelect(cartIds)
      Toast('删除成功')

      // 重新拉取最新购物车数据
      context.dispatch('getCartAction')
    }
  },
  getters: { // 提供数据的计算属性(计算属性就是比如数组的length方法，直接返回数组长度),然后在组件页面里，使用mapGetters辅助函数使用
    // 购物车中所有商品的累加总数
    cartTotal (state) {
      return state.cartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 购物车中被选中的商品列表
    selCartList (state) {
      return state.cartList.filter(item => item.isChecked)
    },
    // 选中商品的总数
    selCount (state, getters) {
      return getters.selCartList.reduce((sum, item) => sum + item.goods_num, 0)
    },
    // 选中商品的总价
    selPrice (state, getters) {
      return getters.selCartList.reduce((sum, item) => {
        return sum + item.goods_num * item.goods.goods_price_min
      }, 0).toFixed(2)
    },

    // 配合页面中的“全选”按钮1
    isAllChecked (state) {
      return state.cartList.every(item => item.isChecked) // 表示cartList中isChecked的每一项都为true时，return结果为true
    }
  }
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
