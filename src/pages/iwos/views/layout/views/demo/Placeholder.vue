<!--占位符-->
<template>
  <div class="Placeholder">
    <div class="top">
      <Button type="primary" icon="Download" @click="">占位符模板</Button>
    </div>
    <Table class="table" :data="[].concat(cert_sys_key,cert_excel_key)" :height="tableHeight">
      <TableColumn align="center" label="占位符" prop="identityId" show-overflow-tooltip>
        <template #default="{ row }">
          <span class="is-link" @click="$$toCopy($event,row.identityId)">{{ row.identityId }}</span>
        </template>
      </TableColumn>
      <TableColumn align="center" label="字段名" prop="identityName" show-overflow-tooltip/>
      <TableColumn align="center" label="描述" prop="remark" show-overflow-tooltip/>
      <TableColumn align="center" label="来源" prop="source" show-overflow-tooltip/>
    </Table>
  </div>

</template>

<script setup>
import {Button, Table, TableColumn} from 'element-ui';
import {computed, getCurrentInstance, onBeforeMount, ref, watch} from "vue";

const {proxy} = getCurrentInstance();

const emitter = defineEmits([]);

const props = defineProps({
  value: {type: [String, Number], default: null},
  tableHeight: {type: [String, Number], default: 200},
  pkid: {type: [String, Number], default: null},
});

const loading = ref(!1);
const progress = ref('0');
const cert_sys_key = ref([{identityId: `{1}`}, {identityId: `{2}`}]);
const cert_excel_key = ref([]);

defineExpose({cert_sys_key, cert_excel_key});

</script>

<style scoped lang="scss">
.Placeholder {
  & > .top {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-bottom: 12px;

    :deep(.MUploader) {
      margin-left: 5px;
    }
  }
}
</style>
