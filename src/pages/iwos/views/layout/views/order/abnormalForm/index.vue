<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>
    <div class="table-panel one-screen-fg1">
      <JsTable :dataSource="list" :columns="columns">
        <template #receiveStatus="scope">
          {{ $store.getters["dictionaries/MATCH_LABEL"]("abnormal_form_status", scope.row.receiveStatus) }}
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
import {getCurrentInstance, ref, onBeforeMount, onMounted, onActivated} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";

const {proxy} = getCurrentInstance();
const columns = ref({
  props: [
    {
      name: "集团工单编号",
      width: 240,
      key: "complaintWorksheetId",
    },
    {
      name: "失败次数",
      width: 200,
      key: "failCount",
    },

    {
      name: "补偿状态",
      key: "receiveStatus",
    },
    {
      name: "省",
      key: "provinceName",
    },

    {
      name: "创建人",
      key: "createBy",
    },
    {
      name: "更新时间",
      width: 160,
      key: "updateTime",
      el: "format",
      format: "default",
    },
  ],
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
  if (queryParams.dataRange && queryParams.dataRange.length > 0) {
    dataTime.beginTime = proxy.$$dayjs(queryParams.dataRange[0]).format("YYYY-MM-DD HH:mm:ss");
    if (new Date(queryParams.dataRange[0]).getTime() == new Date(queryParams.dataRange[1]).getTime()) {
      dataTime.endTime = proxy.$$dayjs(new Date(queryParams.dataRange[1]).getTime() + 24 * 60 * 60 * 1000 - 1).format('YYYY-MM-DD HH:mm:ss')
    } else {
      dataTime.endTime = proxy.$$dayjs(queryParams.dataRange[1]).format("YYYY-MM-DD HH:mm:ss");
    }
  }
  // 时间的传值不传这个字段
  delete queryParams.dataRange;
  let {res} = await proxy.$$api.complaintAbnormal.abnormalformList({
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
    if (res.orderReceiveFailList) {
      pageInfo.value.rowCount = Number(res?.totalSize ?? pageInfo.value.rowCount);
      list.value = res.orderReceiveFailList;
    } else {
      pageInfo.value.rowCount = 0
      list.value = [];
    }

  }
};
//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {
    name: "集团工单编号",
    key: "complaintWorksheetId",
    value: "",
    col: 6,
    type: "input",
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "补偿状态",
    key: "receiveStatus",
    value: "",
    col: 6,
    type: "select",
    options: () =>
        proxy.$store.getters["dictionaries/GET_DICT"]("abnormal_form_status"),
    attrs: {props: {checkStrictly: !0}},
    isDisable: !1,
    isRequire: !1,
  },
  {
    name: "更新时间",
    key: "dataRange",
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
    ],
  },
]);
onMounted(() => {
  getList(1);
});

</script>

<script>
export default {
  name: "Abnormal_form",
  webDicts: [
    "abnormal_form_status",
    "search_order_type",
  ],
};
</script>
<style lang="scss" scoped>
::v-deep .el-cascader {
  width: 100%;
}
</style>
