<!--工单流转信息-->
<template>
  <div class="CirculationInfo">
    <span class="title"> 工单处理进度 </span>
    <div>
      <el-steps
        :space="200"
        :active="state.currentStep"
        finish-status="success"
        align-center
      >
        <el-step
          :title="stepItem"
          v-for="stepItem in state.processList"
          :key="stepItem"
        />
      </el-steps>
    </div>
    <div>
      <div class="orderStatus">
        <span class="tagItemLabel">当前工单状态</span>
        <span class="tagItemValue"> 已派发</span>
      </div>
      <div class="orderStatusList">
        <JsTable
          :dataSource="state.dataSource"
          :columns="state.columns"
        ></JsTable>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getCurrentInstance, onMounted, ref } from "vue";
import JsTable from "@/components/js-table/index.vue";
const { proxy } = getCurrentInstance();
const state = ref({
  currentStep: 2,
  processList: ["受理", "分配", "处理", "办结", "测评", "归档"],
  dataSource: [],
  columns: {
    selection: false,
    props: [
      {
        name: "处理时间",
        key: "ordernumber",
      },
      {
        name: "处理动作",
        key: "complaintNumber",
      },
      {
        name: "发起方",
        key: "complaintNumber",
      },
      {
        name: "处理方",
        key: "phone",
      },
      {
        name: "处理人",
        key: "orderStatus",
      },
      {
        name: "处理描述",
        key: "orderType",
      },
    ],
  },
});
const props = defineProps({
  root: { type: Object, default: null },
});
</script>

<style scoped lang="scss">
.title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
  color: #353535;
  line-height: 2;
  &::before {
    content: "";
    display: inline-block;
    height: 16px;
    width: 4px;
    background-color: rgb(76, 120, 228);
    margin-right: 4px;
  }
}
::v-deep .el-step__title {
  font-size: 14px !important;
}
::v-deep .is-process {
  color: rgb(50, 151, 255);
  .el-step__icon {
    border-color: rgb(50, 151, 255) !important;
  }
}
::v-deep .el-step__line {
  top: 18px !important;
}
.orderStatus {
  font-size: 15px;
  padding-top: 10px;
  .tagItemLabel {
    font-weight: 700;
  }
  .tagItemValue {
    font-size: 14px;
  }
}
.orderStatusList {
  ::v-deep .js-table {
    padding-left: 0px !important;
  }
}
</style>
