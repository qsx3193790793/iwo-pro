<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
            v-model="queryParams.ipaddr"
            placeholder="请输入登录地址"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>

    </el-form>
    <el-table v-loading="loading" class="one-screen-fg1" height="100%" ref="table" :data="list" border style="width: 100%;">
      <el-table-column label="序号" type="index" align="center"></el-table-column>
      <el-table-column label="会话编号" align="center" prop="tokenId" :show-overflow-tooltip="true"/>
      <el-table-column label="登录名称" align="center" prop="userName" :show-overflow-tooltip="true"/>
      <el-table-column label="主机" align="center" prop="ipaddr" :show-overflow-tooltip="true"/>
      <el-table-column label="登录时间" align="center" prop="loginTime" width="180">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.loginTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="text"
              icon="el-icon-delete"
              @click="handleForceLogout(scope.row)"
              v-hasPermission="['monitor:online:forceLogout']"
          >强退
          </el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>

export default {
  name: "OnlineIndex",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      pageNum: 1,
      pageSize: 15,
      // 查询参数
      queryParams: {
        ipaddr: undefined,
        userName: undefined
      }
    };
  },
  created() {
    this.getList();
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      this.$$api.online.list({params: this.queryParams}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.list = response.rows;
        // this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs['queryForm']?.resetFields();
      this.handleQuery();
    },
    /** 强退按钮操作 */
    handleForceLogout(row) {
      this.$$Dialog.confirm('是否确认强退名称为"' + row.userName + '"的用户？').then(() => {
        return this.$$api.online.forceLogout({tokenId: row.tokenId});
      }).then(({res, err}) => {
        if (err) return
        this.getList();
        this.$$Toast.success("强退成功");
      }).catch(() => {
      });
    }
  }
};
</script>

