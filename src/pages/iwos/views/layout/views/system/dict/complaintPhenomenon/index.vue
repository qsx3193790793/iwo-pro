<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--机构数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="treePhenomName"
              placeholder="请输入现象名称"
              clearable
              size="small"
              maxlength="30"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
          >
            <template slot="append">
              <el-button type="primary" @click="handleCheckedTreeExpand">{{ isExpend ? '折叠' : '展开' }}</el-button>
            </template>
          </el-input>
          <!-- <el-checkbox
              v-model="deptExpand"
              @change="handleCheckedTreeExpand($event, 'dept')"
          >展开/折叠
          </el-checkbox
          > -->
        </div>
        <div class="head-container nodeTree one-screen-fg1 search_tree">
          <el-tree
              :data="complaintPhenomenonTreeOptions"
              :props="defaultProps"
              :expand-on-click-node="false"
              :filter-node-method="filterNode"
              ref="tree"
              node-key="phenomId"
              :default-expand-all="isExpend"
              :highlight-current="true"
              @node-click="handleNodeClick"
          />
        </div>
      </div>
      <!--用户数据-->
      <div class="one-screen one-screen-fg1">
        <el-form
            class="one-screen-fg0"
            :model="queryParams"
            ref="queryForm"
            size="small"
            :inline="true"
            v-show="showSearch"
            label-width="auto"
        >
          <el-form-item label="投诉现象编码" prop="phenomCode">
            <el-input
                v-model="queryParams.phenomCode"
                placeholder="请输入投诉现象编码"
                maxlength="30"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="投诉现象名称" prop="phenomName">
            <el-input
                v-model="queryParams.phenomName"
                placeholder="请输入投诉现象名称"
                maxlength="30"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="是否省自定义" prop="isProvinceCustom">
            <el-select
                v-model="queryParams.isProvinceCustom"
                placeholder="请选择是否省自定义"
                clearable
                style="width: 240px"
            >
              <el-option
                  v-for="dict in $store.getters['dictionaries/GET_DICT']('yes_no')"
                  v-bind="dict"
                  :key="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="状态" prop="status">
            <el-select
                v-model="queryParams.status"
                placeholder="请输入状态"
                clearable
                style="width: 240px"
            >
              <el-option
                  v-for="dict in $store.getters['dictionaries/GET_DICT']('phenom_status_name')"
                  v-bind="dict"
                  :key="dict.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" @click="resetQuery">重置</el-button>
            <el-button type="primary" size="mini" @click="handleQuery" v-hasPermission="['config:phenom:list']">查询</el-button>
            <el-button type="success" size="mini" :disabled="!isAllowAdd " @click="handleAdd(selectRow)" v-hasPermission="['config:phenom:add']">新增</el-button>
            <!-- <el-button type="danger" size="mini" :disabled="isAllowDelet" @click="handleDelete(selectRow)" v-hasPermission="['config:phenom:update']">删除</el-button> -->
          </el-form-item>
        </el-form>
        <JsTable class="one-screen-fg1" :dataSource="dataSource" :columns="columns" @selectionChange="handleSelectionChange">
          <template #isProvinceCustom="{row}">
            {{ $store.getters['dictionaries/MATCH_LABEL']('yes_no', row.isProvinceCustom) }}
          </template>
          <template #level="{row}">
            {{ row.level }}
          </template>
          <template #status="{ row }">
            {{ $store.getters['dictionaries/MATCH_LABEL']('phenom_status_name', row.status) }}
          </template>

        </JsTable>
        <el-pagination
            class="one-screen-fg0"
            :current-page.sync="queryParams.pageNum"
            :page-size.sync="queryParams.pageSize"
            :page-sizes="[15, 30, 40, 50]"
            background
            layout=" ->,total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="getList"
            @current-change="getList"
        />
        <!--        <el-pagination :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="getList"/>-->
      </div>
    </div>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body :close-on-click-modal="!1">
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position='left'>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉现象一级名称">
              <el-input
                  v-model="form.firstPhenomName"
                  placeholder="请输入"
                  maxlength="30"
                  disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉现象一级编码">
              <el-input
                  v-model="form.firstPhenomCode"
                  placeholder="请输入"
                  maxlength="30"
                  disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉现象二级名称">
              <el-input
                  v-model="form.secondPhenomName"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉现象二级编码">
              <el-input
                  v-model="form.secondPhenomCode"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉现象名称" prop='phenomName'>
              <el-input
                  v-model="form.phenomName"
                  placeholder="请输入"
                  maxlength="30"
                  :disabled="detailDisabled"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉现象编码">
              <el-input
                  v-model="form.phenomCode"
                  placeholder="请输入"
                  maxlength="30"
                  disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="是否省自定义">
              <el-select v-model="form.isProvinceCustom" placeholder="请选择是否省自定义" clearable disabled>
                <el-option
                    v-for="dict in $store.getters['dictionaries/GET_DICT']('yes_no')"
                    v-bind="dict"
                    :key="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="this.form.userId">
            <el-form-item label="用户状态" prop="status">
              <el-radio-group v-model="form.status" :disabled="detailDisabled">
                <el-radio :label="1">启用</el-radio>
                <el-radio :label="0">停用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer" v-show="!detailDisabled">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import Treeselect from "@riophae/vue-treeselect";
