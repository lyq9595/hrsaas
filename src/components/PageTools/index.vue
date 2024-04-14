<template>
  <el-card class="page-tools">
    <el-row type="flex" justify="space-between" align="middle">
      <el-col>
        <!-- 前插槽 -->
        <!-- 有名字叫具名插槽 无名叫匿名插槽 -->
        <div v-if="showBefore" class="before">
          <!-- 图标随着showbefore显示而显示 -->
          <i class="el-icon-info" />
          <slot name="before" />
        </div>

      </el-col>
      <el-col>
        <el-row type="flex" justify="end">
          <!-- 后插槽 -->
          <slot name="after" />
        </el-row>

      </el-col>
    </el-row>
  </el-card>
</template>

<script>
// 组件可以显示左侧内容 也可以选择右侧内容 左侧属性 不穿 不显示
export default {
  props: {
    showBefore: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style lang="scss">
.page-tools {
    margin: 10px 0;
    .before {
      line-height: 34px;
    i {
      margin-right: 5px;
      color: #409eff;
    }
    display: inline-block;
    padding: 0px 10px;
    border-radius: 3px;
    border: 1px solid rgba(145, 213, 255, 1);
    background: rgba(230, 247, 255, 1);
  }
 }
</style>
