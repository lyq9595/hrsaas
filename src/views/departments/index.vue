<template>
  <div class="dashboard-container">
    <div class="app-container">
      <!-- 头部内容 -->
      <el-card class="tree-card">
        <!-- 结构内容 -->
        <tree-tools :tree-node="company" :is-root="true" @addDepts="addDepts" />
        <!-- el-tree -->
        <el-tree
          :data="departs"
          :props="defaultProps"
          :default-expand-all="true"
        >
          <!-- 传入内容  插槽内容 会循环多次 有多少节点 就会循环多少次-->
          <!-- 作用于插槽 slot-scope='obj' 接收传递给插槽的数据  data每个节点的对象-->
          <tree-tools
            slot-scope="{ data }"
            :tree-node="data"
            @addDepts="addDepts"
            @delDepts="getDepartments"
            @editDepts="editDepts"
          />
        </el-tree>
      </el-card>
    </div>
    <!-- 放置新增弹窗样式 -->
    <add-dept
      ref="addDept"
      :show-dialog.sync="showDialog"
      :tree-node="node"
      @addDepts="getDepartments"
    />
  </div>
</template>

<script>
import TreeTools from './components/tree-tool.vue'
import AddDept from './components/add-dept.vue'
import { getDepartments } from '@/api/departments.js'
import { tranListToTreeData } from '@/utils'

export default {

  components: {
    TreeTools,
    AddDept
  },
  data() {
    return {
      company: {}, // 头部数据结构
      departs: [],
      defaultProps: {
        label: 'name',
        children: 'children'
      },
      showDialog: false,
      node: null // 记录当前点击的node节点
    }
  },

  created() {
    this.getDepartments() // 调用自身的方法
  },
  methods: {
    async getDepartments() {
      const result = await getDepartments()
      // this.company = { name: result.companyName, manager: '负责人' }
      this.company = {
        name: '奥特之星奥特信息有限公司 ',
        manager: '负责人',
        id: ''
      }
      this.departs = tranListToTreeData(result.depts, '') // 需要将其转化成树形结构
      // console.log(result)
    },
    // 监听tree-tools点击添加的事件
    addDepts(node) {
      this.showDialog = true // 显示弹层
      this.node = node
    },
    // 编辑部门
    editDepts(node) {
      this.showDialog = true
      this.node = node
      this.$refs.addDept.getDepartDetail(node.id)
    }
  }

}
</script>

<style>
.tree-card {
  padding: 30px 140px;
  font-size: 14px;
}

@media screen and (max-width: 480px) {
  .tree-tools {
    min-width: 300px !important;
  }
  .tree-card {
    padding: 10px 10px;
  }
  .el-card {
    font-size: 0.7rem;
  }
}
</style>
