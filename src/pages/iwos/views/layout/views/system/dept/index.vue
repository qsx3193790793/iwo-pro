<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="部门名称" prop="deptName">
        <el-input
            v-model="queryParams.deptName"
            placeholder="请输入部门名称"
            clearable
            @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="部门状态" clearable>
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
      <el-table-column prop="deptName" label="部门名称" width="260"></el-table-column>
      <el-table-column prop="orderNum" label="排序" width="200"></el-table-column>
      <el-table-column prop="status" label="状态" width="100">
        <template slot-scope="{row}">
          <!--          <dict-tag :options="$$dictionaries.get('sys_normal_disable')" :value="scope.row.status"/>-->
           {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable',row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermission="['system:dept:edit']"
          >修改
          </el-button>
          <el-button
              size="small"
              type="success"
              @click="handleAdd(scope.row)"
              v-hasPermission="['system:dept:add']"
          >新增
          </el-button>
          <el-button
              v-if="scope.row.parentId != 0"
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermission="['system:dept:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改部门对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px"  label-position="left">
        <el-row>
          <el-col :span="24" v-if="form.parentId !== 0">
            <el-form-item label="上级部门" prop="parentId">
              <treeselect v-model="form.parentId" :options="deptOptions" :normalizer="normalizer" placeholder="选择上级部门"  @select="handelDeptIdChange"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24" v-if="deptParentId == 0">
            <el-form-item label="所属省份" prop="provinceCode">
              <el-select v-model="form.provinceCode" placeholder="请选择所属省份" style="width:100%" clearable >
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
            <el-form-item label="部门名称" prop="deptName">
              <el-input v-model="form.deptName" placeholder="请输入部门名称"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="角色">
          <el-select v-model="form.roleIds" placeholder="请选择角色" style="width:100%" clearable multiple>
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
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="负责人" prop="leader">
              <el-input v-model="form.leader" placeholder="请输入负责人" maxlength="20"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="form.phone" placeholder="请输入联系电话" maxlength="11"/>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input v-model="form.email" placeholder="请输入邮箱" maxlength="50"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="部门状态">
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
      <div slot="footer" class="dialog-footer">
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
      // 新增编辑选部门时所选部门的父级id
      deptParentId:null,
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 表格树数据
      deptList: [],
      // 用户角色
      roleOptions:[],
      // 部门树选项
      deptOptions: [],
      // 弹出层标题
      title: "",
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
          {required: true, message: "上级部门不能为空", trigger: ["blur",'change']}
        ],
        provinceCode: [
          {required: true, message: "所属省份不能为空", trigger: "blur"}
        ],
        deptName: [
          {required: true, message: "部门名称不能为空", trigger: "blur"}
        ],
        orderNum: [
          {required: true, message: "显示排序不能为空", trigger: "blur"}
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
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      this.$$api.dept.listDept({params: this.queryParams}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.deptList = this.$$handleTree(response.list, "deptId");
        console.log( this.deptList,'---999')
        this.loading = false;
      });
    },
    /** 转换部门数据结构 */
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
        orderNum: undefined,
        leader: undefined,
        phone: undefined,
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
      this.title = "添加部门";
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
        this.title = "修改部门";
      });
      this.$$api.dept.listDeptExcludeChild({deptId: row.deptId}).then(({res: response, err}) => {
        if (err) return
        this.deptOptions = this.$$handleTree(response.list, "deptId");
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.deptId != undefined) {
            this.$$api.dept.updateDept({data: this.form}).then(({res: response, err}) => {
              if (err) return
              this.$$Toast.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$$api.dept.addDept({data: this.form}).then(({res: response, err}) => {
              if (err) return
              this.$$Toast.success("新增成功");
              this.open = false;
              this.getList();
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
