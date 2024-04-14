// 员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/departments', // 路由地址
  name: 'departments', // 给模块以一级路由加name属性 这个属性后面做权限可以用
  component: Layout,
  children: [
    {
      path: '', // 这里不用写 什么都不写表示employees默认路由
      name: 'departments',
      component: () => import('@/views/departments'),
      // 路由元信息 可以放任何内容
      meta: {
        title: '组织架构', // 左侧导航读取了meta
        icon: 'tree'
      }
    }
  ]
}
