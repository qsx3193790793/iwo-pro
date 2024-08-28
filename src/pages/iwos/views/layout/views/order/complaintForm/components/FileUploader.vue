<template>
  <div class="FileUploader">
    <div class="main-title">
      <span>附件</span>
      <div class="file-btns">
        <el-button v-if="!root.vm.disabled" type="success" icon="el-icon-plus" size="small" @click="addFile">添加附件</el-button>
        <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="()=>($refs.FileInput.value = null,$refs.FileInput.click())">添加附件</el-button>
        <input ref="FileInput" type="file" multiple style="display: none;" @change="fileUpload"/> -->
      </div>
    </div>
    <div class="table">
      <el-table v-loading="loading" :data="fileData" border max-height="200px">
        <el-table-column type="index" label="序号" align="center" width="50" fixed></el-table-column>
        <el-table-column prop="attachIndex" label="附件编号" width="280"></el-table-column>
        <el-table-column prop="attachName" label="附件名称"></el-table-column>
        <el-table-column prop="attachDesc" label="附件描述"></el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" @click="fileDownload(row)">下载</el-button>
            <el-button v-if="!root.vm.disabled" type="text" size="mini" @click="fileDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <importDialog v-if="isShowImportDialog" v-model="isShowImportDialog" v-bind="uploadConfig">
      <template>
        <div v-html="'附件描述'" class="require"></div>
        <el-input v-model="attachDesc" type="textarea" placeholder="请输入附件描述" maxlength="80"></el-input>
      </template>
    </importDialog>
  </div>
</template>

<script>
import importDialog from '../import/index.vue'

export default {
  name: "FileUploader",
  components: {
    importDialog
  },
  props: {
    hasUpload: {type: Boolean, default: false},//是否可以上传
    requirementId: {type: [String, Number], default: ''},
    requirementType: {type: String, default: ''},
    // accept: {type: Array, default: () => ['text/plain','image/png','application/msword','application/vnd.openxmlformats-officedocument.wordprocessingml.document','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    // 'application/vnd.ms-excel','image/bmp','video/x-ms-wmv','video/mp4','audio/mpeg','image/png','video/avi','application/x-zip-compressed']},
    acceptNames: {type: Array, default: () => ['txt', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'bmp', 'wmv', 'mp4', 'mp3', 'png', 'dat', 'rm', 'avi', 'zip', 'rar']},
    root: {
      type: Object, default: () => {
      }
    }
  },
  data() {
    return {
      loading: false,
      fileData: [],
      isShowImportDialog: false,
      attachDesc: '',
      uploadConfig: {
        uploadTip: "提示:仅允许导入 'txt','jpg','doc','docx','xlsx','xls','bmp','wmv','mp4','mp3','png','dat','rm','avi','zip','rar'格式文件!",
        title: '附件上传',
        showTemplateDownload: false,
        sureBtnName: '上传',
        httpRequest: (e) => {
          this.fileUpload(e)
        }
      }
    };
  },
  methods: {
    reset() {
      this.fileData = [];
    },
    async getFileList() {
      if (this.$route.params.workorderId) {
        this.loading = true;
        const {res} = await this.$$api.file.fileList({workorderId: this.$route.params.workorderId});
        this.fileData = res?.list || [];
        this.loading = false;
      }
    },
    addFile() {
      this.attachDesc = ''
      this.isShowImportDialog = true
    },
    async fileUpload(e) {
      if (!this.attachDesc.trim()) return this.$message({message: `请输入附件描述`, type: 'error'});
      if (e.file.size > 20971520) return this.$message({message: `只能上传小于20M大小的文件`, type: 'error'});
      const fileType = e.file.name.match(/\.([^.]+)$/)[1]
      if (!this.acceptNames.includes(fileType)) return this.$message({message: `只能上传[${this.acceptNames.join(',')}]格式文件`, type: 'error'});
      const formdata = new FormData()
      formdata.append('attachFile', e.file)
      formdata.append('attachDesc', this.attachDesc)
      formdata.append('workOrderType', this.root.vm.formData.workorderType)
      formdata.append('workOrderStage', this.root.vm.formData.statusCd ? this.root.vm.formData.statusCd : 'C100001')
      const {res, err} = await this.$$api.file.fileUpload({data: formdata});
      if (err) return this.$message({message: err?.message || '附件上传失败', type: 'error'});
      this.fileData.push({...res, isNewUpload: true})
      //更新表单附件ids
      this.root.vm.initFormData({
        workOrderAttachmentIdList: this.fileData.map(item => item.attId)
      });
      this.isShowImportDialog = false
    },
    async fileDownload({attId, attachName, attachFileType}) {
      this.$message({message: '正在下载，请稍后查看', type: 'success'})
      const {res, err} = await this.$$api.file.fileDownload({params: {attachmentId: attId}});
      console.log('res', res);
      this.$$downloadFile(URL.createObjectURL(res.blob), attachName + attachFileType);
    },
    async fileDelete(row) {
      const {res, err} = await this.$$api.file.fileDelete({attIds: row.attId});
      if (err) return this.$message({message: err?.message || '附件删除失败', type: 'error'});
      this.$message({message: '附件删除成功', type: 'success'})
      this.fileData = this.fileData.filter(item => item.attId !== row.attId)
    }
  },
  created() {
    this.getFileList();
  }
}
</script>

<style scoped lang="scss">
.table {
  margin-bottom: 20px;
}

.file-btns {
  text-align: right;
}

.require:before {
  content: '*';
  color: red;
  padding-right: 4px;
}

</style>
