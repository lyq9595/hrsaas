<template>
  <!-- 公共导入组件 -->
  <upload-excel :on-success="success" />
</template>

<script>
import { importEmployee } from '@/api/employees'

export default {
  methods: {
    async success({ header, results }) {
      // 如果是导入员工
      const userRelations = {
        '入职日期': 'timeOfEntry',
        '手机号': 'mobile',
        '姓名': 'username',
        '转正日期': 'correctionTime',
        '工号': 'workNumber'
      }
      // var arr = []
      // results.forEach(item => {
      //   var userInfo = {}
      //   Object.keys(item).forEach(key => {
      // console.log(key) key为姓名 日期等  obj.keys是三行excel数据 每一个item是一行的
      // key是中文 需要转换为英文 item[key] =第一行【姓名】=张三 userinfo[英文]=张三
      //   userInfo[userRelations[key]] = item[key]
      // })
      // arr.push(userInfo)
      // })

      var newArr = results.map(item => {
        var userInfo = {}
        console.log(Object)
        Object.keys(item).forEach(key => {
          if (userRelations[key] === 'timeOfEntry' || userRelations[key] === 'correctionTime') {
            // 后端接口限制了 不能是字符串 要求转换成时间类型 只有这样才能入库
            userRelations[key] = new Date(this.formatDate(this.formatDate(item[key]), '/'))
          } else {
            userInfo[userRelations[key]] = item[key] // 将原来中文对应的值 赋值给原来英文对应的值
          }
        })
        return userInfo
      })
      await importEmployee(newArr)
      // 弹出提示
      this.$message.success('导入excel成功')
      this.$router.back()// 活到上一个页面
    },
    // 转换excel的日期格式
    formatDate(numb, format) {
      const time = new Date((numb - 1) * 24 * 3600000 + 1)
      time.setYear(time.getFullYear() - 70)
      const year = time.getFullYear() + ''
      const month = time.getMonth() + 1 + ''
      const date = time.getDate() - 1 + ''
      if (format && format.length === 1) {
        return year + format + month + format + date
      }
      return year + (month < 10 ? '0' + month : month) + (date < 10 ? '0' + date : date)
    }

  }
}
</script>

<style>
</style>
