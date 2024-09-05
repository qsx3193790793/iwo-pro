<template>
    <div>
        <el-dialog  :visible.sync="dialogVisible" width="35%" top="20vh" :close-on-click-modal="!1" destroy-on-close append-to-body :show-close="false">
            <span slot="title" class="notice-title" >
                <div style="font-weight: bold;margin-bottom: 8px;color: #333f5b;font-size: 16px;">{{ detailData?.noticeTitle }} </div>
                <div style="font-size: 12px;color: #a7afbe;font-weight: bold;">
                    <span style="margin-right:10px;">发布人: <span style="font-weight: bold;color: #333f5b;">{{ detailData.publisher + '-' + detailData.publishDeptName }}</span> </span>
                    <span>发布日期: <span style="font-weight: bold;color: #333f5b;"> {{ detailData.updateTime }}</span></span>
                </div>
                <el-divider></el-divider>
            </span>
            <div style="height: 15vh;overflow: scroll;" v-html="detailData.noticeContent"></div>
            <span slot="footer" >
                <el-divider></el-divider>
                <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, getCurrentInstance } from 'vue'
const props = defineProps({
    noticeId: { type: String, default: null },
    value: {type: Boolean, default: false},
});
const dialogVisible = computed({
  get: () => props.value,
  set: v => {
    proxy.$emit('input', v)
  }
});
const detailData=ref({
    noticeTitle:'',
    publisher:'',
    publishDeptName:'',
    updateTime:'',
    noticeContent:''
})
const { proxy } = getCurrentInstance()
function handleDetail() {
    proxy.$$api.notice.getNotice({ noticeId: props.noticeId }).then(({ res: response, err }) => {
        if (err) return
        detailData.value = response
    });
}

onMounted(() => {
    handleDetail()
})
</script>
<script>
export default {
    dicts: ['sys_notice_type', 'sys_notice_status']
}
</script>
<style scoped lang="scss">
.notice-title{
    background-color:red;
}
::v-deep{
    .el-dialog__header{
        background: linear-gradient(to bottom, #cce8ff, #fcfdfd);
    }
   .el-dialog__body{
     padding:0rem 0.2rem;
   }
}
</style>
