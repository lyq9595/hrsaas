// 员工的路由规则
import Layout from '@/layout'
export default {
  // 路由规则
  path: '/employees', // 路由地址
  name: 'employees', // 给模块以一级路由加name属性 这个属性后面做权限可以用
  component: Layout,
  children: [
    {
      path: '', // 这里不用写 什么都不写表示employees默认路由
      component: () => import('@/views/employees'),
      name: 'employees',
      // 路由元信息 可以放任何内容
      meta: {
        title: '员工管理', // 左侧导航读取了meta
        icon: 'people'
      }
    },
    {
      path: 'detail/:id?', // ?表示可传可不传
      component: () => import('@/views/employees/detail'),
      hidden: true, // 表示改内容不在左侧显示
      meta: {
        title: '员工详情' // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
      }
    },
    {
      path: 'print/:id', // 二级默认路由
      component: () => import('@/views/employees/print'), // 按需加载
      hidden: true,
      meta: {
        title: '打印', // 标记当前路由规则的中文名称 后续在做左侧菜单时 使用
        icon: 'people'
      }
    }
  ]
}
