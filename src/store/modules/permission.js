// 权限路由模块
import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  // 一开始拥有静态路由的权限
  routes: constantRoutes // 路由表 表示当前用户所拥有的所有路由数组
}
const mutations = {
  // 定义修改routes的mutations
  // payload认为是登陆成功需要添加的新路由
  setRoutes(state, newRoutes) {
    // state.routes = [...state.routes]错误写法
    state.routes = [...constantRoutes, ...newRoutes]// 每次都是在静态路由的基础上加
  }
}
const actions = {
  // 筛选权限路由
  // 第二个参数为 当前用户所拥有的菜单权限['settings','permisssions']
  filterRoutes(context, menus) {
    const routes = []
    // 筛选出动态路由(async)中和menus中可以对上的路由
    menus.forEach(key => {
      // 用户权限标识
      // 找有没有对象中的name树形等于key的
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 有可能有元素 也肯能是空数组
    })
    // routes是所有模块中满足权限要求的数组 用户权限
    context.commit('setRoutes', routes)// 将动态路由提交给mutatioin
    return routes // 这里还要return是因为 state数据给菜单用 return给路由的
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
