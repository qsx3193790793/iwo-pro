<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="机构名称" prop="deptName">
        <el-input
            v-model="queryParams.deptName"
            placeholder="请输入机构名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="机构状态" clearable>
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button  size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" size="small" @click="handleQuery">搜索</el-button>
        <el-button
            type="success"
            size="small"
            @click="handleAdd"
            v-hasPermission="['system:dept:add']"
        >新增
        </el-button>
        <el-button
            type="info"
            plain
            size="small"
            @click="toggleExpandAll"
        >展开/折叠
        </el-button>
      </el-form-item>
    </el-form>

    <!-- <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
       
      </el-col>
      <el-col :span="1.5">
       
      </el-col>
    </el-row> -->

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        ref="table"
        :data="deptList"
        row-key="deptId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
    >
      <el-table-column prop="deptName" label="机构名称" ></el-table-column>
      <el-table-column prop="deptAbbreviate" label="机构简称" ></el-table-column>
      <el-table-column prop="deptCode" label="机构编码" ></el-table-column>
      <el-table-column prop="status" label="状态" >
        <template slot-scope="{row}">
          <!--          <dict-tag :options="$$dictionaries.get('sys_normal_disable')" :value="scope.row.status"/>-->
           {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable',row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" >
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" >
        <template slot-scope="scope">
          <el-button
              size="small"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermission="['system:dept:edit']"
          >修改
          </el-button>
          <el-dropdown size="small">
                <el-button size="small" type="primary" style="margin-left:5px">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown"  class="table-dropdown-menu">
                  <div class="inner">
                    <el-button  v-hasPermission="['system:dept:add']" type="success"  size="small" @click="handleAdd(scope.row)">新增</el-button>
                    <el-button  v-hasPermission="['system:dept:remove']" type="danger"  size="small" @click="handleDelete(scope.row)">删除</el-button>
                    <el-button  v-hasPermission="['system:dept:query']" type="primary"  size="small" @click="handleDetail(scope.row)">详情</el-button>
                  </div>
                </el-dropdown-menu>
          </el-dropdown>


          <!-- <el-button
              size="small"
              type="success"
              @click="handleAdd(scope.row)"
              v-hasPermission="['system:dept:add']"
          >新增
          </el-button> -->
          <!-- <el-button
              v-if="scope.row.parentId != 0"
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermission="['system:dept:remove']"
          >删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改机构对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body @close="handleType=''">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px"  label-position="left" :disabled="handleType=='detail'">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级机构" prop="parentId">
              <treeselect v-model="form.parentId" :disabled="handleType=='detail'" :options="deptOptions" :normalizer="normalizer" :placeholder="handleType=='detail'?'':'选择上级机构'"  @select="handelDeptIdChange"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="deptParentId == 0">
            <el-form-item label="所属省份" prop="provinceCode">
              <el-select v-model="form.provinceCode" :placeholder="handleType=='detail'?'':'请选择所属省份'" style="width:100%" clearable >
                <el-option
                    v-for="province in $store.getters['dictionaries/GET_DICT']('base_province_code')"
                     :key="province.value"
                     :label="province.label"
                     :value="province.value"
                />
              </el-select>
              </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="机构名称" prop="deptName">
              <el-input v-model="form.deptName" :placeholder="handleType=='detail'?'':'请输入机构名称'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色">
          <el-select v-model="form.roleIds" :placeholder="handleType=='detail'?'':'请选择角色'" style="width:100%" clearable multiple>
            <el-option
                v-for="role in roleOptions"
                :key="role.roleId"
                :label="role.roleName"
                :value="role.roleId"
            />
          </el-select>
        </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="机构描述" >
              <el-input v-model="form.deptDescribe" type="textarea" maxlength="100" :placeholder="handleType=='detail'?'':'请输入机构描述'"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" :placeholder="handleType=='detail'?'':'请输入负责人'" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" :placeholder="handleType=='detail'?'':'请输入联系电话'" maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" :placeholder="handleType=='detail'?'':'请输入邮箱'" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="机构状态">
              <el-radio-group v-model="form.status">
                <el-radio
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
                    :key="dict.value"
                    :label="dict.value"
                >{{ dict.label }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="handleType!='detail'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "Dept",
  dicts: ['sys_normal_disable'],
  cusDicts:['base_province_code'],
  components: {Treeselect},
  data() {
    return {
      // 新增编辑选机构时所选机构的父级id
      deptParentId:null,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 用户角色
      roleOptions:[],
      // 机构树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
      // 判断是否详情页
      handleType:'',
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        deptName: undefined,
        status: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        parentId: [
          {required: true, message: "上级机构不能为空", trigger: ["blur",'change']}
        ],
        provinceCode: [
          {required: true, message: "所属省份不能为空", trigger: "blur"}
        ],
        deptName: [
          {required: true, message: "机构名称不能为空", trigger: "blur"}
        ],
        email: [
          {
            type: "email",
            message: "请输入正确的邮箱地址",
            trigger: ["blur", "change"]
          }
        ],
        phone: [
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: "请输入正确的手机号码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.loading = false;
    // this.deptList = this.$$handleTree(dataRes.data, "deptId");
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    handleDetail(row){
      this.handleType='detail'
      this.reset();
      this.$$api.dept.getDept({deptId: row.deptId}).then(({res: response, err}) => {
        if (err) return
        this.form = response;
        this.roleOptions=response.roles
        this.open = true;
        this.title = "机构详情";
      });
      this.$$api.dept.listDeptExcludeChild({deptId: row.deptId}).then(({res: response, err}) => {
        if (err) return
        this.deptOptions = this.$$handleTree(response.list, "deptId");
      });
    },
    // 机构变动时清除选择的班组，班组名，角色，获取班组数据
    handelDeptIdChange(val){
      this.deptParentId=val.parentId
      this.form.roleIds=null
      this.roleOptions=[]
      this.getDeptRoleInfo(val.deptId)
    },
    // 获取角色列表
    getDeptRoleInfo(deptId){
      this.$$api.team.getDeptRoleTree({deptId:deptId}).then(({res: response, err}) => {
        if (err) return
          this.roleOptions = response.rows
      });
    },
    /** 查询机构列表 */
    getList() {
      this.loading = true;
      this.$$api.dept.listDept({params: this.queryParams}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.deptList = this.$$handleTree(response.list, "deptId");
        console.log( this.deptList,'---999')
        this.loading = false;
      });
    },
    /** 转换机构数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.deptId,
        label: node.deptName,
        children: node.children
      };
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        deptId: undefined,
        parentId: undefined,
        deptName: undefined,
        provinceCode: undefined,
        leader: undefined,
        phone: undefined,
        deptDescribe: undefined,
        email: undefined,
        status: "0",
        roleIds:[]
      };
      this.$$resetForm("form", this.$refs);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$refs['queryForm']?.resetFields();
      this.handleQuery();
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      if (row != undefined) {
        this.form.parentId = row.deptId;
        if(row.parentId==0){
          this.deptParentId=0
        }
      }
      this.open = true;
      this.title = "添加机构";
      this.$$api.dept.listDept().then(({res: response, err}) => {
        if (err) return
        this.deptOptions = this.$$handleTree(response.list, "deptId");
      });
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.$$api.dept.getDept({deptId: row.deptId}).then(({res: response, err}) => {
        if (err) return
        this.form = response;
        this.roleOptions=response.roles
        this.open = true;
        this.title = "修改机构";
      });
      this.$$api.dept.listDeptExcludeChild({deptId: row.deptId}).then(({res: response, err}) => {
        if (err) return
        this.deptOptions = this.$$handleTree(response.list, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      let that=this;
      that.$refs["form"].validate(valid => {
        if (valid) {
          if (that.form.deptId != undefined) {
            if(that.form.status=='1'){
              that.$$Dialog.confirm('确定停用所选机构吗?停用后机构下的事项目录，事项子目录和目录下的事项一同被停用!', '提示', {
                confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
              }).then(() =>{
                that.$$api.dept.updateDept({data: that.form}).then(({res: response, err}) => {
                  if (err) return
                  that.$$Toast.success("修改成功");
                  that.open = false;
                  that.getList();
                });
              })
            }else{
              that.$$api.dept.updateDept({data: that.form}).then(({res: response, err}) => {
                if (err) return
                that.$$Toast.success("修改成功");
                that.open = false;
                that.getList();
              });
            }
            
          } else {
            that.$$api.dept.addDept({data: that.form}).then(({res: response, err}) => {
              if (err) return
              that.$$Toast.success("新增成功");
              that.open = false;
              that.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$$Dialog.confirm('是否确认删除名称为"' + row.deptName + '"的数据项？').then(() => {
        return this.$$api.dept.delDept({deptId: row.deptId});
      }).then(({res: response, err}) => {
        if (err) return
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    }
  }
};
</script>
