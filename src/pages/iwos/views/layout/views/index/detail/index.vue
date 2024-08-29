<template>
    <div>
        <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="50%" top="10vh" height="60vh"
            title="更多">
            <el-form ref="form" :model="form" label-position="left" label-width="auto">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="公告类型" prop="noticeType">
                            <el-select v-model="form.noticeType" placeholder="请选择公告类型" style="width: 100%;" disabled>
                                <el-option v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_notice_type')"
                                    :key="dict.value" :label="dict.label" :value="dict.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="标题" prop="noticeTitle">
                            <el-input v-model="form.noticeTitle" placeholder="请输入标题" maxlength="30" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="接收者类型" prop="recipientType">
                            <el-radio-group v-model="form.recipientType" disabled>
                                <el-radio v-for="dict in [{ value: '1', label: '机构' }, { value: '2', label: '班组' }]"
                                    :key="dict.value" :label="dict.value">{{ dict.label }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="接收机构" prop="deptId">
                            <treeselect v-model="form.deptId" :multiple="form.recipientType === '1'"
                                :options="deptOptions" :show-count="true" placeholder="请选择机构" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="form.recipientType !== '1'">
                        <el-form-item :label="`接收${recipientLabel}`" prop="recipientIds">
                            <treeselect v-model="form.recipientIds" noOptionsText='该机构下无数据' :multiple="true"
                                :normalizer="normalizer" :options="recipientOptions" :show-count="true"
                                :placeholder="`请选择${recipientLabel}`" disabled />
                        </el-form-item>
                    </el-col>
                    <el-col :span="24">
                        <el-form-item label="内容">
                            <Editor v-model="form.noticeContent" ref="editorRef" :min-height="192" readOnly />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </MDialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
import MDialog from '@/components/MDialog';
import Editor from '@/components/Editor.vue';
import Treeselect from "@riophae/vue-treeselect";
const { proxy } = getCurrentInstance()
const props = defineProps({
    noticeId: { type: String, default: null }
});
const form = ref({})
const deptOptions = ref([])
const recipientOptions = ref([])
const recipientLabel = computed(() => {
    switch (form.value.recipientType) {
        case '1':
            return '机构'
        case '2':
            return '班组'
        // case '3':
        //   return '人员'
        default:
    }
})

/** 转换班组数据结构 */
function normalizer(node) {
    if (node.children && !node.children.length) {
        delete node.children;
    }
    return {
        id: node.teamId,
        label: node.teamName,
        children: node.children
    };
}

function handleDetail() {
    proxy.$$api.notice.getNotice({ noticeId: props.noticeId }).then(({ res: response, err }) => {
        if (err) return
        form.value = response
        if (form.value.recipientType == 1) {
            form.value.deptId = response.recipientIds
        } else if (form.value.recipientType == 2) {
            form.value.deptId = response.deptArr[0]
            recipientOptions.value = response.teamList
        }
    });
}
//查询机构树
function getDeptTree() {
    proxy.$$api.user.deptTreeSelect().then(({ res, err }) => {
        if (err) return;
        deptOptions.value = res?.list || [];
    });
}
onMounted(() => {
    getDeptTree()
    handleDetail()
})
</script>
<script>
export default {
    dicts: ['sys_notice_type', 'sys_notice_status']
}
</script>
<style scoped></style>