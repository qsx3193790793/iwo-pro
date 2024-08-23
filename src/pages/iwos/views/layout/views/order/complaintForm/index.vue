<template>
  <div class="one-screen">
    <PageSearchPanel
        ref="PageSearchPanelRef"
        :formConfigItems="formConfigItems"
    ></PageSearchPanel>
    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable :dataSource="list" :columns="columns">
          <!--          <template #unifiedComplaintCode="scope">-->
          <!--            &lt;!&ndash; @click="Todetail(scope.row)" &ndash;&gt;-->
          <!--            <div style="color: rgb(50, 151, 255); cursor: pointer">-->
          <!--              {{ scope.row.unifiedComplaintCode }}-->
          <!--            </div>-->
          <!--          </template>-->
          <template #workorderType="scope">
            {{ $store.getters["dictionaries/MATCH_LABEL"]("search_order_type", scope.row.workorderType) }}
          </template>
          <template #provinceCode="scope">
            {{ $store.getters["dictionaries/MATCH_LABEL"]("base_province_code", scope.row.provinceCode) }}
          </template>
          <template #statusCd="scope">
            {{ $store.getters["dictionaries/MATCH_LABEL"]("jy_complaint_status_cd", scope.row.statusCd) }}
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
    <importDialog v-if="isShowImportDialog" v-model="isShowImportDialog" v-bind="uploadConfig" @templateDownload="onTemplateDownload"></importDialog>
    <!-- 添加或修改用户配置对话框 -->
    <!-- <AddDialog v-if="isShowAddDialog" v-model="isShowAddDialog" :pkid="select_pkid" destroyOnClose @success="getList(1)"></AddDialog> -->
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, onBeforeMount, onMounted, onActivated} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";
import importDialog from './import/index.vue'
import apiPrefix from "@/api/apiPrefix.js";

const {proxy} = getCurrentInstance();
const selectionChange = (val) => {
  console.log(val);
};
const uploadConfig = ref({})
const isShowImportDialog = ref(false)
const FormRef = ref();
const submitForm = () => {
  FormRef.value.validate((valid) => {
    if (valid) {
      console.log(state.value.form);
    }
  });
};

