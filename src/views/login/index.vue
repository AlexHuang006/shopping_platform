<template>
  <div class="login">
    <!-- 头部 vant组件 Navbar-->
    <van-nav-bar
      title="Log in"
      left-arrow
      @click-left="$router.go(-1)"
    />

    <!-- 主体 -->
    <div class="container">
      <div class="tittle">
        <h3>Log in with phone number</h3>
        <p>未注册的手机号登录后将自动注册</p>
      </div>

      <div class="form">
        <div class="form-item">
          <input class="inp" maxlength="11" placeholder="Enter phone number" type="text">
        </div>
        <div class="form-item">
          <input v-model=picCode class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <!-- 加一个v-if，在无图形验证码地址时，不渲染此元素 -->
          <img v-if = "picUrl" :src="picUrl" alt="" @click = "getPicCode">
        </div>
        <div class="form-item">
          <input class="inp" placeholder="Enter the verification code" type="text">
          <button>Verification Code</button>
        </div>
      </div>

      <div class="login-btn">Log in</div>
    </div>
  </div>
</template>

<script>
import { getPicCode } from '@/api/login'

export default {
  name: 'LoginIndex',

  data () {
    return {
      picCode: '', // 用户输入的图形验证码
      picKey: '', // 图形验证码唯一标识，其他请求接口要用
      picUrl: '' // 图形验证码URL
    }
  },

  // 进入页面后立刻请求数据
  created () {
    this.getPicCode()
  },

  methods: {
    // 请求图形验证码方法
    async getPicCode () {
      const { data: { base64, key } } = await getPicCode() // 将api请求封装到函数中，然后调用。
      // 将请求到的数据解构，然后将其中的数据赋值给vuex中的数据。
      this.picUrl = base64
      this.picKey = key

      // this.$toast('图形验证码获取成功')
    }
  }
}
</script>

<style lang = "less" scoped>
.container {
  padding: 49px 29px;

  .tittle {
    margin-bottom: 20px;
    h3 {
      font-size: 26px;
      font-weight: normal;
    }
    p {
      line-height: 40px;
      font-size: 14px;
      color: #b8b8b8;
    }
  }
  .form-item {
    border-bottom: 1px solid #f3f1f2;
    padding: 8px;
    margin-bottom: 14px;
    display: flex;
    align-items: center;
    .inp {
      display: block;
      border: none;
      outline: none;
      height: 32px;
      font-size: 14px;
      flex: 1;
    }
    img {
      widows: 94px;
      height: 31px;
    }
    button {
      height: 31px;
      border: none;
      font-size: 13px;
      color: #cea26a;
      background-color: transparent;
      padding-right: 9px;
    }
  }

  .login-btn {
    width: 100%;
    height: 42px;
    margin-top: 39px;
    color: #fff;
    background: linear-gradient(90deg,#ecb53c,#ff9211);
    border-radius: 39px;
    box-shadow: 0 10px 20px 0 rgba(0, 0, 0, .1);
    text-align: center;
    align-content: center;
    letter-spacing: 2px;
  }
}
</style>
