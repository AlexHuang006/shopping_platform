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
        <!-- 1. 手机号码输入框 -->
        <div class="form-item">
          <input v-model = "mobile" class="inp" maxlength="11" placeholder="Enter phone number" type="text">
        </div>
        <!-- 2. 图形验证码输入框 -->
        <div class="form-item">
          <input v-model = "picCode" class="inp" maxlength="5" placeholder="请输入图形验证码" type="text">
          <!-- 加一个v-if，在无图形验证码地址时，不渲染此元素 -->
          <img v-if = "picUrl" :src="picUrl" alt="" @click = "getPicCode">
        </div>
        <!-- 3. 短信验证码输入框 -->
        <div class="form-item">
          <input v-model = "msgCode"  class="inp" placeholder="Enter the verification code" type="text">
          <button @click = "getCode">
            {{ second === totalSecond ? 'Verification Code' : second + 's后重新发送' }}
            </button>
        </div>
      </div>

      <div class="login-btn" @click = "login">Log in</div>
    </div>
  </div>
</template>

<script>
import { getMsgCode, getPicCode, codeLogin } from '@/api/login'
import { getAddressList, setAddress } from '@/api/address'

export default {
  name: 'LoginIndex',

  // 数据
  data () {
    return {
      picCode: '', // 用户输入的图形验证码
      mobile: '',
      picKey: '', // 图形验证码唯一标识，其他请求接口要用
      picUrl: '', // 图形验证码URL
      totalSecond: 60, // 总秒数
      second: 60, // 当前秒数，开定时器，对此数据--
      timer: null, // 定时器id
      msgCode: '' // 短信验证码
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
    },

    // 校验手机号和图形验证码的合法
    validFn () {
      if (!/^1[3-9]\d{9}$/.test(this.mobile)) {
        this.$toast('请输入正确的手机号')
        return false
      }
      if (!/^\w{4}$/.test(this.picCode)) {
        this.$toast('请输入正确的图形验证码')
        return false
      }
      return true
    },

    // 请求短信验证码方法
    async getCode () {
      // 请求前先验证输入框内容
      if (!this.validFn()) {
        return
      }

      // 避免重复点击开启多个定时器，当前没有定时器且当前second=totalSecond，才可开启
      if (!this.timer && this.second === this.totalSecond) {
        // 调用请求函数
        await getMsgCode(this.picCode, this.picKey, this.mobile)
        this.$toast('发送成功，请注意查收')

        // 开启定时器
        this.timer = setInterval(() => {
          this.second--

          if (this.second <= 0) {
            clearInterval(this.timer)
            this.timer = null // reset   timer id
            this.second = this.totalSecond
          }
        }, 1000)
      }
    },

    // 登录请求
    async login () {
      if (!this.validFn) {
        return
      }

      if (!/^\d{6}$/.test(this.msgCode)) {
        this.$toast('请输入正确的手机验证码')
        return
      }
      const res = await codeLogin(this.mobile, this.msgCode) // 请求登录，获得用户token信息和userId
      this.$store.commit('user/setUserInfo', res.data) // 将用户token和userId存入vuex和本地storage
      // 测试使用，给新用户自动添加收货地址
      const { data: { list } } = await getAddressList()
      // console.log(list)
      if (list.length === 0) {
        await setAddress()
      }
      // console.log(res)
      this.$toast('登录成功')

      // 此处需要判断，用户是从什么业务进入登录流程的，如果从购物车等业务进入，登录完成后需要返回原页面，即判断地址栏是否有回跳地址。如果就只是正常的登录，则登录成功后默认打开app首页。
      // 判断是否有回跳地址
      const url = this.$route.query.backUrl || '/' // 从当前页面地址栏中获取数据
      // this.$router.push('/')
      this.$router.replace(url) // 此处将push换成replace是为了用户体验，避免返回原页面
    }
  },

  // 离开页面销毁定时器
  destroyed () {
    clearInterval(this.timer)
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
