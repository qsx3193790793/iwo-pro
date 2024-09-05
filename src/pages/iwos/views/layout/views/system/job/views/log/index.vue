<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="任务名称" prop="jobName">
        <el-input
            v-model="queryParams.jobName"
            placeholder="请输入任务名称"
            clearable
            style="width: 200px"
            maxlength="30"
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="任务组名" prop="jobGroup">
        <el-select
            v-model="queryParams.jobGroup"
            placeholder="请选择任务组名"
            clearable
            style="width: 200px"
        >
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_job_group')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="执行状态" prop="status">
        <el-select
            v-model="queryParams.status"
            placeholder="请选择执行状态"
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
      <el-form-item label="执行时间">
        <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="small" :disabled="multiple" @click="handleDelete" v-hasPermission="['monitor:job:remove']">删除</el-button>
        <el-button type="danger" plain icon="el-icon-delete" size="small" @click="handleClean" v-hasPermission="['monitor:job:remove']">清空</el-button>
        <el-button type="warning" plain icon="el-icon-download" size="small" @click="handleExport" v-hasPermission="['monitor:job:export']">导出</el-button>

      </el-form-item>
    </el-form>

    <el-table v-loading="loading" class="one-screen-fg1" height="100%" ref="table" :data="jobLogList" border @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"/>
      <el-table-column label="日志编号" width="80" align="center" prop="jobLogId"/>
      <el-table-column label="任务名称" align="center" prop="jobName" :show-overflow-tooltip="true"/>
      <el-table-column label="任务组名" align="center" prop="jobGroup" :show-overflow-tooltip="true">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_job_group', row.jobGroup) }}
        </template>
      </el-table-column>
      <el-table-column label="调用目标字符串" align="center" prop="invokeTarget" :show-overflow-tooltip="true"/>
      <el-table-column label="日志信息" align="center" prop="jobMessage" :show-overflow-tooltip="true"/>
      <el-table-column label="执行状态" align="center" prop="status">
        <template slot-scope="{row}">
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_common_status', row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="执行时间" align="center" prop="createTime" width="180">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button size="small" type="primary" @click="handleView(scope.row)" v-hasPermission="['monitor:job:query']">详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>

    <!-- 调度日志详细 -->
    <el-dialog title="调度日志详情" :visible.sync="open" width="700px" append-to-body :close-on-click-modal="!1">
      <el-form ref="form" :model="form" label-position="left" label-width="100px" size="small">
        <el-row>
          <el-col :span="12">
            <el-form-item label="日志序号：">{{ form.jobLogId }}</el-form-item>
            <el-form-item label="任务名称：">{{ form.jobName }}</el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="任务分组：">{{ form.jobGroup }}</el-form-item>
            <el-form-item label="执行时间：">{{ form.createTime }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="调用方法：">{{ form.invokeTarget }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="日志信息：">{{ form.jobMessage }}</el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="执行状态：">
              <div v-if="form.status == 0">正常</div>
              <div v-else-if="form.status == 1">失败</div>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="异常信息：" v-if="form.status == 1">{{ form.exceptionInfo }}</el-form-item>
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
  name: "JobLog",
  dicts: ['sys_common_status', 'sys_job_group'],
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
      // 调度日志表格数据
      jobLogList: [],
      // 是否显示弹出层
      open: false,
      // 日期范围
      dateRange: [],
      // 表单参数
      form: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        jobName: undefined,
        jobGroup: undefined,
        status: undefined
      }
    };
  },
  created() {
    const jobId = this.$route.params && this.$route.params.jobId;
    if (jobId !== undefined && jobId != 0) {
      this.$$api.job.getJob({jobId}).then(({res: response, err}) => {
        if (err) return;
        this.queryParams.jobName = response.jobName;
        this.queryParams.jobGroup = response.jobGroup;
        this.getList();
      });
    } else {
      this.getList();
    }
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    /** 查询调度日志列表 */
    getList() {
      this.loading = true;
      this.$$api.job.listJobLog({params: this.$$addDateRange(this.queryParams, this.dateRange)}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.jobLogList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 返回按钮
    handleClose() {
      // const obj = {path: "/monitor/job"};
      // this.$tab.closeOpenPage(obj);
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
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.jobLogId);
      this.multiple = !selection.length;
    },
    /** 详细按钮操作 */
    handleView(row) {
      this.open = true;
      this.form = row;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const jobLogIds = this.ids;
      this.$$Dialog.confirm('是否确认删除调度日志编号为"' + jobLogIds + '"的数据项？').then(() => {
        return this.$$api.job.delJobLog({jobLogId: jobLogIds});
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
    /** 清空按钮操作 */
    handleClean() {
      this.$$Dialog.confirm('是否确认清空所有调度日志数据项？').then(() => {
        return this.$$api.job.cleanJobLog();
      }).then(({res, err}) => {
        if (err) return;
        this.getList();
        this.$$Toast.success("清空成功");
      }).catch(() => {
      });
    },
    /** 导出按钮操作 */ async handleExport() {
      const {res, err} = await this.$$api.job.exportLog({data: this.queryParams});
      if (res.blob) this.$$fileSaveAs(res.blob, `job_log_${new Date().getTime()}.xlsx`);
      // this.download('schedule/job/log/export', {
      //   ...this.queryParams
      // }, `log_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
