<template>
  <div class="FileUploader">
    <div class="main-title">
      <span>附件</span>
      <div class="file-btns">
        <el-button type="success" icon="el-icon-plus" size="mini" @click="()=>($refs.FileInput.value = null,$refs.FileInput.click())">添加附件</el-button>
        <input ref="FileInput" type="file" multiple style="display: none;" @change="fileUpload"/>
      </div>
    </div>
    <div class="table">
      <el-table v-loading="loading" :data="fileData" border max-height="200px">
        <el-table-column type="index" label="序号" align="center" width="50" fixed></el-table-column>
        <el-table-column prop="attchementNum" label="附件编号" width="280"></el-table-column>
        <el-table-column prop="attchementName" label="附件名称"></el-table-column>
        <el-table-column label="操作" width="120px" align="center">
          <template #default="{row}">
            <el-button type="text" size="mini" @click="fileDownload(row)">下载</el-button>
            <el-button type="text" size="mini" @click="fileDelete(row.attchementId)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>

export default {
  name: "FileUploader",
  props: {
    hasUpload: {type: Boolean, default: false},//是否可以上传
    requirementId: {type: [String, Number], default: ''},
    requirementType: {type: String, default: ''},
    accept: {type: Array, default: () => ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/gif', 'image/jpeg', 'image/png', 'image/jpeg', 'application/pdf', 'text/plain']},
    acceptNames: {type: Array, default: () => ['png', 'jpg', 'jpeg', 'gif', 'pdf', 'xlsx', 'xls', 'doc', 'docx', 'txt']}
  },
  data() {
    return {
      loading: false,
      fileData: [],
    };
  },
  methods: {
    async getFileList() {
      this.loading = true;
      // const {res} = await this.$$api.file.fileList({loading: false, data: {objId: this.requirementId, objType: this.requirementType}});
      // this.loading = false;
      // this.fileData = res?.data || [];
    },
    async fileUpload(e) {
      const filterFileList = Array.prototype.filter.call(e.target.files, (v) => this.accept.includes(v.type))
      if (!filterFileList.length) return this.$message({message: `只能上传[${this.acceptNames.join(',')}]格式文件`, type: 'error'});
      if (filterFileList.length < e.target.files.length) this.$message({message: `只能上传[${this.acceptNames.join(',')}]格式文件，已为您过滤后上传...`, type: 'warning'});
      const {res, err} = await this.$$api.file.fileUpload({data: {file: filterFileList, objId: this.requirementId, objType: this.requirementType}});
      if (res?.code == '200' && res?.data) return (this.getFileList(), this.$message({message: '附件上传成功', type: 'success'}));
      this.$message({message: err?.message || '附件上传失败', type: 'error'});
    },
    async fileDownload({attchementNum, attchementName, attchementType}) {
      this.$message({message: '正在下载，请稍后查看', type: 'success'})
      // this.$$downloadFile(`${apiPrefix('nicheApi')}/common/attchement/uncheck/download?attchementName=${attchementName}&attchementNum=${attchementNum}&attchementType=${attchementType}`, attchementName);
    },
    async fileDelete(attchementId) {
      const {res} = await this.$$api.file.fileDelete(attchementId);
      if (res?.code == '200' && res?.data) return (this.getFileList(), this.$message({message: '附件删除成功', type: 'success'}));
      this.$message({message: '附件删除失败', type: 'error'});
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

</style>
