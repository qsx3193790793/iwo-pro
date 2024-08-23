<template>
  <!-- 授权用户 -->
  <el-dialog title="选择用户" :visible.sync="visible" width="800px" top="5vh" append-to-body>
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true">
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            placeholder="请输入用户名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phonenumber">
        <el-input
            v-model="queryParams.phonenumber"
            placeholder="请输入手机号码"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>
    <el-row>
      <el-table @row-click="clickRow" ref="table" :data="userList" border @selection-change="handleSelectionChange" height="260px">
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column label="用户名称" prop="userName" :show-overflow-tooltip="true"/>
        <el-table-column label="用户昵称" prop="nickName" :show-overflow-tooltip="true"/>
        <el-table-column label="邮箱" prop="email" :show-overflow-tooltip="true"/>
        <el-table-column label="手机" prop="phonenumber" :show-overflow-tooltip="true"/>
        <el-table-column label="状态" align="center" prop="status">
          <template slot-scope="{row}">
            <!--            <dict-tag :options="$$dictionaries.get('sys_normal_disable')" :value="scope.row.status"/>-->
                {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable',row.status) }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180">
          <template slot-scope="scope">
            <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>
    </el-row>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleSelectUser">确 定</el-button>
      <el-button @click="visible = false">取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  dicts: ['sys_normal_disable'],
  props: {
    // 角色编号
    roleId: {
      type: [Number, String]
    }
  },
  data() {
    return {
      // 遮罩层
      visible: false,
      // 选中数组值
      userIds: [],
      // 总条数
      total: 0,
      // 未授权用户数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        roleId: undefined,
        userName: undefined,
        phonenumber: undefined
      }
    };
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    // 显示弹框
    show() {
      this.queryParams.roleId = this.roleId;
      this.getList();
      this.visible = true;
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.userIds = selection.map(item => item.userId);
    },
    // 查询表数据
    getList() {
      this.$$api.role.unallocatedUserList({params: this.queryParams}).then(({res, err, total}) => {
        if (err) return;
        this.userList = res.rows;
        this.total = res.total;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs['queryForm']?.resetFields();
      this.handleQuery();
    },
    /** 选择授权用户操作 */
    handleSelectUser() {
      const roleId = this.queryParams.roleId;
      const userIds = this.userIds.join(",");
      if (userIds == "") {
        this.$$Toast.error("请选择要分配的用户");
        return;
      }
      this.$$api.role.authUserSelectAll({params: {roleId: roleId, userIds: userIds}}).then(({res, err}) => {
        if (err) return;
        this.$$Toast.success('授权成功');
        this.visible = false;
        this.$emit("ok");
      });
    }
  }
};
</script>
