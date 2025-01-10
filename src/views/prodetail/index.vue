<template>
  <div class="prodetail">
    <!-- 页面标题 -->
    <van-nav-bar fixed title="商品详情" left-arrow @click-left="$router.go(-1)" />
    <div v-if = !loading>
      <!-- 商品图片 -->
      <van-swipe :autoplay="3000" @change="onChange">
        <van-swipe-item v-for="(item, index) in images" :key="index">
          <img :src="item.external_url" />
        </van-swipe-item>
        <!-- 轮播图指示器 -->
        <template #indicator>
          <div class="custom-indicator">{{ current + 1 }} / {{ images.length }}</div>
        </template>
      </van-swipe>

      <!-- 商品说明 -->
      <div class="info">
        <!-- 价格标题 -->
        <div class="title">
          <div class="price left">
            <span class="now">￥{{ detail.goods_price_min }}</span>
            <span class="oldprice">￥{{ detail.goods_price_max }}</span>
          </div>
          <div class="sellcount right">已售{{ detail.goods_sales }}件</div>
        </div>
        <!-- 商品名标题 -->
        <div class="msg text-ellipsis-2">
          {{ detail.goods_name }}
        </div>

        <!-- service 说明 -->
        <div class="service">
          <div class="left-words">
            <span><van-icon name="passed" />七天无理由退货</span>
            <span><van-icon name="passed" />48小时发货</span>
          </div>
          <div class="right-icon">
            <van-icon name="arrow" />
          </div>
        </div>
      </div>

      <!-- 商品评价 -->
      <div class="comment">
        <div class="comment-title">
          <div class="left">商品评价 ({{ total }}条)</div>
          <div class="right">查看更多 <van-icon name="arrow" /> </div>
        </div>
        <div class="comment-list">
          <div class="comment-item" v-for="item in commentList" :key="item.comment_id">
            <div class="top">
              <img :src="item.user.avatar_url || defaultImg" alt="">
              <div class="name">{{ item.user.nick_name }}</div>
              <van-rate :size="16" :value="item.score / 2" color="#ffd21e" void-icon="star" void-color="#eee"/>
            </div>
            <div class="content">
              {{ item.content }}
            </div>
            <div class="time">
              {{ item.create_time }}
            </div>
          </div>
        </div>
      </div>

      <!-- 商品描述 -->
      <div class="desc" v-html = "detail.content">
      </div>

      <!-- 底部 -->
      <div class="footer">
        <div class="icon-home">
          <van-icon name="wap-home-o" @click = "$router.push('/home')"/>
          <span>Home</span>
        </div>
        <div class="icon-cart">
          <!-- 添加购物车显示商品数量角标的图标，且有商品时，显示此图标-->
          <span v-if = "cartTotal > 0" class="num">{{ cartTotal }}</span>
          <van-icon name="shopping-cart-o" />
          <span>Cart</span>
        </div>
        <!-- 点击‘Add to cart’按钮，打开购物车弹窗 -->
        <div @click = "addFn" class="btn-add">Add to cart</div>
        <!-- 点击‘Buy now’按钮，打开立即购买的购物车弹窗 -->
        <div @click = "buyFn" class="btn-buy">Buy now</div>
      </div>

      <!-- 购物车弹层 -->
      <van-action-sheet v-model = "showPanel" :title = "model === 'cart' ? 'Add to cart' : 'Buy now'">
        <div class="product">
          <div class="product-title">
            <div class="left">
              <img :src="detail.goods_image" alt="">
            </div>
            <div class="right">
              <div class="price">
                <span>¥</span>
                <span class="nowprice">{{ detail.goods_price_min }}</span>
                <span class="oldprice">¥ {{ detail.goods_price_max }}</span>
              </div>
              <div class="count" v-if = "detail.stock_total === 0">
                <span>库存</span>
                <span>{{ detail.stock_total }}</span>
              </div>
            </div>
          </div>
          <div class="num-box">
            <span>Qty</span>
            <!-- 3. 使用通用子组件CountBox -->
            <!-- v-model绑定组件，因为v-model包含value和@input，并将父组件的value数据传递给子组件CountBox -->
            <!-- 将父组件的proStock数据传递给子组件CountBox -->
            <CountBox v-model = "addCount" :proStock = "detail.stock_total"></CountBox>
          </div>
          <div class="showbtn" v-if="detail.stock_total > 0">
            <!-- determine whether user has already signed in? -->
            <div class="btn" v-if="model === 'cart'" @click = "addCart">Add to cart</div>
            <div class="btn now" v-else>Buy now</div>
          </div>
          <div class="btn-none" v-else>Sold out</div>
        </div>
      </van-action-sheet>
    </div>
  </div>
</template>

<script>
import { getProDetail, getProComments } from '@/api/product'
import defaultImg from '@/assets/default-avatar.png'
import CountBox from '@/components/CountBox.vue' // 1. 引入子组件CountBox
import { addCart } from '@/api/cart' // 引入‘加入购物车’方法

