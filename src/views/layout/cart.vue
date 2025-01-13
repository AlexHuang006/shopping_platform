<template>
  <!-- 用户已登录并购物车内有商品 -->
  <div class="cart" v-if = "isLogin && cartList.length > 0">
    <van-nav-bar title="Cart" fixed />
    <!-- 购物车开头 -->
    <div class="cart-title">
      <span class="all">共<i>{{ cartTotal || 0 }}</i>件商品</span>
      <!-- 注册点击事件，修改状态 -->
      <span class="edit" @click = "isEdit = !isEdit">
        <span v-if = "!isEdit">
          <van-icon name="edit" />
          编辑
        </span>
        <span v-else class="isedit">
          <van-icon name="delete-o" />
          完成
        </span>
      </span>
    </div>

    <!-- 购物车列表 -->
    <div class="cart-list">
      <div class="cart-item" v-for="item in cartList" :key="item.goods_id">
        <!-- 复选框vant组件 -->
        <van-checkbox @click = "toggleCheck(item.goods_id)" icon-size="18" :value = "item.isChecked"></van-checkbox>
        <div class="show">
          <img :src="item.goods.goods_image" alt="">
        </div>
        <div class="info">
          <span class="tit text-ellipsis-2">{{ item.goods.goods_name }}</span>
          <span class="bottom">
            <div class="price">¥ <span>{{ item.goods.goods_price_min }}</span></div>
            <!-- 在CountBox中，1.将商品数量从父传给子组件通过：value；2. 父组件定义了修改数据方法input，子组件通过$emit('input')，将子组件中的数据传给父 -->
            <!-- 另外，因为changeCount既要传value的值也要传父组件内的值，所以此处写成箭头函数的形式 -->
            <CountBox :value = "item.goods_num" @input = "value => changeCount(item.goods_id, value, item.goods_sku_id)" :proStock = "item.goods.stock_total"></CountBox>
          </span>
        </div>
      </div>
    </div>

    <div class="footer-fixed">
      <div  class="all-check" @click = "toggleAllCheck">
        <!-- 当购物车中的数据都是选中时，即数据中的isChecked都是true，则value设置为true即表示选中状态 -->
        <van-checkbox :value = "isAllChecked" icon-size="18"></van-checkbox>
        All
      </div>

      <!-- 需要在购物车中展示已选中商品的全部价格和全部数量。在vuex的cart模块中的getters中封装计算属性，因为数据都在vuex的cart模块中 -->
      <div class="all-total">
        <div class="price">
          <span>Total </span>
          <span>¥ <i class="totalPrice">{{ selPrice }}</i></span>
        </div>
        <!-- 底下按钮根据编辑状态变化 -->
        <div v-if="!isEdit" class="goPay" :class="{disabled: selCount === 0}" @click = 'goPay'>Check out({{ selCount }})</div>
        <div v-else class="delete" :class="{disabled: selCount === 0}" @click = "handleDel">Delete</div>
      </div>
    </div>
  </div>
  <!-- 空购物车处理 -->
  <div class="empty-cart" v-else>
    <van-nav-bar title="Cart" fixed />
    <img src="@/assets/empty.png" alt="">
    <div class="tips">
      Your Shopping Cart is empty
    </div>
    <div class="btn" @click="$router.push('/')">Start shopping</div>
  </div>
</template>

