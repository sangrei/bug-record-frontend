<template>
  <div id="users">
    <el-row :gutter="20">
      <el-col :span="22">
        <!--面包屑,展现页面导航-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>人员信息</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="2">
        <el-button @click="showDetail(null)" type="text" size="small"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-card>
      <el-table :data="users" style="width: 100%">
        <el-table-column prop="id" label="ID" width="40"> </el-table-column>
        <el-table-column prop="username" label="用户名"> </el-table-column>
        <el-table-column prop="password" label="密码"> </el-table-column>
        <el-table-column prop="name" label="姓名"> </el-table-column>
        <el-table-column prop="createByName" label="创建人" width="80">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column prop="updateByName" label="修改人" width="80">
        </el-table-column>
        <el-table-column prop="updateTime" label="修改时间" width="200">
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="100">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="showDetail(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              @click="deleteData(scope.row.id)"
              type="text"
              size="small"
              style="color: red"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="search.pageIndex"
        :page-sizes="[5, 10, 15, 20, 25]"
        :page-size="search.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <el-dialog
      title="人员信息"
      :visible="detailVisible"
      :show-close="false"
      :destroy-on-close="true"
    >
      <user-detail
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="detailVisible"
      ></user-detail>
    </el-dialog>
  </div>
</template>
<script>
import * as userApi from '@/api/user'
import UserDetail from '@/components/users/UserDetail'
export default {
  name: 'users',
  components: {
    UserDetail,
  },
  data() {
    return {
      detailVisible: false,
      users: [],
      search: {
        pageIndex: 1, //当前页号
        pageSize: 5, //每页数量
      },
      total: 0, //记录总数
      currentId: null,
    }
  },
  created() {
    this.getInitData()
  },
  methods: {
    //获取数据
    getInitData() {
      userApi.query(this.search).then((response) => {
        let responseData = response.data
        if (responseData.code == 0) {
          //设置数据和页数
          this.users = responseData.data
          this.total = responseData.total
        } else {
          this.$message({
            message: responseData.message,
            type: 'warning',
          })
        }
      })
    },
    //显示详情弹窗
    showDetail(id) {
      //设置传递的id
      this.currentId = id
      //显示弹出对话框
      this.detailVisible = true
    },
    //保存成功回调
    callbackForSave() {
      //隐藏弹窗
      this.detailVisible = false
      //重新获取数据列表
      this.getInitData()
    },
    //取消回调
    callbackForCancel() {
      //隐藏弹窗
      this.detailVisible = false
    },
    //删除
    deleteData(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          userApi.remove(id).then((response) => {
            let responseData = response.data
            if (responseData.code == 0) {
              //重新计算当前页号，解决最后一页只有一条记录时，当前页为空的问题
              this.reCalculatePageIndex()
              //重新加载数据
              this.getInitData()
              //提示
              this.$message({
                message: '删除成功。',
                type: 'success',
              })
            } else {
              this.$message({
                message: responseData.message,
                type: 'warning',
              })
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    handleSizeChange(val) {
      this.search.pageSize = val
      //重新加载数据
      this.getInitData()
    },
    handleCurrentChange(val) {
      this.search.pageIndex = val
      //重新加载数据
      this.getInitData()
    },
    //删除时，重新计算当前页
    reCalculatePageIndex() {
      //如果当前页大于数据的最大页号，取最大页号为当前页
      if (
        this.search.pageIndex >
        Math.ceil((this.total - 1) / this.search.pageSize)
      ) {
        this.search.pageIndex = Math.ceil(
          (this.total - 1) / this.search.pageSize
        )
      }
    },
  },
}
</script>