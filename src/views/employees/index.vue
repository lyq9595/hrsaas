<template>
  <div class="dashboard-container">
    <div class="app-container">
      <page-tools :show-before="true">
        <!-- 左侧显示记录 -->
        <template v-slot:before>
          <span>共{{ page.total }}条记录</span>
        </template>
        <!-- 右侧显示按钮 -->
        <template slot="after">
          <el-button size="small" type="warning" @click="$router.push('/import')">导入</el-button>
          <el-button size="small" type="danger" @click="exportData">导出</el-button>
          <el-button :disabled="checkPermission('POINT-USER-ADD')" size="small" type="primary" @click="showDialog = true">新增员工</el-button>
        </template>
      </page-tools>
      <!-- 放置表格和分页 -->
      <el-card v-loading="loading">
        <el-table border :data="list">
          <el-table-column label="序号" sortable="" type="index" />
          <el-table-column label="姓名" sortable="" prop="username" />
          <el-table-column label="头像" width="120px" align="center">
            <template v-slot="{row}">
              <img
                v-imageerror="require('@/assets/common/head.jpg')"
                :src="row.staffPhoto"
                style="border-radius: 50%; width: 100px; height: 100px; padding: 10px"
                alt=""
                @click="showQrCode(row.staffPhoto)"
              >
            </template>
          </el-table-column>
          <el-table-column label="工号" sortable="" prop="workNumber" />
          <el-table-column label="聘用形式" sortable="" prop="formOfEmployment" :formatter="formEmployment" />
          <el-table-column label="部门" sortable="" prop="departmentName" />
          <!-- 作用于插槽+过滤器 -->
          <el-table-column label="入职时间" sortable="" prop="timeOfEntry">
            <template slot-scope="{row}">
              <!-- 事件格式化 -->
              {{ row.timeOfEntry | formatDate }}
            </template>
          </el-table-column>

          <el-table-column label="账户状态" align="center" sortable="" prop="enableState">
            <template slot-scope="{ row }">
              <!-- 根据当前状态来确定 是否打开开关 -->
              <el-switch :value="row.enableState === 1" />
            </template>
          </el-table-column>

          <el-table-column label="操作" sortable="" fixed="right" width="280">
            <template v-slot="{ row }">
              <el-button type="text" size="small" @click="$router.push(`/employees/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="small">转正</el-button>
              <el-button type="text" size="small">调岗</el-button>
              <el-button type="text" size="small">离职</el-button>
              <el-button type="text" size="small" @click="editRole(row.id)">角色</el-button>
              <el-button type="text" size="small" @click="delEmployee(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <el-row type="flex" justify="center" align="middle" style="height: 60px">
          <el-pagination
            layout="prev, pager, next"
            :page-size="page.size"
            :current-page="page.page"
            :total="page.total"
            @current-change="changePage"
          />
        </el-row>
      </el-card>
    </div>
    <!-- sync 作用域属性后方 子组件不需要监听事件也能触发父组件函数 -->
    <add-employee :show-dialog.sync="showDialog" />
    <el-dialog title="二维码" :visible.sync="showCodeDialog" @close="imgUrl=''">
      <el-row type="flex" justify="center">
        <canvas ref="myCanvas" />
      </el-row>
    </el-dialog>
    <!-- 放置分配角色组件 -->
    <assign-role ref="assignRole" :show-role-dialog.sync="showRoleDialog" :user-id="userId" />
  </div>
</template>

<script>
import { getEmployeeList, delEmployee } from '@/api/employees'
import EmployeeEnum from '@/api/constant/employees' // 引入员工枚举对象
import AddEmployee from './components/add-employee.vue'
import { formatDate } from '@/filters'
import QrCode from 'qrcode'
import AssignRole from './components/assign-role.vue'