<script>
import CountBox from '@/components/CountBox.vue'
import { mapState, mapGetters } from 'vuex' // 先引入vuex中的辅助函数，为了从vuex中拿到数据
export default {
  name: 'CartIndex',

  data () {
    return {
      isEdit: false // 配合购物车模块的编辑模式的切换
    }
  },

  components: { // 注册子组件
    CountBox
  },

  computed: {
    isLogin () {
      return this.$store.getters.token // 从vuex中获取user token
    },

    ...mapState('cart', ['cartList']), // 使用辅助函数从vuex中的cart模块中拿到cartList这个数据
    ...mapGetters('cart', ['cartTotal', 'selCartList', 'selCount', 'selPrice', 'isAllChecked']) // 使用辅助函数从vuex中的cart模块中使用cartList的计算属性
  },

  created () { // 进入页面立即请求购物车商品列表数据，且用户已登录
    if (this.isLogin) {
      this.$store.dispatch('cart/getCartAction') // 在组件的方法中调用 dispatch， dispatch 触发actions中的异步方法，获取数据
    }
  },

  methods: {
    toggleCheck (goodsId) { // 配合购物车中商品选中状态切换的方法
      this.$store.commit('cart/toggleCheck', goodsId) // 调用vuex的cart模块中mutations中的修改数据的方法，并将新数据传过去
    },

    toggleAllCheck () { // 点击‘全选’按钮，调用此方法
      this.$store.commit('cart/toggleAllCheck', !this.isAllChecked) // 因为isAllChecked=true或false。所以将此值通过commit方法传回vuex的cart模块中，用于切换全选按钮的状态
    },

    // 此方法，将goodsId, goodsNum, goodsSkuId传给vuex的cart模块，用于更新购物车商品列表数据
    changeCount (goodsId, value, goodsSkuId) {
      this.$store.dispatch('cart/changeCountAction', {
        goodsId,
        goodsNum: value,
        goodsSkuId
      })
    },

    // 删除购物车商品
    handleDel () {
      this.$dialog.confirm({
        title: '温馨提示',
        message: '确定删除吗',
        confirmButtonText: '确定',
        cancelButtonText: '取消'
      })
        .then(() => {
          if (this.selCount === 0) return
          this.$store.dispatch('cart/delSelect')
          this.isEdit = false
        })
        .catch(() => {})
    },

    // 订单结算
    goPay () {
      if (this.selCount > 0) {
        this.$router.push({
          path: '/pay',
          query: {
            mode: 'cart',
            cartIds: this.selCartList.map(item => item.id).join(',')
          }
        })
        // console.log(1)
      }
    }
  },

  // 监视编辑状态，动态控制复选框状态
  watch: {
    isEdit (value) {
      if (value) {
        this.$store.commit('cart/toggleAllCheck', false)
      } else {
        this.$store.commit('cart/toggleAllCheck', true)
      }
    }
  }
}
</script>

<style lang = "less" scoped>
// 主题 padding
  .cart {
    padding-top: 46px;
    padding-bottom: 100px;
    background-color: #f5f5f5;
    min-height: 100vh;
    .cart-title {
      height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
      font-size: 14px;
      .all {
        i {
          font-style: normal;
          margin: 0 2px;
          color: #fa2209;
          font-size: 16px;
        }
      }
      .edit {
        .van-icon {
          font-size: 18px;
        }
        .isedit {
          color: #fa2f21;
        }
      }
    }

    .cart-item {
      margin: 0 10px 10px 10px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      background-color: #ffffff;
      border-radius: 5px;

      .show img {
        width: 100px;
        height: 100px;
      }
      .info {
        width: 210px;
        padding: 10px 5px;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .bottom {
          display: flex;
          justify-content: space-between;
          .price {
            display: flex;
            align-items: flex-end;
            color: #fa2209;
            font-size: 12px;
            span {
              font-size: 16px;
            }
          }
          .count-box {
            display: flex;
            width: 110px;
            .add,
            .minus {
              width: 30px;
              height: 30px;
              outline: none;
              border: none;
            }
            .inp {
              width: 40px;
              height: 30px;
              outline: none;
              border: none;
              background-color: #efefef;
              text-align: center;
              margin: 0 5px;
            }
          }
        }
      }
    }
  }

  .footer-fixed {
    position: fixed;
    left: 0;
    bottom: 50px;
    height: 50px;
    width: 100%;
    border-bottom: 1px solid #ccc;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;

    .all-check {
      display: flex;
      align-items: center;
      .van-checkbox {
        margin-right: 5px;
      }
    }

    .all-total {
      display: flex;
      line-height: 36px;
      .price {
        font-size: 14px;
        margin-right: 10px;
        .totalPrice {
          color: #fa2209;
          font-size: 18px;
          font-style: normal;
        }
      }

      .goPay, .delete {
        min-width: 120px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        background-color: #fa2f21;
        color: #fff;
        border-radius: 18px;
        &.disabled {
          background-color: #ff9779;
        }
      }
    }
  }
  .empty-cart {
    padding: 220px 30px;
    img {
      width: 140px;
      height: 92px;
      display: block;
      margin: 0 auto;
    }
    .tips {
      text-align: center;
      color: #666;
      margin: 30px;
    }
    .btn {
      width: 140px;
      height: 32px;
      line-height: 32px;
      text-align: center;
      background-color: #fa2c20;
      border-radius: 16px;
      color: #fff;
      display: block;
      margin: 0 auto;
    }
  }
</style>
