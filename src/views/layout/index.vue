<template>
  <div>
    <!-- 二级路由出口 -->
    <router-view></router-view>

    <van-tabbar route active-color="#ee0a24" inactive-color="#000">
      <van-tabbar-item  to = '/home' icon="wap-home-o">Home</van-tabbar-item>
      <van-tabbar-item  to = '/category' icon="apps-o">Catagories</van-tabbar-item>
      <van-tabbar-item  to = '/cart' icon="shopping-cart-o" :badge="cartTotal > 99 ? '99+' : cartTotal">Cart</van-tabbar-item>
      <van-tabbar-item  to = '/user' icon="user-o">You</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex' // 引入vuex数据
export default {
  name: 'LayoutIndex',

  computed: {
    ...mapGetters('cart', ['cartTotal'])
  },

  created () {
    if (this.$store.getters.token) {
      this.$store.dispatch('cart/getCartAction')
    }
  }
}
</script>

<style>

</style>
