// 员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/permission', // 路由地址
  name: 'permissions', // 给模块以一级路由加name属性 这个属性后面做权限可以用
  component: Layout,
  children: [
    {
      path: '', // 这里不用写 什么都不写表示employees默认路由
      name: 'permissions',
      component: () => import('@/views/permission'),
      // 路由元信息 可以放任何内容
      meta: {
        title: '权限管理', // 左侧导航读取了meta
        icon: 'lock'
      }
    }
  ]
}
