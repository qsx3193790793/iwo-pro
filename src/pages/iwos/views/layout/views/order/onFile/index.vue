<template>
  <div class="one-screen">
    <PageSearchPanel
      ref="PageSearchPanelRef"
      :formConfigItems="formConfigItems"
    ></PageSearchPanel>
    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable
          :dataSource="state.dataSource"
          :columns="state.columns"
          @selectionChange="selectionChange"
        >
          <template #ordernumber="scope">
            <!-- @click="Todetail(scope.row)" -->
            <div style="color: rgb(50, 151, 255); cursor: pointer">
              {{ scope.row.ordernumber }}
            </div>
          </template>
          <template #provinceCode="{ row }">
            <div>
              {{
                $store.getters["dictionaries/MATCH_LABEL"](
                  "base_province_code",
                  row.provinceCode
                )
              }}
            </div>
          </template>
          <template #workorderType="scope">
            <div>
              {{
                $store.getters["dictionaries/MATCH_LABEL"](
                  "search_order_type",
                  scope.row.workorderType
                )
              }}
            </div>
          </template>
        </JsTable>
        <div class="pagination-area">
          <el-pagination
            :current-page.sync="pageInfo.pageNum"
            :page-size.sync="pageInfo.pageSize"
            :page-sizes="[15, 30, 40, 50]"
            background
            layout=" ->,total, sizes, prev, pager, next, jumper"
            :total="pageInfo.rowCount"
            @size-change="getList(1)"
            @current-change="getList"
          />
        </div>
      </div>
    </template>
    <el-empty v-else></el-empty>
    <!-- 添加或修改用户配置对话框 -->
    <el-dialog
      title="归档"
      :visible.sync="state.open"
      width="6rem"
      append-to-body
    >
      <el-form
        ref="FormRef"
        :model="state.form"
        :rules="state.rules"
        label-width="auto"
      >
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="审核意见" prop="auditOpinion">
              <el-input
                type="textarea"
                v-model="state.form.auditOpinion"
                placeholder="请输入"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">归 档</el-button>
        <!-- <el-button @click="cancel">取 消</el-button> -->
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import { getCurrentInstance, ref, onBeforeMount } from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";
import { onMounted } from "vue";
const { proxy } = getCurrentInstance();
let selectData = ref([]);
const selectionChange = (val) => {
  selectData.value = val;
};
// const Todetail = (val) => {
//   console.log(val);
//   proxy.$$router.push({ name: "ComplaintDetail", query: { ID: val.id } });
// };
const FormRef = ref();
// 归档审核
const submitForm = () => {
  state.value.form.taskList = [];
  FormRef.value.validate((valid) => {
    if (valid) {
      state.value.form.taskList = selectData.value.map((ele) => {
        let item = {
          taskId: ele.taskId,
          workorderId: ele.workorderId,
        };
        return item;
      });
      proxy.$$api.complaint
        .examineOnFile({
          data: state.value.form,
        })
        .then(({ res, err }) => {
          if (err) return;
          proxy.$$Toast.success("归档成功");
          state.value.open = false;
          getList(1);
        });
    }
  });
};
const cancel = () => {
  console.log("---77");
};
let state = ref({
  open: false,
  form: {
    auditOpinion: "",
  },
  rules: {
    auditOpinion: [
      { required: true, message: "审核意见不能为空", trigger: "blur" },
    ],
  },
  columns: {
    selection: true,
    props: [
      {
        name: "投诉编号",
        key: "unifiedComplaintCode",
      },
      {
        name: "客户名称",
        key: "appealUserName",
      },
      {
        name: "投诉来源",
        key: "sourceName",
        width: 150,
      },
      {
        name: "工单类型",
        key: "workorderType",
      },
      {
        name: "工单状态",
        key: "orderStatus",
      },
      {
        name: "省",
        key: "provinceCode",
      },
      {
        name: "创建人",
        key: "createdBy",
      },
      {
        name: "办结时间",
        key: "settlementTime",
        el: "format",
        format: "default",
      },
      // {
      //   name: '状态',
      //   key: 'state',
      //   format: 'default',
      // },
    ],
    // options: {
    //   width:120,
    //   btns: [
    //     {
    //       label: '开启路由',
    //       key: 'change',
    //       event: change,
    //     },
    //     {
    //       label: '编辑',
    //       key: 'eidt',
    //       event: edit,
    //     },
    //   ],
    // },
  },
  dataSource: [],
});
// onMounted(() => {
//   state.value.dataSource = [
//     {
//       id: "8888888888888",
//       ordernumber: "TS202600025205",
//       createTime: "1",
//       complaintNumber: "1",
//       phone: "1",
//       orderStatus: "1",
//       orderType: "1",
//       phenomenon: "1",
//       acceptanceContent: "1",
//       closingContent: "1",
//     },
//   ];
// });
const PageSearchPanelRef = ref();
const pageInfo = ref({ pageNum: 1, pageSize: 15, rowCount: 0 });

