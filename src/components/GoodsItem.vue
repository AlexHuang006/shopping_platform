<template>
<!-- 判断是否存在item数据，如果有就渲染一下内容 -->
<!-- 配合动态路由传参数，将点击商品跳转页面时，将商品ID传入 -->
  <div v-if= "item.goods_id" class="goods-item" @click="$router.push(`/prodetail/${item.goods_id}`)">
    <div class="left">
      <img :src="item.goods_image" alt="">
    </div>
    <div class="right">
      <p class="tit text-ellipsis-2">
        {{item.goods_name}}
      </p>
      <p class="count">已售{{item.goods_sales}}件</p>
      <p class="price">
        <span class="new">¥{{item.goods_price_min}}</span>
        <span class="old">¥{{item.goods_price_max}}</span>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'GoodsItem',
  props: { // 子组件接收父组件传递的数据
    item: {
      type: Object,
      default: () => { // 是一个默认值函数，它为 props 提供了一个默认的值。当父组件没有传递数据时，子组件就会使用这个默认值。
        return {}
      }
    }
  }
}
</script>

<style lang = "less" scoped>
  .goods-item {
    height: 148px;
    margin-bottom: 6px;
    padding: 10px;
    background-color: #fff;
    display: flex;
    .left {
      width: 127px;
      img {
        display: block;
        width: 100%;
      }
    }
    .right {
      flex: 1;
      font-size: 14px;
      line-height: 1.3;
      padding: 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;

      .count {
        color: #999;
        font-size: 12px;
      }
      .price {
        color: #999;
        font-size: 16px;
        .new {
          color: #f03c3c;
          margin-right: 10px;
        }
        .old {
          text-decoration: line-through;
          font-size: 12px;
        }
      }
    }
  }
</style>
