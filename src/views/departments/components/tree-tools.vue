<template>
  <el-row type="flex" justify="space-between" align="middle" style="width: 100%;height: 40px">
    <el-col>
      <span>{{ treeNode.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex" justify="end">
        <el-col>{{ treeNode.manager }}</el-col>
        <el-col>
          <!-- 下拉菜单 -->
          <el-dropdown @command="operateDepts">
            <!-- 下拉菜单内容 -->
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add" :disabled="!checkPermission('add-dept')">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { delDepartments } from '@/api/departments'
export default {
  props: {
    treeNode: {
      type: Object,
      required: true // 要求该属性必填
    },
    // 是不是根节点 如果是根节点的话  隐藏 删除和编辑
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    operateDepts(type) {
      if (type === 'add') {
        // 新增
        // 告诉父组件弹层去
        // console.log(this.treeNode)
        this.$emit('addDepts', this.treeNode) // 传出要添加子部门的节点
      } else if (type === 'edit') {
        // 编辑
        this.$emit('editDepts', this.treeNode) // 点击编辑 传出要编辑的节点
      } else {
        // 删除
        this.$confirm('您是否确定要删除该部门吗').then(() => {
          return delDepartments(this.treeNode.id)
        }).then(() => {
          // 此时已经确定
          // 应该告诉父组件 更新数据
          this.$emit('delDepts')
          this.$message.success('删除部门成功')
        })
      }
    }
  }
}
</script>

<style>

</style>