const list = ref(Array.from({ length: 88 }).map((v, i) => ({ roleName: i })));

// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  let queryParams = PageSearchPanelRef.value.getFormData();
  let dataTime = {};
  // 建单时间的取值
  if (
    queryParams.provinceOrderCreateTime &&
    queryParams.provinceOrderCreateTime.length > 0
  ) {
    dataTime.beginTime = dayjs(
      new Date(queryParams.provinceOrderCreateTime[0]).getTime()
    ).format("YYYY-MM-DD HH:mm:ss");
    dataTime.endTime = dayjs(
      new Date(queryParams.provinceOrderCreateTime[1]).getTime()
    ).format("YYYY-MM-DD HH:mm:ss");
  }
  // 投诉来源的取值
  if (queryParams.askSourceSrl && queryParams.askSourceSrl.length > 1) {
    queryParams.askSourceSrl =
      queryParams.askSourceSrl[queryParams.askSourceSrl.length - 1];
  } else {
    if (queryParams.askSourceSrl && queryParams.askSourceSrl.length > 0) {
      queryParams.askSourceSrl = queryParams.askSourceSrl[0];
    } else {
      queryParams.askSourceSrl = [];
    }
  }

  // 时间的传值不传这个字段
  delete queryParams.provinceOrderCreateTime;
  let { res } = await proxy.$$api.complaint.listOnFile({
    params: Object.assign(
      {
        pageNum: pageInfo.value.pageNum,
        pageSize: pageInfo.value.pageSize,
      },
      dataTime,
      queryParams
    ),
  });
  if (res) {
    pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
    state.value.dataSource = res.rows;
  } 
};

//列表选择
const selectionList = ref([]);

//弹窗
const isShowAddDialog = ref(!1);
const select_pkid = ref(null);
let complaint_source_tree = ref([]);

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {
    name: "投诉编号",
    key: "unifiedComplaintCode",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "客户名称",
    key: "appealUserName",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "创建人",
    key: "createdBy",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  // {
  //   name: "派单单位",
  //   key: "orderType",
  //   value: "全部",
  //   col: 6,
  //   type: "select",
  //   options: [
  //     { label: "是", value: "是" },
  //     { label: "全部", value: "全部" },
  //   ],
  //   isDisable: !1,
  //   isRequire: !1,
  // },
  {
    name: "工单类型",
    key: "workorderType",
    value: "",
    col: 6,
    type: "select",
    options: () =>
      proxy.$store.getters["dictionaries/GET_DICT"]("search_order_type"),
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "投诉来源",
    key: "askSourceSrl",
    value: "",
    col: 6,
    type: "cascader",
    options: () => complaint_source_tree.value,
    attrs: { props: { checkStrictly: !0 } },
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "办结时间",
    key: "provinceOrderCreateTime",
    value: [],
    placeholder: "如 sys:code:xxx",
    col: 6,
    type: "dateRangePicker",
    isDisable: !1,
    isRequire: !1,
  },
  { col: 6 },
  {
    type: "buttons",
    verticalAlign: "top",
    align: "right",
    col: 6,
    items: [
      {
        btnName: "重置",
        type: "button",
        attrs: { type: "" },
        col: 1,
        onClick({ vm }) {
          vm.resetFormData();
          getList(1);
        },
      },
      {
        btnName: "查询",
        type: "button",
        attrs: { type: "primary" },
        col: 1,
        onClick({ vm }) {
          getList(1);
        },
      },
      // {
      //   btnName: '新增', type: 'button', attrs: {type: 'success'}, col: 1,
      //   onClick({vm}) {
      //     // 打开弹窗
      //     select_pkid.value = null;
      //     isShowAddDialog.value = !0

      //   }
      // },
      {
        btnName: "审核",
        type: "button",
        attrs: { type: "success" },
        col: 1,
        onClick({ vm }) {
          // 通过异步的方式实现生成后的操作
          setTimeout(() => {
            FormRef.value?.resetFields();
          }, 0);
          if (selectData.value.length === 0) {
            proxy.$$Toast.warning("请先选择投诉编号");
          } else {
            state.value.open = true;
          }

          // 打开弹窗
          // select_pkid.value = null;
          // isShowAddDialog.value = !0;
        },
      },
    ],
  },
]);
//投诉来源下拉菜单
async function listComplaintSourceTree() {
  proxy.$$api.complaintSource
    .listComplaintSourceTree({
      data: { status: 1 },
    })
    .then((res, err) => {
      if (err) return;
      complaint_source_tree.value = proxy.$$formatCascaderTree(
        res?.res.list || [],
        "sourceName",
        "sourceCode",
        "children"
      );
    });
}
onMounted(() => {
  getList(1);
});
onBeforeMount(() => {
  listComplaintSourceTree();
});
</script>

<script>
export default {
  name: "ComplaintForm",
  cusDicts: ["search_order_type", "base_province_code"],
};
</script>
<style lang="scss" scoped></style>
