import Vue from 'vue'
import VueRouter from 'vue-router'

// 一级路由页面
import Layout from '@/views/layout'
import Login from '@/views/login'
import MyOrder from '@/views/myorder'
import Search from '@/views/search'
import SearchList from '@/views/search/list'
import ProDetail from '@/views/prodetail'
import Pay from '@/views/pay'
import Address from '@/views/address'

// 二级路由页面
import Home from '@/views/layout/home'
import Category from '@/views/layout/category'
import Cart from '@/views/layout/cart'
import User from '@/views/layout/user'

import store from '@/store'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置一级和二级路由
  routes: [
    {
      path: '/',
      component: Layout,
      redirect: '/home',
      children: [
        { path: '/home', component: Home },
        { path: '/category', component: Category },
        { path: '/cart', component: Cart },
        { path: '/user', component: User }
      ]
    },
    { path: '/login', component: Login },
    { path: '/myorder', component: MyOrder },
    { path: '/search', component: Search },
    { path: '/searchlist', component: SearchList },
    // 动态路由传参，商品ID
    { path: '/prodetail/:id', component: ProDetail },
    { path: '/pay', component: Pay },
    { path: '/address', component: Address }
  ]
})

// 配置全局前置导航守卫
// 1. 定义一个数组，存放需要权限才能访问的页面
const authUrl = ['/pay', '/myorder']
// 1. to 往哪里去， 到哪去的路由信息对象
// 2. from 从哪里来， 从哪来的路由信息对象
// 3. next() 是否放行
// 如果next()调用，就是放行
// next(路径) 拦截到某个路径页面
router.beforeEach((to, from, next) => {
  // 判断to.path是否到需权限的页面
  if (!authUrl.includes(to.path)) {
    // 非权限页面直接放行
    return next()
  }
  // 权限页面，判断是否有用户token
  // const token = store.state.user.userInfo.token
  const token = store.getters.token // 通过全局store中的getters获取state中的数据
  if (token) { // 如果有token就直接放行
    next()
  } else {
    next('/login') // 如果没有token就打开登录页面
  }
})

export default router
