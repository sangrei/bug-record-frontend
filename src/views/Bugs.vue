<template>
  <div id="bugs">
    <el-row :gutter="20">
      <el-col :span="22">
        <!--面包屑,展现页面导航-->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>首页</el-breadcrumb-item>
          <el-breadcrumb-item>BUG列表</el-breadcrumb-item>
        </el-breadcrumb>
      </el-col>
      <el-col :span="2">
        <el-button @click="showDetail(null)" type="text" size="small"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-card shadow="never" style="margin-top: 5px; margin-bottom: 5px">
      <!--表单，展现查询条件-->
      <el-form
        :inline="true"
        :model="search"
        class="demo-form-inline"
        style="float: left"
      >
        <el-form-item label="BUG标题">
          <el-input v-model="search.title" placeholder="BUG标题"></el-input>
        </el-form-item>
        <el-form-item label="BUG描述">
          <el-input
            v-model="search.description"
            placeholder="BUG描述"
          ></el-input>
        </el-form-item>
        <el-form-item label="开发人员">
          <el-select v-model="search.developerId" placeholder="请选择">
            <el-option key="" label="全部" value=""> </el-option>
            <el-option
              v-for="item in allUsers"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="queryData">查询</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <!--表格，用于呈现数据列表-->
      <!--使用row-key解决子组件不动态渲染的问题-->
      <el-table :data="bugs" :row-key="getRowKey">
        <el-table-column prop="id" label="ID" width="40"> </el-table-column>
        <el-table-column prop="project" label="项目" width="80">
        </el-table-column>
        <el-table-column prop="module" label="模块" width="80">
        </el-table-column>
        <el-table-column prop="title" label="BUG标题" width="180">
        </el-table-column>
        <el-table-column prop="description" label="BUG描述" width="300">
        </el-table-column>
        <el-table-column prop="priority" label="优先级" width="80">
          <template slot-scope="scope">
            <priority-view :priority="scope.row.priority"></priority-view>
          </template>
        </el-table-column>
        <el-table-column prop="severity" label="严重程度" width="80">
          <!--使用表格列组件的slot，访问子级件数据来渲染自定义组件-->
          <template slot-scope="scope">
            <severity-view :severity="scope.row.severity"></severity-view>
          </template>
        </el-table-column>
        <el-table-column prop="versions" label="版本" width="200">
          <!--使用表格列组件的slot，访问子级件数据来渲染第三方组件-->
          <template slot-scope="scope">
            <el-tag
              v-for="item in scope.row.versions"
              :key="item"
              type="info"
              effect="plain"
              style="margin-right: 3px"
            >
              {{ item }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="developerName"
          label="开发人员"
          width="100"
        ></el-table-column>
        <el-table-column prop="createByName" label="创建人" width="100">
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="200">
        </el-table-column>
        <el-table-column prop="updateByName" label="修改人" width="100">
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
      <!--分页组件，使用Elment UI组件-->
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
    <!--弹窗组件，使用Element UI的Dialog组件，嵌套bug详情自定义组件，该组件处理bug的新增、修改-->
    <el-dialog
      title="BUG信息"
      :visible="detailVisible"
      :show-close="false"
      :destroy-on-close="true"
      top="2vh"
    >
      <bug-detail
        :id="currentId"
        @callbackForSave="callbackForSave"
        @callbackForCancel="callbackForCancel"
        v-if="detailVisible"
      ></bug-detail>
    </el-dialog>
  </div>
</template>
<script>
import * as bugApi from '@/api/bug'
import * as userApi from '@/api/user'
import BugDetail from '@/components/bugs/BugDetail'
import PriorityView from '@/components/common/PriorityView'
import SeverityView from '@/components/common/SeverityView'

export default {
  name: 'Bugs',
  components: {
    BugDetail,
    PriorityView,
    SeverityView,
  },
  data() {
    return {
      detailVisible: false, //是否显示详情弹窗
      allUsers: [], //所有用户，用于查询条件初始时绑定所有用户
      bugs: [], //当前查询到的bug列表
      total: 0, //当前bug列表的记录总数
      //查询条件form表单绑定数据，用于将查询条件传递给api/bug.js业务接口
      search: {
        pageIndex: 1, //当前bug列表分页的页号
        pageSize: 5, //当前bug列表分页的每页数量
        title: '',
        description: '',
        developerId: '',
      },
      currentId: null, //临时记录当前编辑时选中的记录的ID，然后传递给bug详情组件
    }
  },
  created() {
    //初始时，获取数据
    this.getInitData()
  },
  methods: {
    //获取数据
    getInitData() {
      //获取所有用户数据
      this.queryAllUser()
      //查询Bug
      this.queryBugs()
    },
    //获取所有用户
    queryAllUser() {
      //查询所有用户数据
      userApi.queryAll().then((response) => {
        let responseData = response.data
        if (responseData.code == 0) {
          this.allUsers = responseData.data
        }
      })
    },
    //查询Bug
    queryBugs() {
      //分页查询bug数据
      bugApi.query(this.search).then((response) => {
        let responseData = response.data
        if (responseData.code == 0) {
          //设置数据和页数
          this.bugs = responseData.data
          this.total = responseData.total
        } else {
          this.$message({
            message: responseData.message,
            type: 'warning',
          })
        }
      })
    },
    //查询数据方法
    queryData() {
      //查询时，需要设置页数为第1页
      this.search.pageIndex = 1
      //获取数据
      this.queryBugs()
    },
    //显示详情弹窗
    showDetail(id) {
      //设置传递的id
      this.currentId = id
      //显示弹出对话框
      this.detailVisible = true
    },
    //隐藏用户详情弹窗
    hideDetail() {
      this.detailVisible = false
    },
    //保存bug成功回调
    callbackForSave() {
      //隐藏弹窗
      this.hideDetail()
      //重新获取数据列表
      this.queryBugs()
    },
    //取消bug回调
    callbackForCancel() {
      //隐藏弹窗
      this.hideDetail()
    },
    //删除bug
    deleteData(id) {
      this.$confirm('确定删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          //删除数据
          bugApi.remove(id).then((response) => {
            let responseData = response.data
            if (responseData.code == 0) {
              //重新计算当前页号，解决最后一页只有一条记录时，当前页为空的问题
              this.reCalculatePageIndex()
              //重新加载数据
              this.queryBugs()
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
    //分页组件每页尺寸变化调用
    handleSizeChange(val) {
      this.search.pageSize = val
      //重新加载数据
      this.queryBugs()
    },
    //分页组件当前页变化调用
    handleCurrentChange(val) {
      this.search.pageIndex = val
      //重新加载数据
      this.queryBugs()
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
    //获取行标识，用于解决Element UI原表格组件的动态子组件不渲染的问题
    getRowKey() {
      return Math.random() + ''
    },
  },
}
</script>