export default {
  name: 'ProDetailIndex',
  components: {
    CountBox // 2. 注册组组件CountBox
  },
  data () {
    return {
      current: 0, // 用于配合轮播图indicator数标
      images: [], // 用于储存轮播图图片数据
      detail: [], // 商品详情信息
      total: 0, // 此商品的评论总数量
      commentList: [], // 评论内容列表
      defaultImg, // 评论中用户默认头像图片
      loading: true, // 配合页面数据加载
      showPanel: false, // 配合购物车弹窗
      model: 'cart', // 配合显示购物车弹窗的模式
      addCount: 1, // 购买此商品的数量
      cartTotal: 0 // 购物车内的商品数量
    }
  },

  computed: {
    goodsId () { // define一个获取页面路径中传入参数的方法
      return this.$route.params.id // 这是动态路由参数，获取参数
    }
  },

  created () {
    // 因为此页面中，在进入created生命周期时，需要请求多个后台数据，所以将请求方法写入到methods中。
    this.getDetail()
    this.getComments()
  },

  methods: {
    // onChange方法用于匹配轮播图和指示器对应数
    onChange (index) {
      this.current = index
    },

    // 请求商品详情方法
    async getDetail () {
      const { data: { detail } } = await getProDetail(this.goodsId)
      this.detail = detail
      this.images = detail.goods_images
      // console.log(this.detail)
    },

    // 请求商品评价方法
    async getComments () {
      const { data: { list, total } } = await getProComments(this.goodsId, 3)
      this.commentList = list
      this.total = total
      this.loading = false
      // console.log(list)
    },

    // determine which popup should be open
    addFn () {
      this.model = 'cart'
      this.showPanel = true
    },

    // determine which popup should be open
    buyFn () {
      this.model = 'butNow'
      this.showPanel = true
    },

    // 添加到购物车方法
    async addCart () {
      // 从全局的vuex里面拿到存进去的用户token数据
      // 1. 如果用户未登录
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
        return
      }
      // 2. 已登录用户，则将商品添加到购物车中
      const { data } = await addCart(this.goodsId, this.addCount, this.detail.skuList[0].goods_sku_id)
      this.cartTotal = data.cartTotal
      this.$toast('添加成功')
      this.showPanel = false
      // console.log(data)
    }
  }
}
</script>

<style lang = "less" scoped>
  .prodetail {
    padding-top: 46px;
    ::v-deep .van-icon-arrow-left {
      color: #333;
    }
    img {
      display: block;
      width: 100%;
    }
    .custom-indicator {
      position: absolute;
      right: 10px;
      bottom: 10px;
      padding: 5px 10px;
      font-size: 12px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 15px;
    }
    .desc {
      width: 100%;
      overflow: scroll;
      ::v-deep img {
        display: block;
        width: 100%!important;
      }
    }
    .info {
      padding: 10px;
    }
    .title {
      display: flex;
      justify-content: space-between;
      .now {
        color: #fa2209;
        font-size: 20px;
      }
      .oldprice {
        color: #959595;
        font-size: 16px;
        text-decoration: line-through;
        margin-left: 5px;
      }
      .sellcount {
        color: #959595;
        font-size: 16px;
        position: relative;
        top: 4px;
      }
    }
    .msg {
      font-size: 16px;
      line-height: 24px;
      margin-top: 5px;
    }
    .service {
      display: flex;
      justify-content: space-between;
      line-height: 40px;
      margin-top: 10px;
      font-size: 16px;
      background-color: #fafafa;
      .left-words {
        span {
          margin-right: 10px;
        }
        .van-icon {
          margin-right: 4px;
          color: #fa2209;
        }
      }
    }

    .comment {
      padding: 10px;
    }
    .comment-title {
      display: flex;
      justify-content: space-between;
      .right {
        color: #959595;
      }
    }

    .comment-item {
      font-size: 16px;
      line-height: 30px;
      .content {
          width: 100%;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      .top {
        height: 30px;
        display: flex;
        align-items: center;
        margin-top: 20px;
        img {
          width: 20px;
          height: 20px;
        }
        .name {
          margin: 0 10px;
        }
      }
      .time {
        color: #999;
      }
    }

    .footer {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 55px;
      background-color: #fff;
      border-top: 1px solid #ccc;
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      .icon-home, .icon-cart {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        .van-icon {
          font-size: 24px;
        }
      }
      .icon-cart {
        position: relative;
        padding: 0 6px;
        .num {
          z-index: 999;
          position: absolute;
          top: -2px;
          right: 0;
          min-width: 16px;
          padding: 0 4px;
          color: #fff;
          text-align: center;
          background-color: #ee0a24;
          border-radius: 50%;
        }
      }
      .btn-add,
      .btn-buy {
        height: 36px;
        line-height: 36px;
        width: 120px;
        border-radius: 18px;
        background-color: #ffa900;
        text-align: center;
        color: #fff;
        font-size: 14px;
      }
      .btn-buy {
        background-color: #fe5630;
      }
    }
  }

  .tips {
    padding: 10px;
  }

  .product {
    .product-title {
      display: flex;
      .left {
        img {
          width: 90px;
          height: 90px;
        }
        margin: 10px;
      }
      .right {
        flex: 1;
        padding: 10px;
        .price {
          font-size: 14px;
          color: #fe560a;
          .nowprice {
            font-size: 24px;
            margin: 0 5px;
          }
          .oldprice {
            display: block;
            color: #959595;
            font-size: 16px;
            text-decoration: line-through;
          }
        }
      }
    }

    .num-box {
      display: flex;
      justify-content: space-between;
      padding: 10px;
      align-items: center;
    }

    .btn, .btn-none {
      height: 40px;
      line-height: 40px;
      margin: 20px;
      border-radius: 20px;
      text-align: center;
      color: rgb(255, 255, 255);
      background-color: rgb(255, 148, 2);
    }
    .btn.now {
      background-color: #fe5630;
    }
    .btn-none {
      background-color: #cccccc;
    }
  }
</style>
