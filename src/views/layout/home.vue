<template>
  <div class="home" v-if = !loading>
    <!-- 导航条 -->
    <van-nav-bar title="Smart Mall" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      :placeholder="searchList.placeholder"
      @click="$router.push('/search')"
    />

    <!-- 轮播图 -->
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
      <van-swipe-item v-for = "item in bannerList" :key = "item.imgUrl" @click = "$router.push(`/prodetail/${item.link.param.query.goodsId}`)">
        <img :src="item.imgUrl" alt="">
      </van-swipe-item>
    </van-swipe>

    <!-- 导航 -->
    <van-grid column-num="5" icon-size="40">
      <van-grid-item
        v-for="item in navList" :key="item.imgUrl"
        :icon="item.imgUrl"
        :text="item.text"
        @click="$router.push('/category')"
      />
    </van-grid>

    <!-- 主会场 -->
    <div class="main">
      <img src="@/assets/main.png" alt="">
    </div>

    <!-- 猜你喜欢 -->
    <div class="guess">
      <!-- <p class="guess-title">—— 猜你喜欢 ——</p> -->
      <p v-html="textList.content"></p>

      <div class="goods-list">
        <!-- 父组件传递数据至子组件 -->
        <GoodsItem v-for="item in proList" :key="item.goods_id" :item = "item"></GoodsItem>
      </div>
    </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getHomeData } from '@/api/home' // 导入方法用{}, 导入对象则直接写名字
export default {
  name: 'HomeIndex',
  data () {
    return {
      searchList: [],
      bannerList: [],
      navList: [],
      textList: [],
      proList: [],
      loading: true
    }
  },
  components: {
    GoodsItem
  },
  async created () {
    const { data: { pageData } } = await getHomeData()
    // console.log(pageData)
    this.searchList = pageData.items[0].params // 搜索框的placehold
    this.bannerList = pageData.items[1].data
    this.navList = pageData.items[3].data
    // console.log(this.navList)
    this.textList = pageData.items[5].params
    this.proList = pageData.items[6].data
    this.loading = false
  }
}
</script>

<style lang = "less" scoped>
  .home {
    padding-top: 100px;
    padding-bottom: 50px;
  }

  // 导航条样式定制
.van-nav-bar {
  z-index: 999;
  background-color: #c21401;
  ::v-deep .van-nav-bar__title {
    color: #fff;
  }
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}

// 分类导航部分
.my-swipe .van-swipe-item {
  height: 185px;
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #39a9ed;
}
.my-swipe .van-swipe-item img {
  width: 100%;
  height: 185px;
}

// 主会场
.main img {
  display: block;
  width: 100%;
}

// 猜你喜欢
.guess .guess-title {
  height: 40px;
  line-height: 40px;
  text-align: center;
}

// 商品样式
.goods-list {
  background-color: #f6f6f6;
}
</style>
