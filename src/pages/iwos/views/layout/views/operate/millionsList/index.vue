<template>
  <div class="one-screen">
    <PageSearchPanel ref="PageSearchPanelRef" :formConfigItems="formConfigItems"></PageSearchPanel>

    <template v-if="list.length">
      <div class="table-panel one-screen-fg1">
        <JsTable :dataSource="list" :columns="columns">
          <template #year="scope">
            {{ scope.row.year }}-{{ scope.row.quarter }}
          </template>
        </JsTable>
        <div class="pagination-area">
          <el-pagination :current-page.sync="pageInfo.pageNum" :page-size.sync="pageInfo.pageSize"
                         :page-sizes="[15, 30, 40, 50]" background layout=" ->,total, sizes, prev, pager, next, jumper"
                         :total="pageInfo.rowCount" @size-change="getList(1)" @current-change="getList"/>
        </div>
      </div>
    </template>
    <MDialog v-model="state.isShowAddDialog" ref="MDialogRef" width="40%" top="10vh" height="30vh" :title="`${addType === 'add' ? '新增' : '编辑'}地域百万用户数`" @close="isShowImportDialog(false)">
      <div class="dialog-box">
        <el-form ref="FormRef" :model="state.form" :rules="state.rules" label-width="auto">
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="地域" prop="providerCode">
                <!-- <el-input v-model="state.form.providerCode" placeholder="请输入"
                  maxlength="50"></el-input> -->
                <el-cascader clearable v-if="addType === 'add'" v-model="state.form.providerCode"
                             :props="props"></el-cascader>
                <template v-else>
                  {{ state.form.providerCode }}
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="年度-季度" prop="quarter">
                <template v-if="addType === 'add'">

                  <el-select v-model="state.form.year" placeholder="请选择">
                    <el-option v-for="item in options1" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                  <el-select :disabled="!state.form.year" v-model="state.form.quarter" placeholder="请选择"
                             style="margin-left:10px">
                    <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                  </el-select>
                </template>
                <template v-else>
                  {{ state.form.year }}-{{ getQuarterName(state.form.quarter) }}
                </template>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24">
              <el-form-item label="用户数" prop="userNum">
                <el-input v-model="state.form.userNum" placeholder="请输入用户数" maxlength="50"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

      </div>
      <template #footer>
        <el-button type="primary" plain @click="submitForm">提交</el-button>
        <el-button plain @click="isShowImportDialog(false)">关闭</el-button>
      </template>
    </MDialog>
  </div>
</template>

<script setup>
import MDialog from '@/components/MDialog';
import {getCurrentInstance, ref, onBeforeMount, onMounted, onActivated} from "vue";
import PageSearchPanel from "@/pages/iwos/components/PageSearchPanel.vue";
import JsTable from "@/components/js-table/index.vue";

const {proxy} = getCurrentInstance();
const isShowImportDialog = (bl = true) => {//新增编辑弹窗

  if (!bl) {
    state.value.form = {
      providerCode: "",
      quarter: '',
      year: '',
      userNum: ''

    }
  }
  state.value.isShowAddDialog = bl
  // isShowAddDialog.value = bl
}
const props = {
  checkStrictly: !0,
  lazy: true,
  lazyLoad(node, resolve) {
    const {level} = node;
    proxy.$$api.millionsUsers.getArea({params: {code: node.value}}).then(res => {
      const nodes = proxy.$$formatCascaderTree(
          res.res?.list || [],
          "name",
          "code",
          "children"
      )
      const data = nodes.map(item => {
        return {
          leaf: level >= 2,
          ...item
        }
      })
      resolve(data);
    })
  }
}
const repick = () => {
  state.value.searchForm.diyu = ''
}
const addType = ref('add')
const options1 = ref([])
const options2 = [{
  value: '1',
  label: '第一季度'
}, {
  value: '2',
  label: '第二季度'
}, {
  value: '3',
  label: '第三季度'
}, {
  value: '4',
  label: '第四季度'
}]
const getQuarterName = (val) => {
  return options2.filter(res => {
    return res.value == val
  })[0].label
}
const generateYears = () => {
  let years = []
  const currentYear = new Date().getFullYear();
  for (let i = 0; i < 5; i++) {
    years.push({
      value: currentYear - i,
      label: currentYear - i
    });
  }

  options1.value = years
}
const FormRef = ref();
const submitForm = () => {
  FormRef.value.validate((valid) => {
    if (valid) {

      const {providerCode, year, quarter, userNum} = state.value.form;
      const [providerCode1, cityCode, townCode] = providerCode || [];

      let formData = {}
      let url = ''
      if (addType.value === 'add') {
        url = 'insertUserNumber'
        formData = {
          providerCode: providerCode1 || '',
          cityCode: cityCode || '',
          townCode: townCode || '',
          year,
          quarter,
          userNum
        };
      } else {
        url = 'updateUserNum'
        formData = {
          id: state.value.form.id || '',
          userNum
        }
      }

      proxy.$$api.millionsUsers[url]({data: formData}).then(({res, err}) => {
        proxy.$$Toast({message: `操作成功`, type: 'success'})
        getList(1)
        isShowImportDialog(false)
      })

    }
  });
};
let state = ref({
  isShowAddDialog: false,
  searchForm: {
    diyu: ''
  },
  form: {
    "providerCode": "", //省份编码
    "cityCode": "", //城市编码
    "townCode": "", //区编码
    "year": "", //年
    "quarter": "", //季度
    "userNum": "" //用户数
  },
  rules: {
    providerCode: [
      {required: true, message: "不能为空", trigger: "blur"},
    ],
    quarter: [
      {required: true, message: '请选择季度', trigger: 'change'}
    ],
    userNum: [
      {required: true, message: "请输入", trigger: "blur"},
    ],
  },
  dataSource: [],
});
const handleDelete = (row) => {
  proxy.$$Dialog.confirm(`是否确认删除该数据？`, '提示', {cancelButtonText: '取消', confirmButtonText: '确定',}).then(async () => {

    const {res, err} = await proxy.$$api.millionsUsers.deleteUserNum({params: {id: row.id}})

    if (err) return
    proxy.$$Toast({message: `操作成功`, type: 'success'});
    getList()

  }).catch(proxy.$$emptyFn)
}