import JsTable from "@/components/js-table/index.vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";

export default {
  name: "ComplaintPhenomenon",
  // dicts: ["sys_normal_disable", "sys_user_sex"],
  dicts: ["phenom_status_name", "yes_no"],
  components: {Treeselect, PageSearchPanel, JsTable},
  data() {
    return {
      // 遮罩层
      loading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      //是否可以新增
      isAllowAdd: false,
      //是否可以删除
      isAllowDelet: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataSource: [],
      // 弹出层标题
      title: "",
      //投诉现象树形列表
      complaintPhenomenonTreeOptions: undefined,
      // 机构树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 机构名称
      deptName: undefined,
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      //现象列表关键字查询
      treePhenomName: undefined,
      //上级现象编码
      // superiorCode:undefined,
      //上级现象名称
      superiorName: undefined,
      //选中行数据
      selectRow: {},
      //单击节点选中数据
      currentNodeData: {},
      //树形组件是否展开
      isExpend: true,
      // 表单参数
      form: {},
      defaultProps: {
        children: "phenomList",
        label: "phenomName",
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        phenomCode: undefined,
        phenomName: undefined,
        isProvinceCustom: undefined,
        status: undefined,
        pcode: undefined
      },
      columns: {
        props: [
          {
            name: "投诉现象编码",
            key: "phenomCode",
            width: '100'
          },
          {
            name: "投诉现象名称",
            key: "phenomName",
            width: '100'
          },
          {
            name: "是否省自定义",
            key: "isProvinceCustom",
            width: '100'
          },
          {
            name: "省份",
            key: "provinceName",
          },
          {
            name: "状态",
            key: "status",
          },
          {
            name: "更新人",
            key: "updatedBy",
          },
          {
            name: "更新时间",
            key: "updatedTime",
            width: '160'
          },
          {
            name: "节点层级链",
            key: "phenomChain",
            width: '180'
          }
        ],
        options: {
          btns: [
            // {
            //   label: "新增",
            //   key: "add",
            //   type: "success",
            //   permission: ['config:phenom:add'],
            //   autoHidden: ({row}) => {
            //     return row.level === 2 && row.isProvinceCustom === 1
            //   },
            //   event: this.handleAdd,
            // },
            {
              label: "修改",
              key: "edit",
              permission: ['config:phenom:update'],
              autoHidden: ({row}) => {
                return row.level === 3 && row.isProvinceCustom === 1
              },
              event: this.handleUpdate,
            },
            {
              label: "详情",
              key: "detail",
              type: "success",
              permission: ['config:phenom:detailList'],
              event: this.handleDetail,
              autoHidden: ({row}) => {
                return row.isProvinceCustom === 1
              },
            },
            {
              label: "更多",
              key: "more",
              permission: ['config:phenom:update'],
              children: [
                {
                  label: "删除",
                  key: "del",
                  type: "danger",
                  permission: ['config:phenom:update'],
                  autoHidden: ({row}) => {
                    return row.level === 3 && row.isProvinceCustom === 1
                  },
                  event: this.handleDelete,
                },
                {
                  label: "启用",
                  key: "start",
                  type: "primary",
                  permission: ['config:phenom:update'],
                  autoHidden: this.autoStartHidden,
                  event: this.handleStart,
                },
                {
                  label: "停用",
                  key: "end",
                  type: "danger",
                  permission: ['config:phenom:update'],
                  autoHidden: this.autoEndHidden,
                  event: this.handleEnd,
                },
              ]
            },
          ],
        },
      },
      // 表单校验
      rules: {
        phenomName: [
          {required: true, message: "投诉现象名称不能为空", trigger: "blur"},
          {
            min: 1,
            max: 20,
            message: "投诉现象名称长度必须介于 1 和 20 之间",
            trigger: "blur",
          },
        ],
        status: [
          {required: true, message: "用户状态不能为空", trigger: "change"},
        ],
      },
    };
  },
  watch: {
    // 根据名称筛选机构树
    treePhenomName(val) {
      this.$refs.tree.filter(val);
    },
  },
  computed: {
    detailDisabled() {
      return this.title === '详情' ? true : false
    }
  },
  created() {
    this.getList();
    this.getComplaintPhenomenonTree();
  },
  methods: {
    //停用启用
    autoStartHidden(val) {
      if (val.row) {
        return (val.row.status == "0" ? true : false) && val.row.isProvinceCustom == 1;
      } else {
        return false;
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return (val.row.status == "1" ? true : false) && val.row.isProvinceCustom == 1;
      } else {
        return false;
      }
    },
    //启用
    handleStart(row) {
      this.$$Dialog
          .confirm('是否确认启用投诉现象编码为"' + row.phenomCode + '"的数据项？')
          .then(() => {
            let data = {
              phenomId: row.phenomId,
              status: 1
            };
            return this.$$api.complaintPhenomenon.updateComplaintPhenomenon({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("启用成功");
          })
          .catch(() => {
          });
    },
    //停用
    handleEnd(row) {
      this.$$Dialog
          .confirm('是否确认停用投诉现象编码为"' + row.phenomCode + '"的数据项？')
          .then(() => {
            let data = {
              phenomId: row.phenomId,
              status: 0
            };
            return this.$$api.complaintPhenomenon.updateComplaintPhenomenon({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("停用成功");
          })
          .catch(() => {
          });
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      this.$$api.complaintPhenomenon
          .listComplaintPhenomenon({
            params: this.$$addDateRange(this.queryParams, this.dateRange),
          })
          .then(({res: response, err}) => {
            if (err) return;
            this.dataSource = response.phenomList;
            this.total = response.totalSize;
            this.loading = false;
          });
    },
    /** 查询投诉现象树形列表 */
    getComplaintPhenomenonTree() {
      this.$$api.complaintPhenomenon
          .listComplaintPhenomenonTree({params: {phenomName: this.phenomName}}).then(({res: response, err}) => {
        if (err) return;
        this.complaintPhenomenonTreeOptions = [{
          phenomCode: '0',
          phenomName: '投诉现象',
          phenomList: response.phenomList
        }]
      }).catch((error) => {
      });
    },
    // 树权限（展开/折叠）
    handleCheckedTreeExpand() {
      console.log(this.$refs.tree)
      this.isExpend = !this.isExpend;
      this.$$treeExpandOrCollapse(this.$refs.tree, this.isExpend);
    },
    //递归树形数据查询对应的上级元素
    findAncestors(node, targetId, idKey, nameKey, childName, ancestors = []) {
      // 如果找到了目标节点，则返回祖先列表（逆序）
      if (node[idKey] === targetId) {
        return ancestors.reverse().map(anc => ({[idKey]: anc[idKey], [nameKey]: anc[nameKey]}));
      }
      // 将当前节点添加到祖先列表中
      ancestors.push({[idKey]: node[idKey], [nameKey]: node[nameKey]});
      // 如果当前节点有子节点，则递归查找
      if (node[childName] && node[childName].length > 0) {
        for (let childNode of node[childName]) {
          let result = this.findAncestors(childNode, targetId, idKey, nameKey, childName, ancestors.slice());
          if (result.length > 0) {
            return result;
          }
        }
      }
      return [];
    },
    findAncestorsInMultipleTrees(trees, targetId, idKey, nameKey, childName) {
      for (let tree of trees) {
        let result = this.findAncestors(tree, targetId, idKey, nameKey, childName);
        if (result.length > 0) {
          // 如果在任何一棵树中找到了目标节点的祖先，就返回这些祖先
          return result;
        }
      }
      // 如果没有在任何树中找到目标节点，则返回空数组
      return [];
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) {
        this.isExpend = true;
        this.$$treeExpandOrCollapse(this.$refs.tree, this.isExpend);
        return true;
      }
      this.isExpend = true;
      return data.phenomName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node) {
      this.isAllowAdd = data.level == 2 && data.phenomName == '省自定'
      this.currentNodeData = data
      if (node.childNodes.length <= 0) return this.dataSource = []
      this.queryParams.pcode = data.phenomCode
      this.handleQuery();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        isProvinceCustom: undefined,
        phenomName: undefined,
        userId: undefined
      };
      this.$refs["form"]?.resetFields();
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.$refs["queryForm"]?.resetFields();
      this.queryParams.pcode = undefined;
      this.$refs.tree.setCurrentKey(null);
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.selectRow = selection[0]
      this.multiple = !selection.length
      this.single = selection.length != 1;
      this.isAllowDelet = !this.single && (selection[0]?.level === 3 && selection[0]?.isProvinceCustom === 1) ? false : true
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.title = "新增";
      this.$$api.complaintPhenomenon
          .getComplaintPhenomenonCode({params: {pcode: this.currentNodeData.phenomCode}}).then(({res: response, err}) => {
        if (err) return;
        const treeData = this.findAncestorsInMultipleTrees(this.complaintPhenomenonTreeOptions, this.currentNodeData.phenomCode, 'phenomCode', 'phenomName', 'phenomList')
        const formData = {
          phenomCode: response.phenomCode,
          isProvinceCustom: '1',
          secondPhenomCode: this.currentNodeData.phenomCode,
          secondPhenomName: this.currentNodeData.phenomName,
          firstPhenomCode: treeData[0].phenomCode,
          firstPhenomName: treeData[0].phenomName
        }
        this.form = formData
        this.open = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const treeData = this.findAncestorsInMultipleTrees(this.complaintPhenomenonTreeOptions, row.phenomCode, 'phenomCode', 'phenomName', 'phenomList')
      const formData = {
        phenomCode: row.phenomCode,
        phenomName: row.phenomName,
        userId: row.phenomId,
        status: row.status,
        isProvinceCustom: `${row.isProvinceCustom}`,
        firstPhenomCode: treeData[1].phenomCode,
        firstPhenomName: treeData[1].phenomName,
        secondPhenomCode: treeData[0].phenomCode,
        secondPhenomName: treeData[0].phenomName
      }
      this.form = formData
      this.open = true;
      this.title = "修改";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            this.$$api.complaintPhenomenon
                .updateComplaintPhenomenon({
                  data: {
                    phenomId: this.form.userId,
                    phenomName: this.form.phenomName,
                  }
                })
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                  this.getComplaintPhenomenonTree();
                });
          } else {
            this.$$api.complaintPhenomenon
                .addComplaintPhenomenon({
                  data: {
                    pcode: this.form.secondPhenomCode,
                    phenomName: this.form.phenomName,
                    phenomCode: this.form.phenomCode
                  }
                })
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("新增成功");
                  this.open = false;
                  this.getList();
                  this.getComplaintPhenomenonTree();
                });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row?.phenomId;
      this.$$Dialog
          .confirm('是否确认删除投诉现象编码为"' + row.phenomCode + '"的数据项？')
          .then(() => {
            return this.$$api.complaintPhenomenon.updateComplaintPhenomenon({data: {phenomId: userIds, status: 2}});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.getComplaintPhenomenonTree();
            this.$$Toast.success("删除成功");
          })
          .catch(() => {
          });
    },
    //详情按钮
    handleDetail(row) {
      this.reset();
      const treeData = this.findAncestorsInMultipleTrees(this.complaintPhenomenonTreeOptions, row.phenomCode, 'phenomCode', 'phenomName', 'phenomList')
      const formData = {
        phenomCode: row.phenomCode,
        phenomName: row.phenomName,
        userId: row.phenomId,
        status: row.status,
        isProvinceCustom: `${row.isProvinceCustom}`,
        firstPhenomCode: treeData[1].phenomCode,
        firstPhenomName: treeData[1].phenomName,
        secondPhenomCode: treeData[0].phenomCode,
        secondPhenomName: treeData[0].phenomName
      }
      this.form = formData
      this.open = true;
      this.title = "详情";
    }
  },
};
</script>
<style scoped lang="scss">
.nodeTree {
  overflow: scroll;
  //height: 74vh;
}

::v-deep .component {
  display: flex;
  align-items: center;
}
</style>
