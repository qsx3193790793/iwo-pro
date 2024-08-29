<template>
    <div class="more-notice">
        <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="80%" top="5vh" height="70vh" title="更多">
            <div style="height:62vh;">
                <JsTable :dataSource="list" :columns="columns">
                    <template #noticeType="{ row }">
                        {{ $store.getters['dictionaries/MATCH_LABEL']('sys_notice_type', row.noticeType) }}
                    </template>
                    <template #status="{ row }">
                        <el-tag :type="row.status == 0 ? '' : row.status == 1 ? 'warning' : 'danger'">
                            {{ $store.getters['dictionaries/MATCH_LABEL']('sys_notice_status', row.status) }}
                        </el-tag>
                    </template>
                </JsTable>
                <div class="pagination-area">
                    <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize"
                        :page-sizes="[1, 15, 30, 40, 50]" background layout=" ->,total, sizes, prev, pager, next, jumper"
                        :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList" />
                </div>
            </div>
        </MDialog>
        <detailDialog v-if="showDetailDialog" v-model="showDetailDialog" :noticeId="noticeId"></detailDialog>
    </div>
</template>

<script setup>
import { ref, getCurrentInstance, onMounted } from 'vue'
import MDialog from '@/components/MDialog';
import JsTable from '@/components/js-table/index.vue';
import detailDialog from '../detail/index.vue'
const { proxy } = getCurrentInstance()
const showDetailDialog = ref(false)
const detailData = ref({})
const props = defineProps({
    type: { type: String, default: null },//打开类型 默认普通 ，FormModel=表单打开
    noticeType: { type: String, default: null }
});
const list = ref([])
const noticeId = ref(null)
const columns = ref({
    props: [
        {
            name: '标题',
            key: 'noticeTitle',

        },
        {
            name: '公告类型',
            key: 'noticeType',
        },
        {
            name: '状态',
            key: 'status',
        },
        {
            name: '创建者',
            key: 'createBy',
        },
        {
            name: '发布部门',
            key: 'publishDeptName',
        },
        {
            name: '创建时间',
            key: 'createTime',
            width: 160
        },
    ],
    options: {
        btns: props.type === 'FormModel' ? [{
            label: '选择', event: (row) => {
                proxy.$emit('onSelect', row);
            }
        }] : [
            {
                label: '详情',
                key: 'edit',
                //   permission:['config:interfaceInfo:edit'],
                event: (row) => {
                    noticeId.value = row.noticeId
                    showDetailDialog.value = true;
                },
            }],
    },
})
const pageInfo = ref({
    pageNum: 1,
    pageSize: 15,
    rowCount: 1
})
function getList() {
    proxy.$$api.notice.listNotice({
        params: {
            ...pageInfo.value,
            noticeType: props.noticeType
        }
    }).then(({ res: response, err }) => {
        if (err) return this.loading = false;
        list.value = response.rows;
        pageInfo.value.rowCount = response.total;
    });
}

onMounted(() => {
    getList()
})
</script>
<script>
export default {
    dicts: ['sys_notice_type', 'sys_notice_status']
}
</script>
<style scoped></style>