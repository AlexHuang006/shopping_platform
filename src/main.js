import Vue from 'vue'
// 1. import Vue from 'vue'
// 作用： 引入 Vue.js 核心库。
// 功能： 为应用程序提供 Vue 的核心功能，如组件系统、响应式数据绑定、指令等。

import App from './App.vue'
// 2. import App from './App.vue'
// 作用： 引入主组件 App.vue。
// 功能：
// 这是整个应用的根组件，所有子组件都会嵌套在此组件中。
// App.vue 通常包含应用的基本结构，比如导航栏、页面内容区域等。

import router from './router'
// 3. import router from './router'
// 作用： 引入路由配置文件。
// 功能：
// 路由定义了页面路径与组件之间的映射关系。
// router 是一个 Vue Router 实例，用于管理页面导航和组件切换。

import store from './store'
// 4. import store from './store'
// 作用： 引入状态管理配置文件。
// 功能：
// store 是一个 Vuex 实例，用于集中管理全局状态（例如用户信息、主题配置等）。
// 确保组件之间能够共享数据，避免重复传递。

// 导入vant组件
import '@/utils/vant-ui'

// 导入通用css
import '@/styles/common.less'

Vue.config.productionTip = false
// 5. Vue.config.productionTip = false
// 作用： 配置生产环境提示。
// 功能：
// 禁用 Vue 在生产环境中启动时的提示信息。
// 这样可以避免控制台输出与开发无关的提示内容。

// 6. new Vue({ ... })
// 作用： 创建 Vue 实例，初始化应用程序。
// 功能：
// 通过配置对象传入 router 和 store，将路由和状态管理挂载到 Vue 实例上。
// 使用 render 函数指定渲染的根组件 App。
// 配置对象详解：
// router
// 挂载路由实例，管理组件间的导航。
// store
// 挂载 Vuex 状态管理实例，提供全局数据的共享。
// render: h => h(App)
// 作用： 渲染函数，定义渲染的内容。
// 功能： 使用函数式语法将根组件 App.vue 渲染成 DOM 并挂载到页面上。
// 7. .$mount('#app')
// 作用： 手动挂载 Vue 实例。
// 功能：
// 将 Vue 实例挂载到 HTML 文件中的 #app 节点。
// 这个节点通常在 index.html 文件中定义：<div id="app"></div>。
// 整段代码的核心流程
// 导入核心功能模块和配置（Vue、App、router、store）。
// 创建一个 Vue 实例，将路由和状态管理注入应用。
// 渲染根组件 App.vue 并挂载到页面的 DOM 节点 #app。
// 这样就完成了一个 Vue.js 应用的初始化。
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
