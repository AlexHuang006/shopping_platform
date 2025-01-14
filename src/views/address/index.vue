<template>
  <div class="address" >
    <van-nav-bar fixed title="收货地址" left-arrow @click-left="$router.go(-1)" />
    <!-- 地址列表 -->
    <div class="list" v-if="!empty">
      <van-address-list
        v-model="chosenAddressId"
        :list="list"
        default-tag-text="Default"
      />
    </div>

    <!-- 空购物车处理 -->
    <div class="empty-address" v-else>
      <img src="@/assets/empty.png" alt="">
      <div class="tips">
        Your Address is empty
      </div>
    </div>
    <!-- 底部按钮 -->
    <!-- <div class="footer">
      <div class="btn">添加收货地址</div>
    </div> -->
  </div>
</template>

<script>
export default {
  name: 'AddressIndex',

  data () {
    return {
      empty: false,
      chosenAddressId: '1',
      list: [
        {
          id: '1',
          name: 'John Snow',
          tel: '13000000000',
          address: 'Somewhere',
          isDefault: true
        }]
    }
  }
}
</script>

<style lang="less" scoped>
  .address {
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: #f9f9f9;
  }
  .list {
    padding: 50px 0 0;
  }
  .empty-address {
    flex: 1; /* 占据剩余空间 */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    color: #999;
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
  }

  .footer {
    background: #ffffff;
    padding: 16px;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
    .btn {
      background: linear-gradient(90deg, #ff6034, #ee0a24);
      color: #fff;
      font-size: 16px;
      text-align: center;
      line-height: 44px;
      border-radius: 22px;
      cursor: pointer;
      user-select: none;
    }
  }
</style>
