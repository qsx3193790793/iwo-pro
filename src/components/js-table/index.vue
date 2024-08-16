<template>
  <div class="js-table">
    <el-table ref="tableView" :data="dataSource" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" row-key="id" height="100%" stripe border>
      <!-- 添加复选框 -->
      <el-table-column v-if="columns.selection" align="center" type="selection" width="55"></el-table-column>
      <el-table-column v-if="columns.index" align="center" type="index" width="55"></el-table-column>
      <el-table-column v-for="(item, index) in columns.props" :label="item.name" :key="index" :prop="item.key" :width="item.width ? item.width : ''" align="center" class="ellipsis" show-overflow-tooltip resizable>
        <template #default="scope">
          <slot :name="item.key" :row="scope.row">
            <component :is="compsMap[item.el ? item.el : 'text']" :row="scope.row" :col="item"></component>
          </slot>
        </template>
      </el-table-column>
      <!-- 添加操作按钮 -->
      <el-table-column v-if="columns.options" align="center" :label="columns.options.operateName ? columns.options.operateName : '操作'" :width="optionsWidth" fixed="right">
        <!-- 获取scope对象 scope.$index 下标 scope.row 元素对象 -->
        <template #default="scope">
          <template v-show="columns.options.btns.length > 0">
            <slot v-for="item in columns.options.btns" :name="item.key + '-option'" :row="scope">
              <!-- 普通按钮-->
              <template v-if="!item.children">
                <el-button v-if="(item.autoHidden?item.autoHidden(scope):true)" v-hasPermission="item.permission" :key="item.key" size="small" :loading="item.loading" :type="item.type||'primary'" @click="item.event?.(scope.row)">{{ item.label }}</el-button>
              </template>
              <!-- 更多下拉按钮-->
              <el-dropdown v-else-if="item.children.filter(c=>(c.autoHidden ? c.autoHidden(scope) : true)).length" class="public-el-dropdown" trigger="click">
                <el-button type="primary">
                  {{ item.label || '更多' }}<i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown" class="table-dropdown-menu">
                  <div class="inner">
                    <template v-for="(vv,ii) in item.children">
                      <el-button v-if="vv.autoHidden ? vv.autoHidden(scope) : true" v-hasPermission="vv.permission" :type="vv.type||'primary'" :key="ii" size="small" @click="vv.event?.(scope.row)">{{ vv.label }}</el-button>
                    </template>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </slot>
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script setup>
import {shallowRef, ref, nextTick, watchEffect, getCurrentInstance, onActivated} from "vue";
import TableFormat from "./comps/TableFormat.vue";
import TableText from "./comps/TableText.vue";
import {computed, watch} from "vue"

const {proxy} = getCurrentInstance();
const compsMap = ref({
  format: shallowRef(TableFormat),
  text: shallowRef(TableText),
});
const props = defineProps({
  events: {
    type: Object,
    default: function () {
      return {};
    },
  },
  dataSource: {
    type: Array,
    default: function () {
      return [];
    },
  },
  columns: {
    type: Object,
    default: function () {
      return {
        selection: true,
        props: [],
        options: {
          detail: true,
        },
      };
    },
    reload: {
      type: Boolean,
      default: false,
    },
  },
});
const emit = defineEmits([]);

const optionsWidth = computed(() => {
  const width = (props.columns.options?.btns?.reduce((p, n) => {
    console.log('optionsWidth', n.permission)
    if (n.permission != 1) {
      p += (n.label.length * 36);
    }
    return p;
  }, 24)) * proxy.$$getPageScale({type: 'max'});
  console.log('optionsWidth', width)
  return props.columns.options.width ? props.columns.options.width : width;
});

const tableView = ref(null);
let multipleSelection = ref([]); //多选的数据

const tableRowClassName = ({rowIndex}) => {
  if (rowIndex % 2 === 1) {
    //=>这里可以改成 rowIndex%2=== 1，后面直接else即可达到隔行变色效果。
    return "warning-row";
  } else if (rowIndex % 2 === 0) {
    return "success-row";
  }
  return "";
};
//操作复选框回调
const handleSelectionChange = (val) => {
  multipleSelection.value = val;
  emit("selectionChange", multipleSelection.value);
  // this.$bus.$emit('tableSelectionChangeEvent', arr)
};

watchEffect(() => {
  console.log('table onMounted', props.dataSource)
});

onActivated(() => {
  // keep-alive回来后  fiexed列有问题
  nextTick(() => tableView.value?.doLayout())
});
</script>
<style lang="scss" scoped>
//.content {
//}
:deep(.el-input__wrapper) {
  font-size: 13px;
  width: 100%;
}

.js-table {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px 10px 0px 10px;
  overflow: hidden;
}

.el-dropdown-link {
  cursor: pointer;

  .text,
  .el-icon--right {
    color: #409eff;
    font-size: 12px;
  }
}

:deep(.el-table) {

  tr {
    &.warning-row {
      background: #fafafa !important;
    }

    &.success-row {
      background: white !important;
    }
  }
}

</style>
