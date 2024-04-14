// 权限拦截在路由跳转 导航守卫

import router from '@/router'
import store from '@/store' // store实例 和this.$store 一样
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 定义路由白名单

// 不需要导出 main引入过了 这个文件要执行的
// 前置守卫
// next是前置钩子 必须执行 不执行页面就死了 next()放过 next(false) 跳转终止 next(地址) 跳转中止
router.beforeEach(async(to, from, next) => {
  NProgress.start()// 开启进度条
  if (store.getters.token) {
    // 如果有token
    if (to.path === '/login') {
      // 主页
      next('/')
    } else {
      // 放行
      if (!store.getters.userId) {
        const { roles } = await store.dispatch('user/getUserInfo')
        // 为什么要写await 因为我们想获取完资料再去放行
        // 筛选用户可用路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)// 筛选得到用户可用的动态路由
        // routes就是筛选得到的路由
        // 把动态路由加上
        // addRoutes
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加到路由表// 添加动态路由到路由表
        // console.log(routes)
        // 添加完动态路由之后
        next(to.path)// 这个相当于跳转到对应的地址 相当于多做一次跳转
      } else {
        next()
      }
    }
  } else {
    // 无token 查看是否在白名单
    if (whiteList.indexOf(to.path) > -1) {
      // 要去的地址在白名单中
      next()
    } else {
      next('/login')
    }
  }
  NProgress.done()// 关闭进度条
})
// 后置守卫
router.afterEach(() => {
  NProgress.done()// 关闭进度条
})
