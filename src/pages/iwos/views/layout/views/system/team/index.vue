<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--部门数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="deptName"
              placeholder="请输入机构名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container one-screen-fg1 search_tree">
          <el-tree
              :data="deptOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="id"
              default-expand-all
              :highlight-current='true'
              @node-click="handleNodeClick"
          />
        </div>
      </div>
      <div class="one-screen one-screen-fg1">
        <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="auto">
          <el-form-item label="班组名称" prop="teamName">
            <el-input
                class="queryItem"
                v-model="queryParams.teamName"
                placeholder="请输入班组名称"
                clearable
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <!-- <el-form-item label="机构" prop="deptId">
            <treeselect v-model="queryParams.deptId" :options="deptOptions" :show-count="true" placeholder="请选择机构"  class="queryItem"/>
          </el-form-item> -->
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="queryParams.status"
                placeholder="用户状态"
                clearable
                class="queryItem"
            >
              <el-option
                  v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
                  v-bind="dict" :key="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" size="mini" @click="handleQuery">搜索</el-button>
            <el-button type="success" size="mini" @click="handleAdd" v-hasPermission="['system:team:add']">新增</el-button>
            <el-button type="info" plain size="small" @click="toggleExpandAll">展开/折叠</el-button>

          </el-form-item>
        </el-form>

        <el-table v-if="refreshTable" v-loading="loading" class="one-screen-fg1" height="100%" ref="table" :data="teamList" row-key="teamId" :default-expand-all="isExpandAll" :tree-props="{children: 'children', hasChildren: 'hasChildren'}" border>
          <el-table-column label="机构名称" align="center" prop="dept.deptName"/>
          <el-table-column label="班组名称" align="center" prop="teamName"/>
        
          <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="{row}">
              {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable', row.status) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime"/>
          <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button size="small" type="primary" @click="handleUpdate(scope.row)" v-hasPermission="['system:team:edit']">修改
              </el-button>
              <el-dropdown size="small">
                <el-button size="small" type="primary" style="margin-left:5px">更多<i class="el-icon-arrow-down el-icon--right"></i></el-button>
                <el-dropdown-menu slot="dropdown"  class="table-dropdown-menu">
                  <div class="inner">
                    <el-button  v-hasPermission="['system:team:edit']" type="success"  size="small" @click="handleAdd(scope.row)">新增</el-button>
                    <el-button  v-hasPermission="['system:team:remove']" type="danger"  size="small" @click="handleDelete(scope.row)">删除</el-button>
                    <el-button  v-hasPermission="['monitor:job:query']" type="primary"  size="small" @click="handleDetail(scope.row)">详情</el-button>
                  </div>
                </el-dropdown-menu>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40,50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>
      </div>

    </div>

    <!-- 添加或修改班组对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body @close="handleType=''">
      <el-form ref="form" :model="form" :rules="rules" label-width="80px" :disabled="handleType=='detail'">
        <el-form-item label="机构" prop="deptId">
          <treeselect v-model="form.deptId" :disabled="handleType=='detail'" :options="deptOptions" :show-count="true" :placeholder="handleType=='detail'?'':'请选择归属部门'" @select="handelDeptIdChange"/>
        </el-form-item>
        <el-form-item label="上级班组">
          <treeselect v-model="form.parentId" :disabled="handleType=='detail'" :options="teamOptions" :normalizer="normalizer" :placeholder="handleType=='detail'?'':'选择上级班组'" @select="handelparentIdChange"/>
        </el-form-item>
        <el-form-item label="班组名称" prop="teamName">
          <el-input v-model="form.teamName" :placeholder="handleType=='detail'?'':'请输入班组名称'"/>
        </el-form-item>
        <el-form-item label="角色" prop="roleIds">
          <el-select v-model="form.roleIds" :placeholder="handleType=='detail'?'':'请选择角色'" style="width:100%" clearable multiple>
            <el-option
                v-for="role in roleOptions"
                :key="role.roleId"
                :label="role.roleName"
                :value="role.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="班组描述" prop="teamDescribe">
          <el-input v-model="form.teamDescribe" type="textarea" maxlength="100" :placeholder="handleType=='detail'?'':'请输入班组描述'"/>
        </el-form-item>
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
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="handleType!='detail'">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import { listTeam, getTeam, delTeam, addTeam, updateTeam } from "@/api/system/team";
import Treeselect from "@riophae/vue-treeselect";

export default {
  name: "Team",
  components: {Treeselect},
  dicts: ['sys_normal_disable'],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 是否展开，默认全部展开
      isExpandAll: true,
      // 重新渲染表格状态
      refreshTable: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 班组表格数据
      teamList: [],
      // 班组树选项
      teamOptions: [],
      // 角色选项
      roleOptions: [],
      // 部门树选项
      deptOptions: undefined,
      // el-tree的转换
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 部门名称
      deptName: undefined,
      // 弹出层标题
      title: "",
      // 详情时隐藏按钮，表单不可编辑
      handleType:'',
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        teamName: null,
        deptId: null,
        parentId: null,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        deptId: [
          {required: true, message: "机构不能为空", trigger: "change"}
        ],
        teamName: [
          {required: true, message: "班组名称不能为空", trigger: "blur"}
        ],
      }
    };
  },
  watch: {
    // 根据名称筛选部门树
    deptName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getDeptTree()
    this.loading = false;
    this.$nextTick(() => this.$refs.table?.doLayout());
  },
  methods: {
    handleDetail(row){
      this.reset();
      this.handleType='detail'
      const teamId = row.teamId || this.ids
      this.getDeptTree()
      this.$$api.team.getTeam({teamId: teamId}).then(({res: response, err}) => {
        if (err) return
        // this.form = response.data;
        let {parentId, deptId, teamName, teamId, status, roleIds} = {...response}
        if (deptId) {
          this.getTeamTreeInfo(deptId)
        }
        if(parentId=='0'){
          parentId=undefined
        }
        this.form = {parentId, deptId, teamName, teamId, status, roleIds} 
        this.roleOptions = response.roles
        this.open = true;
        this.title = "班组详情";
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.deptId = data.id;
      this.handleQuery();
    },
    // 机构变动时清除选择的班组，班组名，角色，获取班组数据
    handelDeptIdChange(val) {
      this.form.parentId = undefined
      this.form.teamName = null
      this.form.roleIds = []
      this.roleOptions = []
      this.getTeamTreeInfo(val.id)
      this.getDeptRoleInfo(val.id)
    },
    getTeamTreeInfo(deptId) {
      this.$$api.team.getDeptTeamTree({deptId: deptId}).then(({res: response, err}) => {
        if (err) return
        this.teamOptions = this.$$handleTree(response.rows, "teamId");
      });
    },
    getTeamRoleInfo(teamId) {
      this.$$api.team.getTeamRoleTree({orgId: teamId}).then(({res: response, err}) => {
        if (err) return
        // 只有数据为空时，才进行赋值
        if (this.roleOptions.length == 0) {
          this.roleOptions = response.rows
        }
      });
    },
    getDeptRoleInfo(deptId) {
      this.$$api.team.getDeptRoleTree({deptId: deptId}).then(({res: response, err}) => {
        if (err) return
        // 只有数据为空时，才进行赋值
        if (this.roleOptions.length == 0) {
          this.roleOptions = response.rows
        }
      });
    },

    // 班组变动时，角色也动态获取
    handelparentIdChange(val) {
      this.roleOptions = []
      this.form.roleIds = []
      this.getTeamRoleInfo(val.teamId)
    },
    /** 查询部门下拉树结构 */
    getDeptTree() {
      this.$$api.user.deptTreeSelect().then(({res, err}) => {
        if (err) return;
        this.deptOptions = res?.list || [];
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
    /** 查询班组列表 */
    getList() {
      this.loading = true;
      this.$$api.team.listTeam({params: this.queryParams}).then(({res: response, err}) => {
        if (err) return this.loading = false;
        this.teamList = this.$$handleTree(response.rows, "teamId");
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 转换班组数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.teamId,
        label: node.teamName,
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
        teamId: null,
        teamName: null,
        teamDescribe:null,
        deptId: null,
        parentId: null,
        status: "0",
        roleIds: []
      };
      this.$$resetForm("form", this.$refs);
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.$$resetForm("queryForm", this.$refs);
      this.queryParams.deptId = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    // handleSelectionChange(selection) {
    //   this.ids = selection.map(item => item.teamId)
    //   this.single = selection.length!==1
    //   this.multiple = !selection.length
    // },
    /** 新增按钮操作 */
    async handleAdd(row) {
      this.reset();
      if (row != undefined && row.deptId) {
        this.form.deptId = row.deptId;
        this.form.parentId = row.teamId;
        this.getTeamTreeInfo(row.deptId)
        await this.getDeptRoleInfo(row.deptId)
        await this.getTeamRoleInfo(row.teamId)
      }
      this.open = true;
      this.title = "添加班组";
      this.getDeptTree()

    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const teamId = row.teamId || this.ids
      this.getDeptTree()
      this.$$api.team.getTeam({teamId: teamId}).then(({res: response, err}) => {
        if (err) return
        // this.form = response.data;
        let {parentId, deptId, teamName,teamDescribe, teamId, status, roleIds} = {...response}
        if (deptId) {
          this.getTeamTreeInfo(deptId)
        }
        if(parentId=='0'){
          parentId=undefined
        }
        this.form = {parentId, deptId, teamName,teamDescribe, teamId, status, roleIds}
        this.roleOptions = response.roles
        this.open = true;
        this.title = "修改班组";
      });
    },

    /** 提交按钮 */
    submitForm() {
      let that=this;
      that.$refs["form"].validate(valid => {
        if (valid) {
          if (that.form.teamId != null) {
            if(that.form.status=='1'){
              that.$$Dialog.confirm('确定停用所选部门吗?停用后部门下的事项目录，事项子目录和目录下的事项一同被停用!', '提示', {
                confirmButtonText: '确定', cancelButtonText: '取消', type: 'warning'
              }).then(() =>{
                  that.$$api.team.updateTeam({data: that.form}).then(({res: response, err}) => {
                if (err) return
                that.$$Toast.success("修改成功");
                that.open = false;
                that.getList(); 
              });
              })
            }else{
              that.$$api.team.updateTeam({data: that.form}).then(({res: response, err}) => {
              if (err) return
              that.$$Toast.success("修改成功");
              that.open = false;
              that.getList();
            });
            }
          } else {
            that.$$api.team.addTeam({data: that.form}).then(({res: response, err}) => {
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
      this.$$Dialog.confirm('是否确认删除班组名称为"' + row.teamName + '"的数据项？').then(() => {
        return this.$$api.team.delTeam({teamId: row.teamId});
      }).then(({res: response, err}) => {
        if (err) return
        this.getList();
        this.$$Toast.success("删除成功");
      }).catch(() => {
      });
    },
  }
};
</script>
<style scoped>
.queryItem {
  width: 240px;
}
</style>
