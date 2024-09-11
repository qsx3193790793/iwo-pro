<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
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
        <!--          <template #provinceCode="scope">-->
        <!--            {{ $store.getters["dictionaries/MATCH_LABEL"]("base_province_code", scope.row.provinceCode) }}-->
        <!--          </template>-->
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
    <ImportDialog v-if="isShowImportDialog" v-model="isShowImportDialog" v-bind="uploadConfig" @templateDownload="onTemplateDownload"></ImportDialog>
  </div>
</template>

<script setup>
import ImportDialog from '../import/index.vue'
import {getCurrentInstance, ref, onMounted, onActivated} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";

const isShowImportDialog = ref(false)
const uploadConfig = ref({})
const {proxy} = getCurrentInstance();
const selectionChange = (val) => {
  console.log(val);
};

const FormRef = ref();
const submitForm = () => {
  FormRef.value.validate((valid) => {
    if (valid) {
      console.log(state.value.form);
    }
  });
};
const cancelOrder = (row) => {
  proxy.$$Dialog.confirm(`是否确定取消投诉编号为: ${row.unifiedComplaintCode} 的数据项？`).then(() => {
    console.log(row)
    let data = {
      workorderId: row.workorderId,
      statusCd: 'C100002',
      complaintWorksheetId: row.complaintWorksheetId,
    }
    return proxy.$$api.complaint.temporaryCancelComplaintWorkOrder({data: data});
  }).then(({res: response, err}) => {
        if (err) return
        getList();
        proxy.$$Toast.success("取消成功");
      }
  )
}
const columns = ref({
  props: [
    {
      name: "统一投诉编码",
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
    // {
    //   name: "省",
    //   key: "provinceCode",
    // },
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
    // {
    //   name: "更新人",
    //   key: "updatedBy",
    // },
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
        label: '修改',
        key: 'edit',
        autoHidden: ({row}) => row.statusCd === 'C100001',
        event: row => {
          proxy.$router.push({name: 'ComplaintCreate', params: {workorderId: row.workorderId}, query: {complaintAssetNum: row.complaintAssetNum, complaintWorksheetId: row.complaintWorksheetId}})
        },
      },
      {
        label: '详情',
        key: 'detail',
        event: row => {
          window.open(`/iwos/window/${row.workorderId}?pageCode=ComplaintDetail&complaintAssetNum=${row.complaintAssetNum}&complaintWorksheetId=${row.complaintWorksheetId}`);

          // proxy.$router.push({name: 'ComplaintDetail', params: {detailWorkorderId: row.workorderId}, query: {complaintAssetNum: row.complaintAssetNum, complaintWorksheetId: row.complaintWorksheetId}})
        },
      },
      {
        label: '取消',
        key: 'del',
        type: 'danger',
        // 只有新建状态的数据,才能够执行取消操作
        autoHidden: ({row}) => row.statusCd == 'C100001',
        event: cancelOrder
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
    let {beginTime, endTime} = {...proxy.$$formatELDateTimeRange(queryParams.provinceOrderCreateTime, ['beginTime', 'endTime'])}
    dataTime.beginTime = beginTime
    dataTime.endTime = endTime
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
  let {res} = await proxy.$$api.complaint.waitCommitList({
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
    name: "统一投诉编码",
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
    col: 6,
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
        permission: ['order:complaint:list'],
        onClick({vm}) {
          console.time('open');
          proxy.$router.push({name: 'ComplaintCreate'})
        },
      },
      {
        btnName: "导入",
        type: "buttonGroup",
        attrs: {type: "warning"},
        permission: ['order:complaint:import:sgj'],
        items: [
          // {
          //   btnName: "工信部",
          //   type: "button",
          //   attrs: {type: "primary"},
          // permission: ['order:complaint:import:gxb'],
          //   onClick({vm}) {
          //     importFile('工信部导入')
          //   },
          // },
          {
            btnName: "省管局",
            type: "button",
            attrs: {type: "primary"},
            col: 1,
            permission: ['order:complaint:import:sgj'],
            onClick({vm}) {
              importFile('省管局导入')
            },
          },
        ]
      },
    ],
  },
]);

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

//投诉来源下拉菜单
async function listComplaintSourceTree() {
  if (
      proxy.$store.getters["dictionaries/GET_DICT"]("complaint_source_tree")
          ?.length
  )
    return;
  const {res, err} =
      await proxy.$$api.web.findSourceTree({data: {status: 1}});
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

onMounted(() => {
  listComplaintSourceTree();
  getList(1);
});

onActivated(() => {
  // 提交关闭后返回刷新页面
  if (sessionStorage.getItem('reload') === 'true') {
    getList();
    sessionStorage.removeItem('reload');
  }
});

</script>

<script>
export default {
  name: "NotSubmitComplaintIndex",
  webDicts: [
    "yes_no",
    "search_order_type",
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
