<template>
    <div class="import-container">
        <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="30%" top="20vh" height="40%"
            :title="title" >
            <el-button type="primary" @click="templateDownload">模板下载</el-button>
            <el-upload class="upload-demo" drag :action="importUrl" accept=".xls,.xlsx" :headers="headers" :limit="limit"
                :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :fileList="fileList" :auto-upload="false"
                ref="uploadRef" @on-change="filechange">
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
    accept: { type: String, default: "" },
    uploadTip: { type: String, default: '提示:仅允许导入“xls"或“xlsx"格式文件!' },
    importUrl:{type:String, default: ''},
    headers:{type:Object, default:{}},
    limit:{type:Number, default:null},
    title:{type:String, default:'导入'}
})
const uploadRef=ref()
const emitter = defineEmits(['success']);
const MDialogRef = ref()
const fileList=ref([])

function handleImport(DialogRef) {
    uploadRef.value.submit()
}
function handleBeforeUpload(file){
   console.log('file',fileList.value);
}
function handleUploadSuccess(response, file, fileList){
    emitter('success')
}
function handleUploadError(err, file, fileList){
    
}
function templateDownload (){

}
function filechange(file, fileLis){
   console.log('file',file);
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