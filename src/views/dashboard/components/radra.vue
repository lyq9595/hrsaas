<template>
  <div ref="myDiv" class="radar-echart">
    <!--  -->
  </div>
</template>

<script>
// var echarts = require('echarts')
var echarts = require('echarts/lib/echarts') // 引入echarts主模块
require('echarts/lib/chart/radar') // 引入雷达图
// 引入提示框和标题组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/title')
export default {
  created() {
    // 不能在这里面 因为页面还没有渲染完毕
  },
  // 页面渲染完毕
  mounted() {
    const myChart = echarts.init(this.$refs.myDiv)
    myChart.setOption({
      title: {
        text: 'Basic Radar Chart'
      },
      legend: {
        data: ['Allocated Budget', 'Actual Spending']
      },
      radar: {
        // shape: 'circle',
        indicator: [
          { name: '工作效率', max: 100 },
          { name: '考勤', max: 100 },
          { name: '积极性', max: 100 },
          { name: '帮助同事', max: 100 },
          { name: '自主学习', max: 100 },
          { name: '正确率', max: 100 }
        ]
      },
      series: [
        {
          name: 'Budget vs spending',
          type: 'radar',
          data: [
            {
              value: [10, 45, 100, 65, 100, 65],
              name: '张三'
            },
            {
              value: [50, 50, 70, 50, 90, 40],
              name: '李四'
            }
          ]
        }
      ]
    })
  }
}
</script>

<style>
.radar-echart {
    width: 600px;
    height: 400px;
}
</style>
