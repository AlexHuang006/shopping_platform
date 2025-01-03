<template>
  <div class="search">
    <!-- 页面标头vant组件 -->
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />
    <!-- vant搜索框组件 -->
    <van-search v-model = "search" show-action placeholder="Enter Key words" clearable>
      <template #action>
        <div @click = "goSearch(search)">Search</div>
      </template>
    </van-search>

    <!-- 搜索历史list -->
    <!-- 首先先判断是否有历史记录 -->
    <div class="search-history" v-if = "history.length > 0">
      <!-- 标题 -->
      <div class="title">
        <span>Search History</span>
        <van-icon @click = "clear" name="delete-o" size="16" />
      </div>
      <!-- list 内容 -->
      <div class="list">
        <div v-for = "item in history" :key = "item" class="list-item" @click = "goSearch(item)">
        {{item}}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getHistoryList, setHistoryList } from '@/utils/storage'

export default {
  name: 'SearchIndex',
  data () {
    return {
      search: '',
      history: getHistoryList()
    }
  },
  methods: {
    goSearch (key) {
      const index = this.history.indexOf(key) // 先判断传入的参数是否已经存在于history数组中，如果匹配到，就找出对应的index
      if (index !== -1) {
        this.history.splice(index, 1) // 将匹配的数组中的值移除
      }
      this.history.unshift(key) // 将参数添加到history数组的最前面
      setHistoryList(this.history)
      this.$router.push(`/searchlist?search=${key}`) // 最后页面跳转到搜索结果列表中，并传入关键词作为传入参数
      this.search = ''
    },
    clear () {
      this.history = []
      setHistoryList([])
      this.$toast.success('清空历史成功')
    }
  }
}
</script>

<style lang= "less" scoped>
  .search {
    .searchBtn {
      background-color: #fa2209;
      color: #fff;
    }
    ::v-deep .van-search__action {
      background-color: #c21401;
      color: #fff;
      padding: 0 20px;
      border-radius: 0 5px 5px 0;
      margin-right: 10px;
    }
    ::v-deep .van-icon-arrow-left {
      color: #333;
    }

    .search-history {
      .title {
        height: 40px;
        line-height: 40px;
        font-size: 14px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 15px;
      }
      .list {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
        padding: 0 10px;
        gap: 5%;
      }
      .list-item {
        width: 30%;
        text-align: center;
        padding: 7px;
        line-height: 15px;
        border-radius: 50px;
        background: #fff;
        font-size: 13px;
        border: 1px solid #efefef;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-bottom: 10px;
      }
    }
  }
</style>
