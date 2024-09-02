<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems" :mainSize="11"></PageSearchPanel>
    <div class="table-panel one-screen-fg1">
      <JsTable :dataSource="list" :columns="columns">
        <template #workorderType="{row}">
          {{ $store.getters["dictionaries/MATCH_LABEL"]("search_order_type", row.workorderType) }}
        </template>
        <template #provinceCode="{row}">
          {{ $store.getters["dictionaries/MATCH_LABEL"]("base_province_code", row.provinceCode) }}
        </template>
        <template #statusCd="{row}">
          {{ $store.getters["dictionaries/MATCH_LABEL"]("jy_complaint_status_cd", row.statusCd) }}
        </template>
        <template #timeoutFlag="{row}">
          {{ $store.getters["dictionaries/MATCH_LABEL"]("timeout_flag", row.timeoutFlag) }}
        </template>
        <template #complaintPhenomenonLevelChain="{row}">
          {{ [row.complaintPhenomenonLevel1, row.complaintPhenomenonLevel2, row.complaintPhenomenonLevel3].filter(v => !!v).join(' / ') }}
        </template>
        <template #productLevelChain="{row}">
          {{ [row.productLevel1, row.productLevel2].filter(v => !!v).join(' / ') }}
        </template>
        <template #workorderStrictest="{row}">
          {{ $store.getters["dictionaries/MATCH_LABEL"]("yes_no", row.workorderStrictest) }}
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
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, onMounted, watch} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";

