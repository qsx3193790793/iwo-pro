<template>
  <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="90%" height="50vh" title="请选择回退版本" on-screen>
    <JsTable :dataSource="list" :columns="columns">
      <template #updatedTime="{row}">
        {{ $$dateFormatter(row.updatedTime) }}
      </template>
      <template #workorderType="{row}">
        {{ $store.getters['dictionaries/MATCH_LABEL']('template_work_order_type', row.workorderType) }}
      </template>
      <template #bigType="{row}">
        {{ $store.getters['dictionaries/MATCH_LABEL']('template_big_type', row.bigType) }}
      </template>
      <template #smallType="{row}">
        {{ $store.getters['dictionaries/MATCH_LABEL']('template_small_type', row.smallType) }}
      </template>
    </JsTable>
    <div class="pagination-area">
      <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
    </div>
    <template #footer="{DialogRef}">
      <el-button type="primary" plain @click="DialogRef?.handleClose()">返回</el-button>
    </template>
    <FormView v-if="isShowFormViewDialog" v-model="isShowFormViewDialog" :pkid="select_pkid" destroyOnClose></FormView>
  </MDialog>
</template>

<script setup>
import {getCurrentInstance, onBeforeMount, ref, watch} from "vue";
import MDialog from '@/components/MDialog';
import FormView from '../../components/FormView';
import JsTable from '@/components/js-table/index.vue';

const {proxy} = getCurrentInstance();

const props = defineProps({
  sceneCode: {type: String, default: null},
});
const emitter = defineEmits(['success']);

const columns = ref({
  props: [
    {
      name: '版本',
      key: 'version',
      width: 160
    },
    {
      name: '工单类型',
      key: 'workorderType',
    },
    {
      name: '模板名称',
      key: 'templateName',
      width: 200
    },
    {
      name: '模板大类',
      key: 'bigType',
    },
    {
      name: '模板小类',
      key: 'smallType',
    },
    {
      name: '描述',
      key: 'templateDesc',
      width: 200
    },
    {
      name: '状态',
      key: 'statusName',
    },
    {
      name: '更新人',
      key: 'updatedBy',
    },
    {
      name: '更新时间',
      key: 'updatedTime',
      width: 160
    },
  ],
  options: {
    btns: [
      {
        label: '选择',
        key: 'down', type: 'danger',
        event: row => {
          proxy.$$Dialog.confirm('确认回退到此版本吗？', '提示').then(async () => {
            const {res, err} = await proxy.$$api.template.release({data: {templateId: row.templateId, versionId: row.versionId, sceneCode: row.sceneCode, templateType: row.bigType, workorderType: row.workorderType}});
            if (err) return;
            getList(1);
            emitter('success');
            proxy.$$Toast({message: `操作成功`, type: 'success'});
          }).catch(proxy.$$emptyFn)
        }
      }, {
        label: '预览',
        key: 'view',
        event: row => {
          select_pkid.value = {templateId: row.templateId, versionId: row.versionId};
          isShowFormViewDialog.value = !0;
        },
      }
    ],
  },
});

const select_pkid = ref();
const isShowFormViewDialog = ref(false);

const list = ref([]);
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {
  pageInfo.value.pageNum = pageNum;
  const {res, err} = await proxy.$$api.template.historyList({sceneCode: props.sceneCode});
  if (err) return;
  pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
  list.value = res?.rows || [];
};

onBeforeMount(() => getList(1));

</script>
<script>
export default {
  dicts: ['template_work_order_type', 'template_status_name', 'template_big_type', 'template_small_type', 'base_province_code']
}
</script>
<style lang="scss" scoped>
</style>
