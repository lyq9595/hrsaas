import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import '@/icons' // icon
import '@/permission' // permission control

import router from './router'
import Components from '@/components'
import * as directives from '@/directives'
// 注册自定义指令
import * as filters from '@/filters' // 引入工具类
import CheckPermission from '@/mixni/checkPermission'// 动态路由展示权限
import i18n from '@/lang'
/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  // element支持i8n i18n就会根据当前的locale树形去寻找对应的内容
  i18n: (key, value) => i18n.t(key) // t方法
  // 改变local的值就可以改变多语言
})

// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})
// 注册自定义过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
Vue.mixin(CheckPermission) // 表示所有的组件都拥有了检查的方法
// 注册自定组件
Vue.use(Components)
Vue.config.productionTip = false
// 全局混入min 所有组件都有检查方法

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: (h) => h(App)
})
