<template>
  <div>
    <!-- 年和月 -->
    <el-row type="flex" justify="end">
      <!-- 年 别人用组件给定一个日期，通过日期获取年，年前5年+后5年 -->
      <el-select v-model="currentYear" size="small" style="width: 120px">
        <el-option v-for="item in yearList" :key="item" :label="item" :value="item" />
      </el-select>
      <el-select v-model="currentMonth" size="small" style="width: 120px;margin-left:10px">
        <!-- 循环 -->
        <el-option v-for="item in 12" :key="item" :label="item" :value="item" />
      </el-select>
    </el-row>
    <!-- 放置日历组件 -->
    <el-calendar />
  </div>
</template>

<script>
export default {
  props: {
    startDate: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      currentMonth: null, // 当前月份
      currentYear: null, // 当前年份
      currentDate: null,
      yearList: []
    }
  },
  created() {
    this.currentYear = this.startDate.getFullYear()// 得到当前的年份
    // 组件要求起始时间必须是 周一开始 以一个月为开始
    this.currentMonth = this.startDate.getMonth() + 1
    this.currentYear = this.startDate.getFullYear()
    // 快速生成数组
    Array.from(Array(11), (v, i) => {
      // 根据当前的年 生成可选年份 前后各加5年
      this.yearList = Array.from(Array(11), (value, index) => this.currentYear + index - 5)
    })
  },
  methods: {

  }
}
</script>

<style  scoped  >

 v-deep .el-calendar-day {
  height:  auto;
 }
 v-deep .el-calendar-table__row td,v-deep .el-calendar-table tr td:first-child,  v-deep .el-calendar-table__row td.prev{
  border:none;
 }
.date-content {
  height: 40px;
  text-align: center;
  line-height: 40px;
  font-size: 14px;
}
.date-content .rest {
  color: #fff;
  border-radius: 50%;
  background: rgb(250, 124, 77);
  width: 20px;
  height: 20px;
  line-height: 20px;
  display: inline-block;
  font-size: 12px;
  margin-left: 10px;
}
.date-content .text{
  width: 20px;
  height: 20px;
  line-height: 20px;
 display: inline-block;

}
 v-deep .el-calendar-table td.is-selected .text{
   background: #409eff;
   color: #fff;
   border-radius: 50%;
 }
 v-deep .el-calendar__header {
   display: none
 }
</style>