export default {
  components: {
    AddEmployee,
    AssignRole
  },
  data() {
    return {
      loading: false,
      list: [], // 接数据的
      page: {
        page: 1, // 当前页码
        size: 10,
        total: 0 // 总数
      },
      showDialog: false,
      showCodeDialog: false,
      showRoleDialog: false,
      userId: null
    }
  },
  created() {
    this.getEmployeeList()
  },
  methods: {
    changePage(newPage) {
      this.page.page = newPage
      this.getEmployeeList()
    },

    async getEmployeeList() {
      this.loading = true
      const { total, rows } = await getEmployeeList(this.page)
      this.page.total = total
      this.list = rows
      this.loading = false
    },
    // 格式化聘用形式
    formEmployment(row, column, cellValue, index) {
      // 找cellvalue对应的值
      const obj = EmployeeEnum.hireType.find(item => item.id === cellValue)
      return obj ? obj.value : '未知'
    },
    // 删除员工
    async delEmployee(id) {
      try {
        await this.$confirm('确定删除改员工吗?')
        await delEmployee(id)
        this.$message.success('删除员工成功')
        this.getEmployeeList()
      } catch (error) {
        console.log(error)
      }
    },
    // 导出excel
    exportData() {
      import('@/vendor/Export2Excel').then(async excel => {
        // 表头中英
        const headers = {
          '姓名': 'username',
          '手机号': 'mobile',
          '入职日期': 'timeOfEntry',
          '聘用形式': 'formOfEmployment',
          '转正日期': 'correctionTime',
          '工号': 'workNumber',
          '部门': 'departmentName'
        }
        // 1 导出header从哪来
        // 2  data从哪来 list只有10条 没有接口获取所有数据 100 1 100 结构如何转换
        const { rows } = await getEmployeeList({ page: 1, size: this.page.total })
        const data = this.formatJson(headers, rows) // 返回的data就是要导出的结构
        const multiHeader = [['姓名', '主要信息', '', '', '', '', '部门']]
        const merges = ['A1:A2', 'B1:F1', 'G1:G2']
        excel.export_json_to_excel({
          header: Object.keys(headers),
          data,
          filename: '员工信息表',
          multiHeader, // 复杂表头
          merges // 合并选项
        })

        // excel是引入文件导入的对象
        // excel.export_json_to_excel({
        //   header: ['姓名', '工资'],
        //   data: [['zs', 2000], ['ls', 5000]],
        //   filename: '员工工资表',
        //   bookType: 'txt'
        // })
        // [{username:'zs',mobile;13040571109}]=>[[]]
        // 要转换数据结构还要和表头对应上
        // 要求转出的标题是中文
      })
    },
    // excel数组数据结构转换 将表头数据和数组进行对应
    formatJson(headers, rows) {
      return rows.map(item => {
        // item是一个对象  {mobile:131,username:zs} Object.keys(headers)[手机号，姓名，入职日期]
        return Object.keys(headers).map(key => {
          // 需要判断时间字段
          if (headers[key] === 'timeOfEntry' || headers[key] === 'correctionTime') {
            // 格式化日期
            return formatDate(item[headers[key]])
          } else if (headers[key] === 'formOfEmployment') {
            console.log(EmployeeEnum.hireType)
            const obj = EmployeeEnum.hireType.find(obj => obj.id === item[headers[key]])
            return obj ? obj.value : '未知'
          }
          return item[headers[key]]
        })
      })
    },
    showQrCode(url) {
      // url存在才弹层

      if (url) {
        this.showCodeDialog = true
        // 可以等到渲染完毕后执行
        this.$nextTick(() => {
          QrCode.toCanvas(this.$refs.myCanvas, url) // 将地址转化为二维码链接
        })
      } else {
        this.$message.warning('员工未上传头像')
      }
    },
    async editRole(userId) {
      this.userId = userId // prop赋值 props赋值渲染异步的
      await this.$refs.assignRole.getUserDetailById(userId)// 调用自组建方法 异步方法
      this.showRoleDialog = true // 弹层
    }

  }

}
</script>

<style>

</style>
