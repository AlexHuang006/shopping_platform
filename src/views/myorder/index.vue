<template>
  <div class="order">
    <van-nav-bar title="我的订单" left-arrow @click-left="$router.go(-1)" />
    <van-tabs v-model="active">
      <van-tab name="all" title="全部"></van-tab>
      <van-tab name="payment" title="待支付"></van-tab>
      <van-tab name="delivery" title="待发货"></van-tab>
      <van-tab name="received" title="待收货"></van-tab>
      <van-tab name="comment" title="待评价"></van-tab>
    </van-tabs>

    <!-- 父传子，将数据传给子组件:item -->
    <OrderListItem v-for="item in list" :key = "item.order_id" :item = "item"></OrderListItem>
  </div>
</template>

<script>
import OrderListItem from '@/components/OrderListItem.vue'
import { getMyOrderList } from '@/api/order'

export default {
  name: 'MyOrderIndex',
  components: {
    OrderListItem
  },

  data () {
    return {
      active: this.$route.query.dataType || 'all',
      page: 1,
      list: []
    }
  },

  methods: {
    async getOrderList () {
      const { data: { list } } = await getMyOrderList(this.active, this.page)
      list.data.forEach((item) => {
        item.total_num = 0
        item.goods.forEach(goods => {
          item.total_num += goods.total_num
        })
      })
      this.list = list.data
    }
  },

  watch: {
    // watch 是 Vue 的一个选项，用于监听某些数据或计算属性的变化。当被监听的属性发生变化时，watch 会执行指定的回调函数。
    active: {
      immediate: true, // 如果 immediate 被设置为 true，在监听开始时（组件初始化时），会立即触发一次回调函数。
      handler () {
        this.getOrderList()
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .order {
    background-color: #fafafa;
  }
  .van-tabs {
    position: sticky;
    top: 0;
  }
</style>
