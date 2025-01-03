<template>
  <div>
    <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <van-search
      readonly
      shape="round"
      background="#ffffff"
      :value="querySearch || 'Search stuff'"
      show-action
      @click="$router.push('/search')"
    >
      <template #action>
        <van-icon class="tool" name="apps-o" />
      </template>
    </van-search>

    <!-- 排序选项按钮 -->
    <div class="sort-btns">
      <div class="sort-item" :class = "{active: sortType === 'all'}" @click = "handleSortType('all')">Relevance</div>
      <div class="sort-item" :class = "{active: sortType === 'sales'}" @click = "handleSortType('sales')">Top sales</div>
      <div class="sort-item" :class = "{active: sortType === 'price'}" @click = "handleSortType('price')">Price</div>
    </div>

    <div class="goods-list">
      <GoodsItem v-for="item in 10" :key="item"></GoodsItem>
    </div>
  </div>
  </div>
</template>

<script>
import GoodsItem from '@/components/GoodsItem.vue'
import { getProList } from '@/api/product'

export default {
  name: 'ListIndex',
  components: {
    GoodsItem
  },

  data () {
    return {
      sortType: 'all'
    }
  },

  computed: {
    querySearch () {
      return this.$route.query.search // return传入的搜索参数
    }
  },

  methods: {
    handleSortType (newSortType) {
      this.sortType = newSortType
    }
  },

  async created () {
    const res = await getProList({
      sortType: 'all',
      SortPrice: 0,
      categoryId: 0,
      goodsName: '酒',
      page: 1
    })
    console.log(res)
  }
}
</script>

<style lang = "less" scoped>
  .search {
    padding-top: 46px;
    ::v-deep .van-icon-arrow-left {
      color: #333;
    }
    .tool {
      font-size: 24px;
      height: 40px;
      line-height: 40px;
    }

    .sort-btns {
      display: flex;
      height: 36px;
      line-height: 36px;
      .sort-item {
        text-align: center;
        flex: 1;
        font-size: 16px;

        &.active{
          color: #e49a3d;
        }
      }
    }
  }

  // 商品样式
  .goods-list {
    background-color: #f6f6f6;
  }
</style>
