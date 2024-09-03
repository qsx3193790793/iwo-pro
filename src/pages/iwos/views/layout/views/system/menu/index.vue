<template>
  <div class="app-container one-screen">
    <el-form class="one-screen-fg0" :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch">
      <el-form-item label="菜单名称" prop="menuName">
        <el-input
            v-model="queryParams.menuName"
            placeholder="请输入菜单名称"
            clearable
            @keyup.enter.native="handleQuery"
            maxlength="30"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" placeholder="菜单状态" clearable>
          <el-option
              v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_normal_disable')"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button size="small" @click="resetQuery">重置</el-button>
        <el-button type="primary" size="small" @click="handleQuery">查询</el-button>
        <el-button
            type="success"
            size="small"
            @click="handleAdd"
            v-hasPermission="['system:menu:add']"
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

    <!-- <el-row :gutter="10" class="mb8 one-screen-fg0">
      <el-col :span="1.5">

      </el-col>
      <el-col :span="1.5">

      </el-col>
    </el-row> -->

    <el-table
        v-if="refreshTable"
        v-loading="loading"
        class="one-screen-fg1"
        height="100%"
        ref="table"
        :data="menuList"
        row-key="menuId"
        :default-expand-all="isExpandAll"
        :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
        border
    >
      <el-table-column prop="menuName" label="菜单名称" :show-overflow-tooltip="true" width="260"></el-table-column>
      <el-table-column prop="icon" label="图标" align="center" width="100">
        <template slot-scope="scope">
          <i class="iconfont" :class="scope.row.icon"></i>
          <!--          <svg-icon :icon-class="scope.row.icon" />-->
        </template>
      </el-table-column>
      <el-table-column prop="orderNum" label="排序" width="60"></el-table-column>
      <el-table-column prop="perms" label="权限标识" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="component" label="组件路径" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="status" label="状态" width="80">
        <template slot-scope="{row}">
          <!--          <dict-tag :options="$$dictionaries.get('sys_normal_disable')" :value="scope.row.status"/>-->
          {{ $store.getters['dictionaries/MATCH_LABEL']('sys_normal_disable', row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ $$dateFormatterYMDHMS(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="220" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
              size="small"
              type="primary"
              @click="handleUpdate(scope.row)"
              v-hasPermission="['system:menu:edit']"
          >修改
          </el-button>
          <el-button
              size="small"
              type="success"
              @click="handleAdd(scope.row)"
              v-hasPermission="['system:menu:add']"
          >新增
          </el-button>
          <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row)"
              v-hasPermission="['system:menu:remove']"
          >删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加或修改菜单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="680px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px" label-position="left">
        <el-row>
          <el-col :span="24">
            <el-form-item label="上级菜单" prop="parentId">
              <treeselect
                  v-model="form.parentId"
                  :options="menuOptions"
                  :normalizer="normalizer"
                  noOptionsText="暂无数据"
                  :show-count="true"
                  placeholder="选择上级菜单"
              />
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item label="菜单类型" prop="menuType">
              <el-radio-group v-model="form.menuType">
                <el-radio label="M">目录</el-radio>
                <el-radio label="C">菜单</el-radio>
                <el-radio label="F">按钮</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-if="form.menuType != 'F'">
            <el-form-item label="菜单图标" prop="icon">
              <el-select v-model="form.icon" clearable>
                <el-option v-for="vv in iconfontJson" :key="vv.value" :label="vv.label" :value="vv.value" :disabled="vv.disabled">
                  <i class="iconfont" :class="vv.value"></i>
                  <span>{{ vv.label }}</span>
                </el-option>
              </el-select>

              <!--              <el-popover-->
              <!--                placement="bottom-start"-->
              <!--                width="460"-->
              <!--                trigger="click"-->
              <!--                @show="$refs['iconSelect'].reset()"-->
              <!--              >-->
              <!--                <IconSelect ref="iconSelect" @selected="selected" :active-icon="form.icon" />-->
              <!--                <el-input slot="reference" v-model="form.icon" placeholder="点击选择图标" readonly>-->
              <!--                  <svg-icon-->
              <!--                    v-if="form.icon"-->
              <!--                    slot="prefix"-->
              <!--                    :icon-class="form.icon"-->
              <!--                    style="width: 25px;"-->
              <!--                  />-->
              <!--                  <i v-else slot="prefix" class="el-icon-search el-input__icon" />-->
              <!--                </el-input>-->
              <!--              </el-popover>-->
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="菜单名称" prop="menuName">
              <el-input v-model="form.menuName" placeholder="请输入菜单名称" maxlength="30"/>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="显示排序" prop="orderNum">
              <el-input-number v-model="form.orderNum" controls-position="right" :min="0"/>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="isFrame">
              <span slot="label">
                <el-tooltip content="选择是外链则路由地址需要以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                是否外链
              </span>
              <el-radio-group v-model="form.isFrame">
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="form.menuType != 'F'">
            <el-form-item prop="path">
              <span slot="label">
                <el-tooltip content="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                路由地址
              </span>
              <el-input v-model="form.path" placeholder="请输入路由地址" maxlength="30"/>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12" v-if="form.menuType == 'C'">-->
          <!--            <el-form-item prop="component">-->
          <!--              <span slot="label">-->
          <!--                <el-tooltip content="访问的组件路径，如：`system/user/index`，默认在`views`目录下" placement="top">-->
          <!--                <i class="el-icon-question"></i>-->
          <!--                </el-tooltip>-->
          <!--                组件路径-->
          <!--              </span>-->
          <!--              <el-input v-model="form.component" placeholder="请输入组件路径"/>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12" v-if="form.menuType != 'M'">
            <el-form-item prop="perms">
              <el-input v-model="form.perms" placeholder="请输入权限标识" maxlength="100"/>
              <span slot="label">
                <el-tooltip content="控制器中定义的权限字符，如：@PreAuthorize(`@ss.hasPermission('system:user:list')`)" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                权限字符
              </span>
            </el-form-item>
          </el-col>
          <!--          <el-col :span="12" v-if="form.menuType == 'C'">-->
          <!--            <el-form-item prop="query">-->
          <!--              <el-input v-model="form.query" placeholder="请输入路由参数" maxlength="255"/>-->
          <!--              <span slot="label">-->
          <!--                <el-tooltip content='访问路由的默认传递参数，如：`{"id": 1, "name": "ry"}`' placement="top">-->
          <!--                <i class="el-icon-question"></i>-->
          <!--                </el-tooltip>-->
          <!--                路由参数-->
          <!--              </span>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12" v-if="form.menuType == 'C'">-->
          <!--            <el-form-item prop="isCache">-->
          <!--              <span slot="label">-->
          <!--                <el-tooltip content="选择是则会被`keep-alive`缓存，需要匹配组件的`name`和地址保持一致" placement="top">-->
          <!--                <i class="el-icon-question"></i>-->
          <!--                </el-tooltip>-->
          <!--                是否缓存-->
          <!--              </span>-->
          <!--              <el-radio-group v-model="form.isCache">-->
          <!--                <el-radio label="0">缓存</el-radio>-->
          <!--                <el-radio label="1">不缓存</el-radio>-->
          <!--              </el-radio-group>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <!--          <el-col :span="12" v-if="form.menuType != 'F'">-->
          <!--            <el-form-item prop="visible">-->
          <!--              <span slot="label">-->
          <!--                <el-tooltip content="选择隐藏则路由将不会出现在侧边栏，但仍然可以访问" placement="top">-->
          <!--                <i class="el-icon-question"></i>-->
          <!--                </el-tooltip>-->
          <!--                显示状态-->
          <!--              </span>-->
          <!--              <el-radio-group v-model="form.visible">-->
          <!--                <el-radio-->
          <!--                    v-for="dict in $store.getters['dictionaries/GET_DICT']('sys_show_hide')"-->
          <!--                    :key="dict.value"-->
          <!--                    :label="dict.value"-->
          <!--                >{{ dict.label }}-->
          <!--                </el-radio>-->
          <!--              </el-radio-group>-->
          <!--            </el-form-item>-->
          <!--          </el-col>-->
          <el-col :span="12">
            <el-form-item prop="status">
              <span slot="label">
                <el-tooltip content="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
                <i class="el-icon-question"></i>
                </el-tooltip>
                菜单状态
              </span>
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
import iconfontJson from '/public/static/css/iconfont/iconfont.json';

export default {
  name: "MenuIndex",
  dicts: ['sys_show_hide', 'sys_normal_disable'],
  components: {Treeselect},
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      menuList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        menuName: undefined,
        visible: undefined
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        menuName: [
          {required: true, message: "菜单名称不能为空", trigger: "blur"}
        ],
        orderNum: [
          {required: true, message: "菜单顺序不能为空", trigger: "blur"}
        ],
        path: [
          {required: true, message: "路由地址不能为空", trigger: "blur"}
        ]
      },
      iconfontJson: iconfontJson.glyphs.map(ic => ({
        label: `${iconfontJson.css_prefix_text}${ic.font_class}`, value: `${iconfontJson.css_prefix_text}${ic.font_class}`
      }))
    };
  },
  created() {
    this.getList();
    this.loading = false;
    // this.menuList = this.$$handleTree(dataRes.data, "menuId");
    this.$nextTick(() => this.$refs.table?.doLayout());

  },
  methods: {
    // 选择图标
    selected(name) {
      this.form.icon = name;
    },
    /** 查询菜单列表 */
    getList() {
      this.loading = true;
      this.$$api.menu.listMenu({params: this.queryParams}).then(({res: response, err}) => {
        console.log('response', response);
        if (err) return this.loading = false;
        this.menuList = this.$$handleTree(response.list, "menuId");
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.menuName,
        children: node.children
      };
    },
    /** 查询菜单下拉树结构 */
    getTreeselect() {
      this.$$api.menu.listMenu().then(({res: response, err}) => {
        if (err) return
        this.menuOptions = [];
        const menu = {menuId: 0, menuName: '主类目', children: []};
        menu.children = this.$$handleTree(response.list, "menuId");
        this.menuOptions.push(menu);
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        menuName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: '0',
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "1"
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
      this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.open = true;
      this.title = "添加菜单";
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
      this.getTreeselect();
      this.$$api.menu.getMenu({menuId: row.menuId}).then(({res: response, err}) => {
        if (err) return
        this.form = response;
        this.open = true;
        this.title = "修改菜单";
      });
    },
    /** 提交按钮 */
    submitForm: function () {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.menuId != undefined) {
            this.$$api.menu.updateMenu({data: Object.assign({}, this.form, {icon: this.form.icon || 'none'})}).then(({res: response, err}) => {
              if (err) return
              this.$$Toast.success("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.$$api.menu.addMenu({data: Object.assign({}, this.form, {icon: this.form.icon || 'none'})}).then(({res: response, err}) => {
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
      this.$$Dialog.confirm('是否确认删除名称为"' + row.menuName + '"的数据项？').then(() => {
        return this.$$api.menu.delMenu({menuId: row.menuId});
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
