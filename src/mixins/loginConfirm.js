// 使用mixins，建立一个公共的方法
import { removeInfo } from '@/utils/storage'
import { Toast } from 'vant'
// 判断登录弹窗
export default {
  methods: {
    // 是否需要弹登录确认框
    // (1) 需要，返回 true，并直接弹出登录确认框
    // (2) 不需要，返回 false
    loginConfirm () {
      if (!this.$store.getters.token) { // if user hasn't signed in, it would pop up to prompt user,因为在用户登录时，已将token存入vuex和local storage，所以判断是否存有token即可
        this.$dialog.confirm({
          title: '温馨提示',
          message: '请先登录',
          confirmButtonText: '去登录',
          cancelButtonText: '再逛逛'
        })
          .then(() => { // 点击‘登录’则调用then 回调会调用路由导航方法 this.$router.replace。使用 query 参数将当前页面路径（this.$route.fullPath）传递给登录页，这样用户登录完成后可以跳回原页面。
            // 登录流程完成后，需要回到原来的页面，则在跳转时，需要将将当前路径地址作为携带参数
            // 并且login in页面的登录js逻辑代码也需要配合进行修改，login in页面在登录请求完成后需要判断地址栏是否有回跳地址，有就回原页面，无就默认到app首页
            this.$router.replace({
              path: '/login',
              query: {
                backUrl: this.$route.fullPath
              }
            })
          })
          .catch(() => {}) // catch 回调，则什么也不做
        return true
      }
      return false
    },

    // 登出确认
    logOutConfirm () {
      if (this.$store.getters.token) {
        this.$dialog.confirm({
          title: '温馨提示',
          message: '确定退出登录吗',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            removeInfo()
            Toast('登出成功')
            window.location.reload()
          })
          .catch(() => {})
      }
    }
  }
}
