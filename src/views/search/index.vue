<template>
  <div class="search">
    <!-- 页面标头vant组件 -->
    <van-nav-bar title="商品搜索" left-arrow @click-left="$router.go(-1)" />
    <!-- vant搜索框组件 -->
    <van-search show-action placeholder="Enter Key words" clearable>
      <template #action>
        <div>Search</div>
      </template>
    </van-search>

    <!-- 搜索历史list -->
    <div class="search-history">
      <!-- 标题 -->
      <div class="tittle">
        <span>Search History</span>
        <van-icon name="delete-o" size="16" />
      </div>
      <!-- list 内容 -->
      <div class="list">
        <div class="list-item">AA</div>
        <div class="list-item">BB</div>
        <div class="list-item">CC</div>
        <div class="list-item">DD</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchIndex'
}
</script>

<style>

</style>