const columns = ref({
  props: [
    {
      name: "投诉编号",
      width: 240,
      key: "unifiedComplaintCode",
    },
    {
      name: "申诉工单编号",
      width: 200,
      key: "appealWorksheetId",
    },
    {
      name: "客户名称",
      key: "appealUserName",
    },
    {
      name: "来电号码",
      width: 120,
      key: "callerNo",
    },
    {
      name: "业务号码",
      width: 120,
      key: "complaintAssetNum",
    },
    {
      name: "省",
      key: "provinceCode",
    },
    {
      name: "投诉来源",
      key: "askSourceSrlName",
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
      width: 160,
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
  options: {
    btns: [
      {
        label: '编辑',
        key: 'edit',
        autoHidden: ({row}) => row.statusCd === 'C100001',
        event: row => {
          proxy.$router.push({name: 'ComplaintCreate', params: {workorderId: row.workorderId}, query: {complaintAssetNum: row.complaintAssetNum}})
        },
      },
      {
        label: '详情',
        key: 'detail',
        event: row => {
          proxy.$router.push({name: 'ComplaintDetail', params: {workorderId: row.workorderId}, query: {complaintAssetNum: row.complaintAssetNum}})
        },
      },
      // {
      //   label: '删除',
      //   key: 'del',
      //   type: 'danger',
      // },
    ],
  },
});

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

const list = ref([]);

// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  let queryParams = PageSearchPanelRef.value.getFormData();
  let dataTime = {};
  // 建单时间的取值
  if (queryParams.provinceOrderCreateTime && queryParams.provinceOrderCreateTime.length > 0) {
    dataTime.beginTime = proxy.$$dayjs(queryParams.provinceOrderCreateTime[0]).format("YYYY-MM-DD HH:mm:ss");
    dataTime.endTime = proxy.$$dayjs(queryParams.provinceOrderCreateTime[1]).format("YYYY-MM-DD HH:mm:ss");
  }
  // 投诉来源的取值
  if (queryParams.askSourceSrl && queryParams.askSourceSrl?.length > 1) {
    queryParams.askSourceSrl = queryParams.askSourceSrl[1];
  } else {
    if (queryParams.askSourceSrl?.length > 0) {
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
    list.value = res.rows;
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
    name: "来电号码",
    key: "callerNo",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "业务号码",
    key: "complaintAssetNum",
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
        proxy.$store.getters["dictionaries/GET_DICT"]("complaintSourceTree"),
    attrs: {props: {checkStrictly: !0}},
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "建单时间",
    key: "provinceOrderCreateTime",
    value: [],
    col: 6,
    type: "dateRangePicker",
    isDisable: !1,
    isRequire: !1,
  },
  {
    type: "buttons",
    align: "right",
    verticalAlign: 'top',
    col: 24,
    items: [
      {
        btnName: "重置",
        type: "button",
        attrs: {type: ""},
        col: 1,
        onClick({vm}) {
          vm.resetFormData();
          getList(1);
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
          proxy.$router.push({name: 'ComplaintCreate'})
        },
      },
      {
        btnName: "xxxxx",
        type: "buttonGroup",
        attrs: {type: "success"},
        items: [
          {
            btnName: "工信部导入",
            type: "button",
            attrs: {type: "primary"},
            onClick({vm}) {
              importFile('工信部导入')
            },
          },
          {
            btnName: "省管局导入",
            type: "button",
            attrs: {type: "primary"},
            col: 1,
            onClick({vm}) {
              importFile('省管局导入')
            },
          },
        ]
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
      await proxy.$$api.complaintSource.listComplaintSourceTree({data: {status: 1}});
  if (err) return;
  proxy.$store.commit("dictionaries/SET_DICTIONARIES", {
    complaintSourceTree: proxy.$$formatCascaderTree(
        res?.list || [],
        "sourceName",
        "sourceCode",
        "children"
    ),
  });
}

function importFile(title) {
  uploadConfig.value = {
    uploadTip: '提示：仅允许导入"xls"或“xlsx"格式文件!',
    accept: 'xls,xlsx',
    httpRequest: (e) => {
      fileUpload(e)
    },
    title,
  }
  isShowImportDialog.value = true
}

const acceptNames = ref(['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'])

async function fileUpload(e) {
  if (!acceptNames.value.includes(e.file.type)) return proxy.$message({message: `只能上传${uploadConfig.value.accept}格式文件`, type: 'error'});
  const formdata = new FormData()
  formdata.append('file', e.file)
  const {res, err} = await uploadConfig.value.title === "工信部导入" ? proxy.$$api.complaint.miitImport({data: formdata}) : proxy.$$api.complaint.provinceAuthorityImport({data: formdata});
  if (err) return proxy.$message({message: err?.message || '导入失败', type: 'error'});
  getList(1)
  isShowImportDialog.value = false
}

async function onTemplateDownload() {
  if (uploadConfig.value.title === '工信部导入') {
    const {res, err} = await proxy.$$api.complaint.miitTemplate();
    if (err) return
    proxy.$$downloadFile(URL.createObjectURL(res.blob), '工信部批量导入模板');
  } else {
    const {res, err} = await proxy.$$api.complaint.provinceAuthorityTemplate();
    if (err) return
    proxy.$$downloadFile(URL.createObjectURL(res.blob), '省管局批量导模板');
  }

}

onMounted(() => {
  listComplaintSourceTree();
  getList(1);
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
    "jy_complaint_status_cd",
  ],
};
</script>
<style lang="scss" scoped>
::v-deep .el-cascader {
  width: 100%;
}
</style>
