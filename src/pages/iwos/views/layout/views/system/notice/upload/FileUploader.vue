<template>
  <div class="FileUploader">
    <div class="main-title">
      <div class="file-btns">
        <el-button  v-if="!hasEdit" type="success" icon="el-icon-plus" size="small"
          @click="addFile">添加附件</el-button>
        <!-- <el-button type="success" icon="el-icon-plus" size="mini" @click="()=>($refs.FileInput.value = null,$refs.FileInput.click())">添加附件</el-button>
        <input ref="FileInput" type="file" multiple style="display: none;" @change="fileUpload"/> -->
      </div>
    </div>
    <div class="table">
      <el-table v-loading="loading" :data="fileData" border max-height="200px">
        <el-table-column prop="attachName" label="附件名称"></el-table-column>
        <el-table-column prop="attachDesc" label="附件描述"></el-table-column>
        <el-table-column label="操作" width="120px" align="center" v-if="!hasEdit">
          <template #default="{ row }">
            <el-button type="text" size="mini" @click="fileDownload(row)">下载</el-button>
            <el-button  type="text" size="mini" @click="fileDelete(row)">删除</el-button>
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
import importDialog from '../../../order/complaintForm/import/index.vue'
export default {
  name: "FileUploader",
  components: {
    importDialog
  },
  props: {
    acceptNames: { type: Array, default: () => ['txt', 'jpg', 'doc', 'docx', 'xlsx', 'xls', 'bmp', 'wmv', 'mp4', 'mp3', 'png', 'dat', 'rm', 'avi', 'zip', 'rar'] },
    value: { type: Array, default: () => [] },
    attachments:{type: Array, default: () => []}, //文件列表
    hasEdit:{type:Boolean, default: false} //是否详情页
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
   getFileList() {
        this.fileData = this.attachments
    },
    addFile() {
      this.attachDesc = ''
      this.isShowImportDialog = true
    },
    //上传附件
    async fileUpload(e) {
      if (!this.attachDesc.trim()) return this.$message({ message: `请输入附件描述`, type: 'error' });
      if (e.file.size > 20971520) return this.$message({ message: `只能上传小于20M大小的文件`, type: 'error' });
      const fileType = e.file.name.match(/\.([^.]+)$/)[1]
      if (!this.acceptNames.includes(fileType)) return this.$message({ message: `只能上传[${this.acceptNames.join(',')}]格式文件`, type: 'error' });
      const formdata = new FormData()
      formdata.append('attachFile', e.file)
      formdata.append('attachDesc', this.attachDesc)
      const { res, err } = await this.$$api.file.fileUpload({ data: formdata });
      if (err) return this.$message({ message: err?.message || '附件上传失败', type: 'error' });
      this.fileData.push({ ...res, isNewUpload: true })
      this.$emit('input', this.fileData.map(item => item.attId))
      this.isShowImportDialog = false
    },
    //下载附件
    async fileDownload({ attId, attachName, attachFileType }) {
      this.$message({ message: '正在下载，请稍后查看', type: 'success' })
      const { res, err } = await this.$$api.file.fileDownload({ params: { attachmentId: attId } });
      console.log('res', res);
      this.$$downloadFile(URL.createObjectURL(res.blob), attachName + attachFileType);
    },
    //删除附件
    async fileDelete(row) {
      this.fileData = this.fileData.filter(item => item.attId !== row.attId)
      this.$message({ message: '附件删除成功', type: 'success' })
      this.$emit('input', this.fileData.map(item => item.attId))
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

.require {
  margin-bottom: 6px;

  &:before {
    content: '*';
    color: red;
    padding-right: 4px;
  }
}
</style>
