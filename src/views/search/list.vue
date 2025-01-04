<template>
<!-- 商品搜索结果列表页面 -->
  <div>
    <div class="search">
    <van-nav-bar fixed title="商品列表" left-arrow @click-left="$router.go(-1)" />

    <!-- 将输入框的value值绑定querySearch，用于回显搜索关键词在输入框中 -->
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

    <div v-if = "!loading">
      <div class="goods-list" v-if = "proList.length > 0">
        <GoodsItem v-for="item in proList" :key="item.goods_id" :item = "item"></GoodsItem>
      </div>
      <div class="none-goods" v-else>
        暂无相关产品，请换个关键词试试吧
      </div>
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
      sortType: 'all',
      sortPrice: 0,
      categoryId: 0,
      proList: [],
      loading: true
    }
  },

  computed: {
    querySearch () {
      return this.$route.query.search // return传入的搜索参数，即从搜索页面传入的搜索关键词，因为需要回显在此页面的输入框中
    }
  },

  methods: {
    // 定义一个赋值sortType值的方法，用于给当前组件赋值active类名，用于显示css样式
    handleSortType (newSortType) {
      this.sortType = newSortType
      if (newSortType === 'sales') {
        this.proList = this.proList.sort((a, b) => {
          return a.goods_sales - b.goods_sales
        })
      }
    }
  },

  // 在created中调用api请求方法，用于进入页面立即请求数据
  async created () {
    const { data: { list } } = await getProList({
      sortType: this.sortType,
      SortPrice: 0,
      categoryId: 0,
      goodsName: this.$route.query.search,
      page: 1
    })
    this.proList = list.data
    if (this.proList.length < 1) {
      this.$toast('暂无相关产品')
    }
    this.loading = false
    // console.log(this.proList)
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

  .goods-list {
    background-color: #f6f6f6;
  }
  .none-goods {
    height: 400px;
    /* background-color: pink; */
    text-align: center;
    align-content: center;
    font-size: 16px;
    color: gray;
  }
</style>
