<template>
    <div>
        <el-button type="primary" @click="analysis">解析参数</el-button>
        <el-button type="success" v-show="isEditDescribe" @click="editDescribe" :disabled="canEdit">填写描述</el-button>
        <el-button type="warning" v-show="!isEditDescribe" @click="saveDescribe">保存</el-button>
    </div>
</template>

<script setup >
import { ref, getCurrentInstance, computed } from 'vue'
const { proxy } = getCurrentInstance();
const props = defineProps({
    root: { type: Object, default: null },
});
const canEdit = computed(() => {
    return props.root.vm.formData.responseParam.length <= 0 || props.root.vm.formData.requestParam.length <= 0
})
const isEditDescribe = computed(() => {
    return props.root.vm.expandFormConfigItems[17].attrs.isEdit && props.root.vm.expandFormConfigItems[18].attrs.isEdit
})
function analysis() {
    props.root.vm.formData.requestParam = props.root.vm.formData.stagingrequest
    props.root.vm.formData.responseParam = props.root.vm.formData.stagingresponse
}
function editDescribe() {
    props.root.vm.expandFormConfigItems[17].attrs.isEdit = false
    props.root.vm.expandFormConfigItems[18].attrs.isEdit = false
}
function saveDescribe() {
    if (props.root.vm.formData.responseParam.some(item => item.label === "") || props.root.vm.formData.requestParam.some(item => item.label === "")) {
        proxy.$$Dialog.confirm('您有尚未填写的label，请确认全部填写再保存！')
        proxy.$emit('hasSaveDiscribe', false)
        return
    }
    props.root.vm.expandFormConfigItems[17].attrs.isEdit = true
    props.root.vm.expandFormConfigItems[18].attrs.isEdit = true
    proxy.$emit('hasSaveDiscribe', true)
}
</script>

<style scoped></style>