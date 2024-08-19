<template>
    <div class="import-container">
        <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="30%" top="20vh" height="40%"
            title="导入">
            <el-upload class="upload-demo" drag action="https://jsonplaceholder.typicode.com/posts/" accept=".xs,.xlsx"
                :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :fileList="fileList">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip" style="color: red;font-weight: bold;">{{ uploadTip }}
                </div>
            </el-upload>
            <template #footer="{ DialogRef }">
                <el-button type="primary" @click="handleImport(DialogRef)">导入</el-button>
                <el-button @click="DialogRef?.handleClose()">取 消</el-button>
            </template>
        </MDialog>
    </div>
</template>

<script setup lang='ts'>
import { computed, ref, } from 'vue'
import MDialog from '@/components/MDialog';
const props = defineProps({
    action: { type: String, default: "" },
    accept: { type: String, default: "" },
    uploadTip: { type: String, default: '提示:仅允许导入“xs"或“xlsx"格式文件!' }
})
const emitter = defineEmits(['success']);
const MDialogRef = ref()
const fileList=ref([])

function handleImport(DialogRef) {

}
function handleBeforeUpload(file){

}
function handleUploadSuccess(response, file, fileList){
    
}
function handleUploadError(err, file, fileList){
    
}
</script>

<style scoped lang="scss">
::v-deep {
    .el-upload {
        width: 100%;
    }

    .el-upload-dragger {
        width: 100%;
    }
}
</style>