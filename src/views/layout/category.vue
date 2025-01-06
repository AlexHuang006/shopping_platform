<template>
  <div>
    <div class="category">
    <!-- 分类 -->
    <van-nav-bar title="全部分类" fixed />

    <!-- 搜索框 -->
    <van-search
      readonly
      shape="round"
      background="#f1f1f2"
      placeholder="请输入搜索关键词"
      @click="$router.push('/search')"
    />

    <!-- 分类列表 -->
    <div class="list-box">
      <div class="left">
        <ul>
          <li v-for="(item, index) in list" :key="item.catagory_id">
            <a :class="{ active: index === activeIndex }" href="javascript:;" @click = "activeIndex = index">{{ item.name }}</a>
          </li>
        </ul>
      </div>
      <div class="right" v-if = !loading>
        <div v-if = "list[activeIndex]?.children && list[activeIndex]?.children.length > 0" class = "right1">
          <!-- 避免在 list[activeIndex] 为 undefined 或 null 时尝试访问 children，从而防止运行时错误 -->
          <!-- 什么时候不需要加？ 如果你确信 list[activeIndex] 一定存在并且永远不会是 undefined 或 null，可以不加 ?.。但在动态数据中，推荐使用它来防止潜在错误。 -->
          <!-- 点击商品子类型，进入商品搜索列表，将商品的category_id参数传入到搜索结果列表页 -->
          <div v-for="item in list[activeIndex]?.children" :key="item.category_id" class="cate-goods" @click="$router.push(`/searchlist?categoryId=${item.category_id}`)">
            <img :src="item.image?.external_url" alt="">
            <p>{{ item.name }}</p>
          </div>
        </div>
        <div v-else class="nothing">
          暂无相关产品
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { getCategoryData } from '@/api/category' // 导入用于请求商品分类的方法

export default {
  name: 'CategoryIndex',
  data () {
    return {
      list: [],
      activeIndex: 0,
      loading: true
    }
  },

  async created () {
    const { data: { list } } = await getCategoryData()
    this.list = list
    this.loading = false
    // console.log(list)
  }
}
</script>

<style lang = "less" scoped>
// 主题 padding
.category {
  padding-top: 100px;
  padding-bottom: 50px;
  height: 100vh;
  .list-box {
    height: 100%;
    display: flex;
    .left {
      width: 85px;
      height: 100%;
      background-color: #f3f3f3;
      overflow: auto;
      a {
        display: block;
        height: 45px;
        line-height: 45px;
        text-align: center;
        color: #444444;
        font-size: 12px;
        &.active {
          color: #fb442f;
          background-color: #fff;
        }
      }
    }
    .right {
      flex: 1;
      height: 100%;
      .right1 {
        display: flex;
        height: 100%;
        background-color: #ffffff;
        flex-wrap: wrap;
        justify-content: flex-start;
        align-content: flex-start;
        padding: 10px 0;
        overflow: auto;
      }
      .nothing {
        height: 100%;
        width: 100%;
        text-align: center;
        align-content: center;
        color: gray;
        font-size: 14px;
      }

      .cate-goods {
        width: 33.3%;
        margin-bottom: 10px;
        img {
          width: 70px;
          height: 70px;
          display: block;
          margin: 5px auto;
        }
        p {
          text-align: center;
          font-size: 12px;
        }
      }
    }
  }
}

// 导航条样式定制
.van-nav-bar {
  z-index: 999;
}

// 搜索框样式定制
.van-search {
  position: fixed;
  width: 100%;
  top: 46px;
  z-index: 999;
}
</style>