const {proxy} = getCurrentInstance();
const accNum = ref() //在途工单传递的号码
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
    {name: "工单类型", width: 80, key: "workorderType",},
    {name: "业务号码", width: 120, key: "complaintAssetNum",},
    {name: "号码归属地", width: 120, key: "phoneLocal",},
    {name: "客户名称", width: 100, key: "appealUserName",},
    {name: "投诉来源", width: 200, key: "askSourceSrlName",},
    {name: "投诉现象", width: 300, key: "complaintPhenomenonLevelChain"},
    {name: "产品", width: 200, key: "productLevelChain"},
    {name: "省内建单时间", width: 160, key: "provinceOrderCreateTime", el: "format", format: "default",},
    {name: "受理工号", width: 100, key: "createStaff",},
    {name: "是否市场最严工单", width: 130, key: "workorderStrictest"},
    {name: "责任管控渠道", width: 120, key: "controlChannel"},
    {name: "30天重复投诉次数", width: 180, key: "recmplntTimes30days",},
    {name: "30天越级投诉次数", width: 180, key: "croscmplntTimes30days",},
    {name: "客户升级投诉倾向", width: 180, key: "upgradeTrend",},
    {name: "工单超时状态", width: 120, key: "timeoutFlag",},
    {name: "工单要求时限", width: 120, key: "demandTimeLimit"},
    {name: "工单流转状态", width: 120, key: "statusCd"},
  ],
  options: {
    btns: [
      // {
      //   label: '编辑',
      //   key: 'edit',
      //   autoHidden: ({row}) => row.statusCd === 'C100001',
      //   event: row => {
      //     proxy.$router.push({name: 'ComplaintCreate', params: {workorderId: row.workorderId}, query: {complaintAssetNum: row.complaintAssetNum, complaintWorksheetId: row.complaintWorksheetId}})
      //   },
      // },
      {
        label: '详情',
        key: 'detail',
        event: row => {
          proxy.$router.push({name: 'ComplaintDetail', params: {detailWorkorderId: row.workorderId}, query: {complaintAssetNum: row.complaintAssetNum, complaintWorksheetId: row.complaintWorksheetId}})
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
  let paramsData= Object.assign(
        queryParams,
        proxy.$$formatELDateTimeRange(queryParams.provinceOrderCreateTime, ['beginTime', 'endTime']),
        {
          pageNum: pageInfo.value.pageNum,
          pageSize: pageInfo.value.pageSize,
          askSourceSrl: queryParams.askSourceSrl?.[queryParams.askSourceSrl?.length - 1],
          complaintPhenomenonLevel1Code: queryParams.complaintPhenomenonLevelChain?.[0] ?? null,
          complaintPhenomenonLevel2Code: queryParams.complaintPhenomenonLevelChain?.[1] ?? null,
          complaintPhenomenonLevel3Code: queryParams.complaintPhenomenonLevelChain?.[2] ?? null,
          productLevel1Code: queryParams.productLevelChain?.[0] ?? null,
          productLevel2Code: queryParams.productLevelChain?.[1] ?? null,
        },
    )
  // 时间的传值不传这个字段
  delete queryParams.provinceOrderCreateTime;
  let {res} = await proxy.$$api.complaint.listComplaint({
    params:paramsData,
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
  // 首屏
  {name: "投诉编号", key: "unifiedComplaintCode", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "集团工单编号", key: "complaintWorksheetId", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "省内建单时间", key: "provinceOrderCreateTime", value: [], col: 6, type: "dateRangePicker", isDisable: !1, isRequire: !1,},
  {name: "主叫号码", key: "callerNo", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "业务号码", key: "complaintAssetNum", value: proxy.$route.query.accNum || '', col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "联系电话1", key: "contactPhone1", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "联系电话2", key: "contactPhone2", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "投诉来源", key: "askSourceSrl", value: "", col: 6, type: "cascader", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("complaint_source_tree"), attrs: {props: {checkStrictly: !0}}, isDisable: !1, isRequire: !1,},
  {name: "客户升级投诉倾向", key: "upgradeTrend", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "工单超时状态", key: "timeoutFlag", value: "", col: 6, type: "select", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("timeout_flag"), isDisable: !1, isRequire: !1,},
  {name: "工单流转状态", key: "statusCd", value: "", col: 6, type: "select", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("jy_complaint_status_cd"), isDisable: !1, isRequire: !1,},

  // 展开
  {name: "投诉现象", key: "complaintPhenomenonLevelChain", value: [], col: 6, type: "cascader", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("complaint_phenomenon_tree"), attrs: {props: {checkStrictly: !0}}, isDisable: !1, isRequire: !1,},
  {name: "产品", key: "productLevelChain", value: [], col: 6, type: "cascader", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("complaint_product_tree"), attrs: {props: {checkStrictly: !0}}, isDisable: !1, isRequire: !1,},
  {name: "申诉日期", key: "appealDate", value: [], col: 6, type: "dateRangePicker", isDisable: !1, isRequire: !1,},
  {name: "申诉工单编号", key: "appealWorksheetId", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "号码归属地", key: "phoneLocal", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "受理工号", key: "createStaff", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "30天重复投诉次数", key: "recmplntTimes30days", value: "", col: 6, type: "input", isDisable: !1, isRequire: !1,},
  {name: "是否市场最严工单", key: "workorderStrictest", value: "", col: 6, type: "select", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("yes_no"), isDisable: !1, isRequire: !1,},
  {name: "市场最严工单场景", key: "workorderStrictestScene", value: "", col: 6, type: "select", options: () => proxy.$store.getters["dictionaries/GET_DICT"]("workorder_strictest_scene"), isDisable: !1, isRequire: !1,},

  {col: 6, type: "divider-empty"},
  {col: 6, type: "divider-empty"},
  {col: 6, type: "divider-empty"},
  {
    type: "buttons", align: "right", verticalAlign: 'top', col: 6,
    items: [{
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
      }],
  },
]);

//投诉来源下拉菜单
async function listComplaintSourceTree() {
  if (proxy.$store.getters["dictionaries/GET_DICT"]("complaint_source_tree")?.length) return;
  const {res, err} = await proxy.$$api.web.findSourceTree({loading: !1, data: {status: 1}});
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

//现象
async function listComplaintPhenomenonTree() {
  if (proxy.$store.getters["dictionaries/GET_DICT"]("complaint_phenomenon_tree")?.length) return;
  const {res, err} = await proxy.$$api.web.queryPhenomPullList({loading: !1, params: {status: 1}});
  if (err) return;
  proxy.$store.commit("dictionaries/SET_DICTIONARIES", {
    complaint_phenomenon_tree: proxy.$$formatCascaderTree(
        res?.phenomList || [],
        'phenomName', 'phenomCode', 'phenomList'
    ),
  });
}

//产品
async function listProductTree() {
  if (proxy.$store.getters["dictionaries/GET_DICT"]("complaint_product_tree")?.length) return;
  const {res, err} = await proxy.$$api.web.productTree({loading: !1, params: {status: 1}});
  if (err) return;
  proxy.$store.commit("dictionaries/SET_DICTIONARIES", {
    complaint_product_tree: proxy.$$formatCascaderTree(
        res?.list || [],
        'productName', 'productCode', 'children'
    ),
  });
}

watch(() => proxy.$route.params.accNum, () => {

});

onMounted(() => {
  listComplaintSourceTree();
  listComplaintPhenomenonTree();
  listProductTree();
  getList(1);
});

</script>

<script>
export default {
  name: "ComplaintForm",
  webDicts: [
    "yes_no",
    "search_order_type",
    "base_province_code",
    "jy_complaint_status_cd",
    "workorder_strictest_scene",
    "timeout_flag",
    "jy_complaint_status_cd",
  ],
};
</script>
<style lang="scss" scoped>
::v-deep .el-cascader {
  width: 100%;
}
</style>
