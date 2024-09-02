<template>
  <div class="one-screen">
    <PageSearchPanel
      ref="PageSearchPanelRef"
      :formConfigItems="formConfigItems"
    ></PageSearchPanel>
    <div class="table-panel one-screen-fg1">
      <JsTable :dataSource="dataSource" :columns="columns">
      </JsTable>
      <el-pagination
        :current-page.sync="queryParams.pageNum"
        :page-size.sync="queryParams.pageSize"
        :page-sizes="[15, 30, 40, 50]"
        background
        layout=" ->,total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="10rem" append-to-body>
      <div class="detail_info">
        <div class="Image_area">
          <el-image
            :src="currentIMageUrl"
            :preview-src-list="currentIMageUrlList"
          ></el-image>
          <!-- <span >点击图片实现大图预览</span> -->
        </div>
        <div>
          <JsTable :dataSource="dataSource" :columns="columns"> </JsTable>
          <el-pagination
            :current-page.sync="queryParams.pageNum"
            :page-size.sync="queryParams.pageSize"
            :page-sizes="[5]"
            background
            layout=" ->,total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getList"
            @current-change="getList"
          />
        </div>
      </div>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsTable from "@/components/js-table/index.vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";

export default {
  name: "intransitOrder",
  components: { JsTable, PageSearchPanel },
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
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "在途工单详情",
      // 是否显示弹出层
      open: false,
      // 机构名称
      deptName: undefined,
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      //投诉来源树
      complaint_source_tree: [],
      // 表单参数
      form: {},
      currentIMageUrl:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      currentIMageUrlList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      ],
      formConfigItems: [
        {
          name: "工单编号",
          key: "businessKey",
          value: "",
          col: 6,
          type: "input",
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: "流程类型",
          key: "procdefName",
          value: "",
          col: 6,
          type: "input",
          isDisable: !1,
          isRequire: !1,
        },

        // {
        //   name: "投诉来源",
        //   key: "complaintSource",
        //   value: "",
        //   col: 6,
        //   type: "cascader",
        //   options: () => this.complaint_source_tree,
        //   attrs: { props: { checkStrictly: !0 } },
        //   isDisable: !1,
        //   isRequire: !1,
        // },
        { col: 6, type: "divider-empty" },
        {
          type: "buttons",
          align: "right",
          verticalAlign: "top",
          col: 6,
          items: [
            {
              btnName: "重置",
              type: "button",
              attrs: { type: "" },
              col: 1,
              onClick: ({ vm }) => {
                vm.resetFormData();
                this.resetQuery();
              },
            },
            {
              btnName: "查询",
              type: "button",
              attrs: { type: "primary" },
              col: 1,
              onClick: ({ vm }) => {
                this.getList();
              },
            },
          ],
        },
      ],
      columns: {
        selection: true,
        props: [
          {
            name: "流程类型",
            key: "procdefName",
          },
          {
            name: "工单编号",
            key: "businessKey",
          },
          {
            name: "当前状态",
            key: "state",
          },
          {
            name: "当前节点",
            key: "taskName",
          },
          {
            name: "创单时间",
            key: "startTime",
          },
        ],
        options: {
          btns: [
            {
              label: "详情",
              key: "detail",
              // permission: ['config:fileStrage:edit'],
              event: (val) => {
                // this.getDetail(val.id);
                //   this.handleUpdate(val);
                //   this.getSourceTree();
              },
            },
          ],
        },
      },
      dataSource: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        channelLevel: undefined,
        pcode: undefined,
      },
    };
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  mounted() {
    this.getList();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      let copyData = JSON.parse(JSON.stringify(formData));
      if (copyData?.complaintSource && copyData?.complaintSource.length > 0) {
        copyData.complaintSource =
          copyData.complaintSource[copyData.complaintSource.length - 1];
      }
      this.$$api.flowManage
        .intransitOrderList({
          data: {
            ...copyData,
            ...this.queryParams,
          },
        })
        .then(({ res: response, err }) => {
          if (err) return;
          this.dataSource = response.rows;
          this.total = response.total;
          this.loading = false;
        });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orderType: undefined,
        complaintSource: undefined,
        archiveRuleId: undefined,
      };
      this.$refs["form"]?.resetFields();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.$refs["queryForm"]?.resetFields();
      this.handleQuery();
    },
    // 获取详情数据
    getDetail(archiveRuleId) {
      this.loading = true;
      this.open = true;
      // this.$$api.complaintOnFileStrategy
      //     .detailOnFileStrategy({
      //       archiveRuleId,
      //     })
      //     .then(({res: response, err}) => {
      //       if (err) return;
      //       let {
      //         archiveRuleId,
      //         archiveTime,
      //         complaintSource,
      //         orderType,
      //         satisfied,
      //       } = {...response};
      //       this.form = {
      //         archiveRuleId,
      //         archiveTime: Number(archiveTime),
      //         complaintSource,
      //         orderType,
      //         satisfied,
      //       };
      //     });
    },
  },
};
</script>
<style scoped lang="scss">
.queryItem {
  width: 100%;
}
.detail_info {
  display: flex;
  flex-direction: column;
  .Image_area {
    height: 100px;
    padding: 10px 10px 1px;
  }
}
::v-deep .el-image {
  height: 100%;
}
</style>