const addList = () => {//新增
  addType.value = 'add'
  isShowImportDialog()
}
const handleEdit = (row) => {//编辑
  state.value.form = {
    id: row.id,
    providerCode: `${row.provinceName}${row.cityName ? '-' + row.cityName : ''}${row.townName ? '-' + row.townName : ''}`,
    quarter: row.quarter,
    year: row.year,
    userNum: row.userNum
  }
  addType.value = 'edit'
  isShowImportDialog()
}
const columns = ref({
  props: [
    // {
    //   name: "序号",
    //   key: "",
    // },
    {
      name: "省份",
      key: "provinceName",
    },
    {
      name: "城市",
      key: "cityName",
    },
    {
      name: "区县",
      key: "townName",
    },
    {
      name: "年度-季度",
      key: "year",
    },
    {
      name: "用户数",
      key: "userNum",
    },
    {
      name: "创建人",
      key: "createdBy",
    },
    {
      name: "创建时间",
      width: 160,
      key: "createdTime",
      el: "format",
      format: "default",
    },
  ],
  options: {
    btns: [
      {
        label: '编辑',
        key: 'edit',
        event: row => {
          addType.value = 'edit'
          handleEdit(row)
        },
      },
      {
        label: '删除',
        key: 'del',
        type: 'danger',
        event: row => {
          handleDelete(row)
        },
      },
    ],
  },
});

const PageSearchPanelRef = ref();
const pageInfo = ref({pageNum: 1, pageSize: 15, rowCount: 0});

const list = ref([]);

// 列表请求
const getList = async (pageNum = pageInfo.value.pageNum) => {

  pageInfo.value.pageNum = pageNum;
  let queryParams = PageSearchPanelRef.value.getFormData();
  const {providerCode} = queryParams
  const [providerCode1, cityCode, townCode] = providerCode || [];
  queryParams = {
    providerCode: providerCode1,
    cityCode: cityCode || '',
    townCode: townCode || '',
  }
  // 建单时间的取值
  let {res} = await proxy.$$api.millionsUsers.getUserNum({
    params: Object.assign(
        {
          pageNum: pageInfo.value.pageNum,
          pageSize: pageInfo.value.pageSize,
        },
        queryParams
    ),
  });
  if (res) {
    pageInfo.value.rowCount = Number(res?.total ?? pageInfo.value.rowCount);
    list.value = res.list;
  }
};

//查询条件 展开截取前7个+最后按钮组 保证按钮组在最后一个
const formConfigItems = ref([
  {
    name: "区县",
    key: "providerCode",
    value: "",
    col: 8,
    type: "cascader",
    options: () => {
      return areaTreeData
    },
    attrs: {
      props: props
    },
    isDisable: !1,
    isRequire: !1,
  },
  {col: 8, type: "divider-empty"},
  {
    type: "buttons",
    align: "right",
    verticalAlign: 'top',
    col: 8,
    items: [
      {
        btnName: "重置",
        type: "button",
        attrs: {type: ""},
        col: 1,
        onClick({vm}) {
          vm.resetFormData();
          getList(1);
        },
      },
      {
        btnName: "查询",
        type: "button",
        attrs: {type: "primary"},
        col: 1,
        onClick({vm}) {
          getList(1);
        },
      },
      {
        btnName: "新增",
        type: "button",
        attrs: {type: "success"},
        col: 1,
        onClick({vm}) {
          addType.value = 'add'
          isShowImportDialog()
        },
      },
    ],
  },
]);

let areaTreeData = []

async function getAreaTree(code) {
  proxy.$$api.millionsUsers.getArea({params: {code: code}}).then(res => {
    areaTreeData = proxy.$$formatCascaderTree(
        res.res?.list || [],
        "name",
        "code",
        "children"
    )
  })
}

onMounted(() => {
  // getAreaTree()
  generateYears()
  getList(1);

});

</script>

<script>
export default {
  name: "millionsList"
};
</script>
<style lang="scss" scoped>
::v-deep .el-cascader {
  width: 100%;
}

::v-deep .el-form-item__label {
  justify-content: flex-end;
}

.dialog-box {
  padding: 20px;
}

.btn-flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;

}
</style>
