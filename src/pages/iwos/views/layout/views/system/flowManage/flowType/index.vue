<template>
  <div class="one-screen">
    <div class="table-panel one-screen-fg1">
      <JsTable :dataSource="dataSource" :columns="columns"> </JsTable>
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
    <el-dialog :title="title" :visible.sync="open" width="6rem" append-to-body :close-on-click-modal="!1">
      <div>
        <span>目前没有真实数据，展示的为测试数据</span>
        <el-image class="Image" :src="currentIMageUrl" :preview-src-list="currentIMageUrlList"></el-image>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import JsTable from "@/components/js-table/index.vue";
export default {
  name: "flowType",
  components: { JsTable },
  data() {
    return {
      // 遮罩层
      loading: false,
      // 总条数
      total: 0,
      // 弹出层标题
      title: "流程类型详情",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      currentIMageUrl:
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
      currentIMageUrlList:["https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
      },
      columns: {
        selection: true,
        props: [
          {
            name: "流程名称",
            key: "name",
          },
          {
            name: "创建日期",
            key: "deployTime ",
          },
          {
            name: "版本号",
            key: "procdefVersion",
          },
          {
            name: "流程关键字",
            key: "procdefKey",
          },
        ],
        options: {
          btns: [
            {
              label: "详情",
              key: "detail",
              // permission: ['config:fileStrage:edit'],
              event: (val) => {
                this.getDetail(val);
                //   this.getSourceTree();
              },
            },
          ],
        },
      },
      dataSource: [],
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
      this.$$api.flowManage
        .flowTypeList({
          params: {
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
.unit {
  margin-left: 5px;
}
</style>
