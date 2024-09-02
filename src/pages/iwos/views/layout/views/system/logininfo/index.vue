<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="登录地址" prop="ipaddr">
        <el-input
            v-model="queryParams.ipaddr"
            maxlength="30"
            placeholder="请输入登录地址"
            clearable
             class="queryItem"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户名称" prop="userName">
        <el-input
            v-model="queryParams.userName"
            maxlength="30"
            placeholder="请输入用户名称"
            clearable
             class="queryItem"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="登录状态"
            clearable
             class="queryItem"
        >
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_common_status')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="登录时间">
        <el-date-picker
            v-model="dateRange"
            class="queryItem"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button  size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary"  size="small" @click="handleQuery">查询</el-button>
        <el-button
            type="danger"
            plain
            size="small"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermission="['system:logininfor:remove']"
        >删除
        </el-button>
        <el-button
            type="danger"
            plain
            size="small"
            @click="handleClean"
            v-hasPermission="['system:logininfor:remove']"
        >清空
        </el-button>
        <el-button
            type="primary"
            plain
            size="small"
            :disabled="single"
            @click="handleUnlock"
            v-hasPermission="['system:logininfor:unlock']"
        >解锁
        </el-button>
        <el-button
            type="warning"
            plain
            size="small"
            @click="handleExport"
            v-hasPermission="['system:logininfor:export']"
        >导出
        </el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8 one-screen-fg0">
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">

      </el-col>
    </el-row> -->

    <el-table ref="table" v-loading="loading" class="one-screen-fg1" height="100%" :data="list" border @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="访问编号" align="center" prop="infoId"/>
      <el-table-column label="用户名称" align="center" prop="userName" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="地址" align="center" prop="ipaddr" width="130" :show-overflow-tooltip="true"/>
      <el-table-column label="登录状态" align="center" prop="status">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_common_status', row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="描述" align="center" prop="msg" :show-overflow-tooltip="true"/>
      <el-table-column label="访问时间" align="center" prop="accessTime" sortable="custom" :sort-orders="['descending', 'ascending']" width="180">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.accessTime) }}</span>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>
  </div>
</template>

<script>
import {$$addDateRange} from "@/utils";

export default {
  name: "LoginInfoIndex",
  dicts: ['sys_common_status'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 选择用户名
      selectName: "",
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: {prop: 'accessTime', order: 'descending'},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        ipaddr: undefined,
        userName: undefined,
        status: undefined
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
      this.$$api.logininfor.list({params: this.$$addDateRange(this.queryParams, this.dateRange)}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.list = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.$refs['queryForm']?.resetFields();
      this.queryParams.pageNum = 1;
      this.$refs.table.sort(this.defaultSort.prop, this.defaultSort.order)
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.infoId)
      this.single = selection.length != 1
      this.multiple = !selection.length
      this.selectName = selection.map(item => item.userName);
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const infoIds = row.infoId || this.ids;
      this.$$Dialog.confirm('是否确认删除访问编号为"' + infoIds + '"的数据项？').then(() => {
        return this.$$api.logininfor.delLogininfor({infoId: infoIds});
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$$Dialog.confirm('是否确认清空所有登录日志数据项？').then(() => {
        return this.$$api.logininfor.cleanLogininfor();
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("清空成功");
      }).catch(() => {
      });
    },
    /** 解锁按钮操作 */
    handleUnlock() {
      const username = this.selectName;
      this.$$Dialog.confirm('是否确认解锁用户"' + username + '"数据项?').then(() => {
        return this.$$api.logininfor.unlockLogininfor({username});
      }).then(({res, err}) => {
        if (err) return;
        this.$$Toast.success("用户" + username + "解锁成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */ async handleExport() {
      const {res, err} = await this.$$api.logininfor.export({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `logininfor_${new Date().getTime()}.xlsx`);
      // this.download('system/logininfor/export', {
      //   ...this.queryParams
      // }, `logininfor_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
<style scoped lang="scss">
.queryItem {
  width: 240px;
}
</style>

