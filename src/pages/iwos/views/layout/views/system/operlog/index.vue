<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="操作地址" prop="operIp">
        <el-input
            v-model="queryParams.operIp"
            placeholder="请输入操作地址"
            clearable
            style="width: 240px;"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="系统模块" prop="title">
        <el-input
            v-model="queryParams.title"
            placeholder="请输入系统模块"
            clearable
            style="width: 240px;"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="操作人员" prop="operName">
        <el-input
            v-model="queryParams.operName"
            placeholder="请输入操作人员"
            clearable
            style="width: 240px;"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="类型" prop="businessType">
        <el-select
            v-model="queryParams.businessType"
            placeholder="操作类型"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_oper_type')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="操作状态"
            clearable
            style="width: 240px"
        >
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_common_status')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="操作时间">
        <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8 one-screen-fg0">
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            :disabled="multiple"
            @click="handleDelete"
            v-hasPermission="['system:operlog:remove']"
        >删除
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="danger"
            plain
            icon="el-icon-delete"
            size="small"
            @click="handleClean"
            v-hasPermission="['system:operlog:remove']"
        >清空
        </el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
            type="warning"
            plain
            icon="el-icon-download"
            size="small"
            @click="handleExport"
            v-hasPermission="['system:operlog:export']"
        >导出
        </el-button>
      </el-col>
    </el-row>

    <el-table ref="tables" v-loading="loading" class="one-screen-fg1" height="100%" :data="list" border @selection-change="handleSelectionChange" :default-sort="defaultSort" @sort-change="handleSortChange">
      <el-table-column type="selection" width="50" align="center"/>
      <el-table-column label="日志编号" align="center" prop="operId"/>
      <el-table-column label="系统模块" align="center" prop="title" :show-overflow-tooltip="true"/>
      <el-table-column label="操作类型" align="center" prop="businessType">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_oper_type', row.businessType) }}
        </template>
      </el-table-column>
      <el-table-column label="请求方式" align="center" prop="requestMethod"/>
      <el-table-column label="操作人员" align="center" prop="operName" width="110" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']"/>
      <el-table-column label="操作地址" align="center" prop="operIp" width="130" :show-overflow-tooltip="true"/>
      <el-table-column label="操作状态" align="center" prop="status">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_common_status', row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作日期" align="center" prop="operTime" width="180" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.operTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="消耗时间" align="center" prop="costTime" width="110" :show-overflow-tooltip="true" sortable="custom" :sort-orders="['descending', 'ascending']">
        <template slot-scope="scope">
          <span>{{ scope.row.costTime }}毫秒</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="text"
              icon="el-icon-view"
              @click="handleView(scope.row,scope.index)"
              v-hasPermission="['system:operlog:query']"
          >详细
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>

    <!-- 操作日志详细 -->
    <el-dialog title="操作日志详细" :visible.sync="open" width="800px" append-to-body>
      <el-form ref="form" :model="form" label-position="left" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="操作模块：">{{ form.title }} / {{ $store.getters['dictionaries/MATCH_LABEL']('sys_oper_type', form.businessType) }}</el-form-item>
            <el-form-item
                label="登录信息："
            >{{ form.operName }} / {{ form.operIp }}
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="请求地址：">{{ form.operUrl }}</el-form-item>
            <el-form-item label="请求方式：">{{ form.requestMethod }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="操作方法：">{{ form.method }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="请求参数：">{{ form.operParam }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="返回参数：">{{ form.jsonResult }}</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作状态：">
              <div v-if="form.status === 0">正常</div>
              <div v-else-if="form.status === 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="消耗时间：">{{ form.costTime }}毫秒</el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="操作时间：">{{ $$dateFormatterYMDHMS(form.operTime) }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status === 1">{{ form.errorMsg }}</el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="open = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "OperLogIndex",
  dicts: ['sys_oper_type', 'sys_common_status'],
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 默认排序
      defaultSort: {prop: 'operTime', order: 'descending'},
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        operIp: undefined,
        title: undefined,
        operName: undefined,
        businessType: undefined,
        status: undefined
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志 */
    getList() {
      this.loading = true;
      this.$$api.operlog.list({params: this.$$addDateRange(this.queryParams, this.dateRange)}).then(({res: response, err, total}) => {
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
      this.$refs.tables.sort(this.defaultSort.prop, this.defaultSort.order)
    },
    /** 多选框选中数据 */
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.operId)
      this.multiple = !selection.length
    },
    /** 排序触发事件 */
    handleSortChange(column, prop, order) {
      this.queryParams.orderByColumn = column.prop;
      this.queryParams.isAsc = column.order;
      this.getList();
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const operIds = row.operId || this.ids;
      this.$$Dialog.confirm('是否确认删除日志编号为"' + operIds + '"的数据项？').then(() => {
        return this.$$api.operlog.delOperlog({operId: operIds});
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$$Dialog.confirm('是否确认清空所有操作日志数据项？').then(() => {
        return this.$$api.operlog.cleanOperlog();
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("清空成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */ async handleExport() {
      const {res, err} = await this.$$api.operlog.export({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `operlog_${new Date().getTime()}.xlsx`);
      // this.download('system/operlog/export', {
      //   ...this.queryParams
      // }, `operlog_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>

