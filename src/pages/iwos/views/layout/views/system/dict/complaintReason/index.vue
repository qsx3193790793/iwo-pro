<template>
  <div class="app-container one-screen">
    <div class="app-container-inner">
      <!--部门数据-->
      <div class="one-screen one-screen-fg0" style="width: 260px;margin-right: 16px;">
        <div class="head-container one-screen-fg0">
          <el-input
              v-model="treeReasonName"
              placeholder="请输入原因名称"
              clearable
              size="small"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container nodeTree one-screen-fg1">
          <el-tree :data="complaintReasonTreeOptions" :props="defaultProps" :expand-on-click-node="false" :filter-node-method="filterNode" ref="tree" node-key="id" default-expand-all highlight-current @node-click="handleNodeClick"/>
        </div>
      </div>
      <!--用户数据-->
      <div class="one-screen one-screen-fg1">
        <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="auto">
          <el-form-item label="投诉原因编码" prop="reasonCode">
            <el-input
                v-model="queryParams.reasonCode"
                placeholder="请输入投诉原因编码"
                clearable
                style="width: 240px"
                @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="投诉原因名称" prop="reasonName">
            <el-input
                v-model="queryParams.reasonName"
                placeholder="请输入投诉原因名称"
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
                placeholder="请选择状态"
                clearable
                style="width: 240px"
            >
              <el-option
                  v-for="dict in $store.getters['dictionaries/GET_DICT']('reason_status_name')"
                  v-bind="dict"
                  :key="dict.value"
              />
              <!-- <el-option
               v-for="dict in [{value:1,label:'是'},{value:0,label:'否'}]"
               v-bind="dict"
               :key="dict.value"
             /> -->
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button
                type="primary"

                size="mini"
                @click="handleQuery"
            >搜索
            </el-button
            >
            <el-button size="mini" @click="resetQuery"
            >重置
            </el-button
            >
          </el-form-item>
        </el-form>
        <JsTable class="one-screen-fg1" :dataSource="dataSource" :columns="columns" @selectionChange="handleSelectionChange">
          <template #isProvinceCustom="{row}">
            {{ $store.getters['dictionaries/MATCH_LABEL']('yes_no', row.isProvinceCustom) }}
          </template>
          <template #status="{row}">
            <el-tag :type="row.status == 0?'danger':''">
              {{ $store.getters['dictionaries/MATCH_LABEL']('reason_status_name', row.status) }}
            </el-tag>
          </template>
        </JsTable>
        <el-pagination class="one-screen-fg0" :current-page.sync="queryParams.pageNum" :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40, 50]" background layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList" @current-change="getList"/>
      </div>
    </div>

    <!-- 添加或修改用户配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="120px" label-position='left'>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉原因一级名称">
              <el-input
                  v-model="form.firstReasonName"
                  placeholder="请输入"
                  maxlength="30"
                  disabled
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉原因一级编码">
              <el-input
                  v-model="form.firstReasonCode"
                  placeholder="请输入"
                  maxlength="30"
                  disabled
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉原因二级名称">
              <el-input
                  v-model="form.secondReasonName"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉原因二级编码">
              <el-input
                  v-model="form.secondReasonCode"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉原因三级名称">
              <el-input
                  v-model="form.thirdReasonName"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉原因三级编码">
              <el-input
                  v-model="form.thirdReasonCode"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20" v-if="showForthItem">
          <el-col :span="12">
            <el-form-item label="投诉原因四级名称">
              <el-input
                  v-model="form.fourthReasonName"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉原因四级编码">
              <el-input
                  v-model="form.fourthReasonCode"
                  placeholder="请输入"
                  disabled
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="投诉原因名称" prop='reasonName'>
              <el-input
                  :disabled="detailDisabled"
                  v-model="form.reasonName"
                  placeholder="请输入"
                  maxlength="30"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="投诉原因编码">
              <el-input
                  v-model="form.reasonCode"
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
  name: "complaintReason",
  cusDicts: ["reason_status_name", "yes_no"],
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
      isAllowAdd: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 用户表格数据
      dataSource: null,
      // 弹出层标题
      title: "",
      //投诉原因树形列表
      complaintReasonTreeOptions: undefined,
      // 部门树选项
      deptOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      deptName: undefined,
      // 默认密码
      initPassword: "123456",
      // 日期范围
      dateRange: [],
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      //上级投诉编码
      superiorCode: undefined,
      //原因列表关键字查询
      treeReasonName: undefined,
      //是否展示五级原因
      showForthItem: true,
      // 表单参数
      form: {},
      defaultProps: {
        children: "reasonList",
        label: "reasonName",
      },

      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
        reasonCode: undefined,
        reasonName: undefined,
        isProvinceCustom: undefined,
        status: undefined,
        pcode: undefined
      },
      columns: {
        selection: true,
        props: [
          {
            name: "投诉原因编码",
            key: "reasonCode",
          },
          {
            name: "投诉原因名称",
            key: "reasonName",
          },
          {
            name: "是否省自定义",
            key: "isProvinceCustom",
          },
          {
            name: "原因层级",
            key: "level",
          },
          {
            name: "上级原因",
            key: "reasonChain",
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
          },
        ],
        options: {
          btns: [
            {
              label: "新增",
              key: "add",
              type: "success",
              autoHidden: ({row}) => {
                return (row.level === 3 || row.level === 4) && row.isProvinceCustom === 1
              },
              event: this.handleAdd,
            },
            {
              label: "编辑",
              key: "edit",
              autoHidden: ({row}) => {
                return (row.level === 4 || row.level === 5) && row.isProvinceCustom === 1
              },
              event: this.handleUpdate,
            },
            {
              label: "更多",
              key: "more",
              children: [
                {
                  label: "删除",
                  key: "del",
                  type: "danger",
                  autoHidden: ({row}) => {
                    return (row.level === 4 || row.level === 5) && row.isProvinceCustom === 1
                  },
                  event: this.handleDelete,
                },
                {
                  label: "启用",
                  key: "start",
                  type: "primary",
                  autoHidden: this.autoStartHidden,
                  event: this.handleStart,
                },
                {
                  label: "停用",
                  key: "end",
                  type: "danger",
                  autoHidden: this.autoEndHidden,
                  event: this.handleEnd,
                },
                {
                  label: "详情",
                  key: "detail",
                  autoHidden: ({row}) => {
                    return (row.level === 4 || row.level === 5) && row.isProvinceCustom === 1
                  },
                  event: this.handleDetail,
                },
              ]
            },
          ],
        },
      },
      dataSource: [],
      // 表单校验
      rules: {
        reasonName: [
          {required: true, message: "投诉原因名称不能为空", trigger: "blur"},
          {
            min: 1,
            max: 30,
            message: "投诉原因名称长度必须介于 1 和 30 之间",
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
    // 根据名称筛选部门树
    treeReasonName(val) {
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
    this.getComplaintReasonTree();
  },
  methods: {
    autoStartHidden(val) {
      if (val.row) {
        return (val.row.status == "0" ? true : false) && val.row.isProvinceCustom === 1;
      } else {
        return false;
      }
    },
    autoEndHidden(val) {
      if (val.row) {
        return (val.row.status == "1" ? true : false) && val.row.isProvinceCustom === 1;
      } else {
        return false;
      }
    },
    //启用
    handleStart(row) {
      this.$$Dialog
          .confirm('是否确认启用投诉原因名称为"' + row.reasonName + '"的数据项？')
          .then(() => {
            let data = {
              reasonId: row.reasonId,
              status: 1
            };
            return this.$$api.complaintReason.updateComplaintReason({data: data});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.$$Toast.success("启动成功");
          })
          .catch(() => {
          });
    },
    //停用
    handleEnd(row) {
      this.$$Dialog
          .confirm('是否确认停用用投诉原因名称为"' + row.reasonName + '"的数据项？')
          .then(() => {
            let data = {
              reasonId: row.reasonId,
              status: 0
            };
            return this.$$api.complaintreasonenon.updateComplaintReason({data: data});
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
      this.$$api.complaintReason
          .listComplaintReason({
            params: this.$$addDateRange(this.queryParams, this.dateRange),
          })
          .then(({res: response, err}) => {
            if (err) return;
            this.dataSource = response.reasonList;
            this.total = response.totalSize;
            this.loading = false;
          });
    },
    /** 查询投诉原因树形列表 */
    getComplaintReasonTree() {
      this.$$api.complaintReason
          .listComplaintReasonTree({params: {reasonName: this.reasonName}}).then(({res: response, err}) => {
        if (err) return;
        this.complaintReasonTreeOptions = [{
          reasonCode: '0',
          reasonName: '投诉原因',
          reasonList: response.reasonList
        }]
      }).catch((error) => {
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.reasonName.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data, node) {
      if (node.childNodes.length <= 0) return this.dataSource = []
      this.queryParams.pcode = data.reasonCode
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
        reasonName: undefined,
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
      this.single = selection.length != 1;
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
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      this.title = "新增投诉原因";
      this.showForthItem = row.level === 3 ? false : true
      this.superiorCode = row.reasonCode
      this.$$api.complaintReason
          .getComplaintReasonCode({params: {pcode: row.reasonCode}}).then(({res: response, err}) => {
        if (err) return;
        const treeData = this.findAncestorsInMultipleTrees(this.complaintReasonTreeOptions, row.reasonCode, 'reasonCode', 'reasonName', 'reasonList')
        if (row.level === 3) {
          const formData = {
            reasonCode: response.reasonCode,
            isProvinceCustom: '1',
            firstReasonCode: treeData[1].reasonCode,
            firstReasonName: treeData[1].reasonName,
            secondReasonCode: treeData[0].reasonCode,
            secondReasonName: treeData[0].reasonName,
            thirdReasonCode: row.reasonCode,
            thirdReasonName: row.reasonName,
          }
          this.form = formData
        } else if (row.level === 4) {
          const formData = {
            reasonCode: response.reasonCode,
            isProvinceCustom: '1',
            firstReasonCode: treeData[2].reasonCode,
            firstReasonName: treeData[2].reasonName,
            secondReasonCode: treeData[1].reasonCode,
            secondReasonName: treeData[1].reasonName,
            thirdReasonCode: treeData[0].reasonCode,
            thirdReasonName: treeData[0].reasonName,
            fourthReasonCode: row.reasonCode,
            fourthReasonName: row.reasonName,
          }
          this.form = formData
        }
        this.open = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.showForthItem = row.level === 4 ? false : true
      const treeData = this.findAncestorsInMultipleTrees(this.complaintReasonTreeOptions, row.reasonCode, 'reasonCode', 'reasonName', 'reasonList')
      if (row.level === 4) {
        const formData = {
          reasonCode: row.reasonCode,
          reasonName: row.reasonName,
          userId: row.reasonId,
          status: row.status,
          isProvinceCustom: '1',
          firstReasonCode: treeData[2].reasonCode,
          firstReasonName: treeData[2].reasonName,
          secondReasonCode: treeData[1].reasonCode,
          secondReasonName: treeData[1].reasonName,
          thirdReasonCode: treeData[0].reasonCode,
          thirdReasonName: treeData[0].reasonName,
        }
        this.form = formData
      } else if (row.level === 5) {
        const formData = {
          reasonCode: row.reasonCode,
          reasonName: row.reasonName,
          userId: row.reasonId,
          status: row.status,
          isProvinceCustom: '1',
          firstReasonCode: treeData[3].reasonCode,
          firstReasonName: treeData[3].reasonName,
          secondReasonCode: treeData[2].reasonCode,
          secondReasonName: treeData[2].reasonName,
          thirdReasonCode: treeData[1].reasonCode,
          thirdReasonName: treeData[1].reasonName,
          fourthReasonCode: treeData[0].reasonCode,
          fourthReasonName: treeData[0].reasonName,
        }
        this.form = formData
      }
      this.open = true;
      this.title = "修改";
    },
    handleDetail(row) {
      this.reset();
      this.showForthItem = row.level === 4 ? false : true
      const treeData = this.findAncestorsInMultipleTrees(this.complaintReasonTreeOptions, row.reasonCode, 'reasonCode', 'reasonName', 'reasonList')
      if (row.level === 4) {
        const formData = {
          reasonCode: row.reasonCode,
          reasonName: row.reasonName,
          userId: row.reasonId,
          status: row.status,
          isProvinceCustom: '1',
          firstReasonCode: treeData[2].reasonCode,
          firstReasonName: treeData[2].reasonName,
          secondReasonCode: treeData[1].reasonCode,
          secondReasonName: treeData[1].reasonName,
          thirdReasonCode: treeData[0].reasonCode,
          thirdReasonName: treeData[0].reasonName,
        }
        this.form = formData
      } else if (row.level === 5) {
        const formData = {
          reasonCode: row.reasonCode,
          reasonName: row.reasonName,
          userId: row.reasonId,
          status: row.status,
          isProvinceCustom: '1',
          firstReasonCode: treeData[3].reasonCode,
          firstReasonName: treeData[3].reasonName,
          secondReasonCode: treeData[2].reasonCode,
          secondReasonName: treeData[2].reasonName,
          thirdReasonCode: treeData[1].reasonCode,
          thirdReasonName: treeData[1].reasonName,
          fourthReasonCode: treeData[0].reasonCode,
          fourthReasonName: treeData[0].reasonName,
        }
        this.form = formData
      }
      this.open = true;
      this.title = "详情";
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate((valid) => {
        if (valid) {
          if (this.form.userId != undefined) {
            this.$$api.complaintReason
                .updateComplaintReason({
                  data: {
                    reasonId: this.form.userId,
                    reasonName: this.form.reasonName,
                    status: this.form.status
                  }
                })
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("修改成功");
                  this.open = false;
                  this.getList();
                  this.getComplaintReasonTree();
                });
          } else {
            this.$$api.complaintReason
                .addComplaintReason({
                  data: {
                    pcode: this.superiorCode,
                    reasonName: this.form.reasonName,
                    reasonCode: this.form.reasonCode
                  }
                })
                .then(({res, err}) => {
                  if (err) return;
                  this.$$Toast.success("新增成功");
                  this.open = false;
                  this.getList();
                  this.getComplaintReasonTree();
                });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const userIds = row.reasonId;
      this.$$Dialog
          .confirm('是否确认删除投诉原因编码为"' + row.reasonCode + '"的数据项？')
          .then(() => {
            return this.$$api.complaintReason.delComplaintReason({params: {reasonId: userIds}});
          })
          .then(({res, err}) => {
            if (err) return;
            this.getList();
            this.getComplaintReasonTree();
            this.$$Toast.success("删除成功");
          })
          .catch(() => {
          });
    },
  },
};
</script>
<style scoped>
.nodeTree {
  overflow: scroll;
  height: 74vh;
}

::v-deep .component {
  display: flex;
  align-items: center;
}
</style>
