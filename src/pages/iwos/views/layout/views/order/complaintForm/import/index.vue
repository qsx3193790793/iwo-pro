<template>
    <div class="import-container">
        <MDialog v-bind.sync="$attrs" v-on="$listeners" ref="MDialogRef" width="30%" top="20vh" height="40%"
            :title="title" >
            <el-button type="primary" @click="templateDownload" v-if="showTemplateDownload">模板下载</el-button>
            <el-upload class="upload-demo" drag :action="importUrl" :accept="accept" :headers="headers" :limit="limit"
                :before-upload="handleBeforeUpload" :on-success="handleUploadSuccess" :on-error="handleUploadError" :fileList="fileList" :auto-upload="false"
                ref="uploadRef" @on-change="filechange" :data="otherData" :httpRequest="httpRequest"  multiple>
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip" style="color: red;font-weight: bold;">{{ uploadTip }}
                </div>
            </el-upload>
            <br>
            <slot></slot>
            <template #footer="{ DialogRef }">
                <el-button type="primary" @click="handleImport(DialogRef)">{{ sureBtnName }}</el-button>
                <el-button @click="DialogRef?.handleClose()">取 消</el-button>
            </template>
        </MDialog>
    </div>
</template>

<script setup lang='ts'>
import { ref, getCurrentInstance} from 'vue'
const {proxy} = getCurrentInstance();
import MDialog from '@/components/MDialog';
const props = defineProps({
    accept: { type: String, default: "" },
    uploadTip: { type: String, default: '' },
    importUrl:{type:String, default: '#'},
    headers:{type:Object, default:()=>{}},
    limit:{type:Number, default:1},
    title:{type:String, default:'导入'},
    otherData: {type:Object, default:()=>{}},
    showTemplateDownload: {type:Boolean, default:true},
    httpRequest: {type:Function, default:()=>{}},
    sureBtnName: {type:String, default:'导入'}
})
const uploadRef=ref()
const emitter = defineEmits(['success','templateDownload']);
const MDialogRef = ref()
const fileList=ref([])

function handleImport(DialogRef) {
    uploadRef.value.submit()
}
function handleBeforeUpload(file){
   console.log('file',file);
}
function handleUploadSuccess(response, file, fileList){
     emitter('success')
}
function handleUploadError(err, file, fileList){
    
}
async function templateDownload (){
  proxy.$message({message: '正在下载，请稍后查看', type: 'success'})
  emitter('templateDownload')
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