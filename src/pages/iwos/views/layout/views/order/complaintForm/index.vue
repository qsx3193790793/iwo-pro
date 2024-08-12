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
          <template #unifiedComplaintCode="scope">
            <!-- @click="Todetail(scope.row)" -->
            <div style="color: rgb(50, 151, 255); cursor: pointer">
              {{ scope.row.unifiedComplaintCode }}
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
          <!-- <template #state="scope">
            {{ scope.row.state == 0 ? '激活' : '未激活' }}
          </template> -->
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
    <!-- <AddDialog v-if="isShowAddDialog" v-model="isShowAddDialog" :pkid="select_pkid" destroyOnClose @success="getList(1)"></AddDialog> -->
  </div>
</template>

<script setup>
import dayjs from "dayjs";
import {getCurrentInstance, ref, onBeforeMount} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";
import {onMounted} from "vue";

const {proxy} = getCurrentInstance();
const selectionChange = (val) => {
  console.log(val);
};
const Todetail = (val) => {
  console.log(val);
  proxy.$$router.push({name: "ComplaintDetail", query: {ID: val.id}});
};
const FormRef = ref();
const submitForm = () => {
  FormRef.value.validate((valid) => {
    if (valid) {
      console.log(state.value.form);
    }
  });
};
const cancel = () => {
  console.log("---77");
};
let state = ref({
  open: false,
  form: {
    reviewComments: "",
  },
  rules: {
    reviewComments: [
      {required: true, message: "审核意见不能为空", trigger: "blur"},
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
        name: "申诉工单编号",
        key: "appealWorksheetId",
      },

      {
        name: "客户名称",
        key: "appealUserName",
      },
      {
        name: "省",
        key: "provinceCode",
      },
      {
        name: "投诉来源",
        key: "askSourceSrl",
      },
      {
        name: "工单类型",
        key: "workorderType",
      },
      {
        name: "工单状态",
        key: "statusCd",
      },
      // {
      //   name: "派单单位",
      //   key: "orderType",
      // },
      {
        name: "创建人",
        key: "createdBy",
      },
      {
        name: "创建时间",
        key: "createdTime",
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
onMounted(() => {
  getList(1);
});
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
    queryParams.askSourceSrl = queryParams.askSourceSrl[1];
  } else {
    if (queryParams.askSourceSrl.length > 0) {
      queryParams.askSourceSrl = queryParams.askSourceSrl[0];
    } else {
      queryParams.askSourceSrl = [];
    }
  }
  // 时间的传值不传这个字段
  delete queryParams.provinceOrderCreateTime;
  let {res} = await proxy.$$api.complaint.listComplaint({
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
    name: "申诉工单编号",
    key: "appealWorksheetId",
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
  {
    name: "省",
    key: "provinceCode",
    value: "",
    col: 6,
    type: "select",
    options: () =>
        proxy.$store.getters["dictionaries/GET_DICT"]("base_province_code"),
    isDisable: !1,
    isRequire: !1,
  },
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
    options: () =>
        proxy.$store.getters["dictionaries/GET_DICT"]("complaint_source_tree"),
    attrs: {props: {checkStrictly: !0}},
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "建单时间",
    key: "provinceOrderCreateTime",
    value: [],
    placeholder: "如 sys:code:xxx",
    col: 6,
    type: "dateRangePicker",
    isDisable: !1,
    isRequire: !1,
  },
  {col: 6, type: "divider-empty"},
  {
    type: "buttons",
    align: "right",
    col: 6,
    items: [
      {
        btnName: "重置",
        type: "button",
        attrs: {type: ""},
        col: 1,
        onClick({vm}) {
          vm.resetFormData();
        },
      },
      {
        btnName: "查询",
        type: "button",
        attrs: {type: "primary"},
        col: 1,
        onClick({vm}) {
          console.log(vm);
          getList(1);
        },
      },
      {
        btnName: "新增",
        type: "button",
        attrs: {type: "success"},
        col: 1,
        onClick({vm}) {
          console.time('open');
          proxy.$router.push({name: 'ComplaintDetail'})
        },
      },
    ],
  },
]);

//投诉来源下拉菜单
async function listComplaintSourceTree() {
  if (
      proxy.$store.getters["dictionaries/GET_DICT"]("complaint_source_tree")
          ?.length
  )
    return;
  const {res, err} =
      await proxy.$$api.complaintSource.listComplaintSourceTree();
  if (err) return;
  proxy.$store.commit("dictionaries/SET_DICTIONARIES", {
    complaint_source_tree: proxy.$$formatCascaderTree(
        res?.list || [],
        "sourceName",
        "sourceCode",
        "children"
    ),
  });
}

onBeforeMount(() => {
  listComplaintSourceTree();
});
</script>

<script>
export default {
  name: "ComplaintForm",
  cusDicts: [
    "yes_no",
    "search_order_type",
    "complaint_source_tree",
    "base_province_code",
  ],
};
</script>
<style lang="scss" scoped>
::v-deep .el-cascader {
  width: 100%;
}
</style>
