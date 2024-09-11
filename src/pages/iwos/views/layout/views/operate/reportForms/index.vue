<template>
  <div class="one-screen war">
    <PageSearchPanel labelWidth="1.1rem" ref="PageSearchPanelRef" :formConfigItems="formConfigItems"
      style="margin-bottom: 0;"></PageSearchPanel>
    <div class="table-panel one-screen-fg0 tag-box">
      <div>
        <div style="display: flex;">
          <div class="tag-list">
            已选维度:
            <div>
              <el-tag class="tag-class" @close="handleCloseTag(item, 'wd')" closable v-for="(item, index) in wd"
                :key="index">{{ item.string }}</el-tag>
            </div>
          </div>
          <div class="tag-btn">
            <el-button type="primary" @click="selectTag">多维度选择</el-button>
            <el-button type="warning" @click="downloadFile">导出</el-button>
          </div>
        </div>
        <div class="tag-list">已选指标:
          <div>
            <el-tag closable @close="handleCloseTag(item, 'zb')" class="tag-class" size="medium"
              v-for="(item, index) in zb" :key="index">{{ item.label
              }}</el-tag>
          </div>
        </div>
      </div>

    </div>
    <div class="table-panel one-screen-fg1 r-list">
      <JsTable :dataSource="dataSource" :columns="columns"></JsTable>
      <el-pagination class="pagination-area" :current-page.sync="queryParams.pageNum"
        :page-size.sync="queryParams.pageSize" :page-sizes="[15, 30, 40, 50]" background
        layout=" ->,total, sizes, prev, pager, next, jumper" :total="total" @size-change="getList"
        @current-change="getList" />
    </div>
    <el-drawer title="多维度报表配置" :visible.sync="drawerModeld" :before-close="handleClose">
      <AddDialog v-if="drawerModeld" :wd="wd" :zb="zb" @submit="submit" />
    </el-drawer>
  </div>
</template>

<script>
import JsTable from "@/components/js-table/index.vue";
import PageSearchPanel from '@/pages/iwos/components/PageSearchPanel.vue';
import AddDialog from './components/AddDialog.vue';
import { custTypeData, userStarLevelData } from './components/tagMock'
export default {
  name: "Dict",
  dicts: ['start_stop'],
  components: { JsTable, PageSearchPanel, AddDialog },
  data() {
    const that = this
    let areaTreeData = []
    return {
      wd: [],//维度
      zb: [],//指标
      //右边弹窗
      drawerModeld: false,
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      columns: {
        props: [],
        options: false
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 15,
      },
      dataSource: [],
      formConfigItems: [
        {
          name: `地域`,
          key: 'province_code', value: '',
          col: 6,
          type: "cascader",
          options: () => { return areaTreeData },
          attrs: {
            props: {
              checkStrictly: !0,
              lazy: true,
              lazyLoad(node, resolve) {
                const { level } = node;
                that.$$api.millionsUsers.getArea({ params: { code: node.value } }).then(res => {
                  const nodes = that.$$formatCascaderTree(
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
          },
          isDisable: !1, isRequire: !1
        },
        {
          name: `时间`,
          labelType: true,
          key: 'startTime',
          labelData: {
            isDisable: false,
            key: 'timeType',
            value: '1',
            // timeType:'1',
            placeholder: '请选择',
            clearable: false,
            onChange: ({ vm, item }) => {
              that.timeType = item.labelData.value
            },
            list: [
              { value: '1', label: '建单时间' },
              { value: '2', label: '办结时间' },
              { value: '3', label: '归档时间' },
            ]
          },
          value: '',
          col: 6, type: 'dateRangePicker',
          options: () => [],
          isDisable: !1, isRequire: !1
        },
        {
          name: "投诉来源",
          key: "source_code_level",
          value: "",
          col: 6,
          type: "cascader",
          options: () => this.complaint_source_tree,
          attrs: { props: { checkStrictly: !0 } },
          isDisable: !1,
          isRequire: !1,
        },
        {
          name: `客户类型`,
          key: 'cust_type', value: '',
          col: 6, type: 'select',
          options: () => custTypeData,
          isDisable: !1, isRequire: !1
        },
        {
          name: `投诉现象`,
          key: 'complaint_phenomenon_level', value: '',
          col: 6, type: 'cascader',
          options: () => this.complaint_phenomenon_tree,
          isDisable: !1, isRequire: !1
        },
        {
          name: `投诉原因`,
          key: 'reason_level', value: '',
          col: 6, type: 'cascader',
          options: () => this.complaint_reason_tree,
          isDisable: !1, isRequire: !1
        },
        {
          name: `投诉产品`,
          key: 'product_level', value: '',
          col: 6, type: 'cascader',
          options: () => this.complaint_product_tree,
          isDisable: !1, isRequire: !1
        },
        {
          name: `用户星级`,
          key: 'user_star_level', value: '',
          col: 6, type: 'select',
          options: () => userStarLevelData,
          isDisable: !1, isRequire: !1
        },
        {
          key: '',
          value: '',
        },
        {
          key: '',
          value: '',
        },
        {
          type: "buttons",
          align: "right",
          verticalAlign: "top",
          col: 6,
          items: [
            {
              btnName: "重置",
              type: "button",
              attrs: { type: "" },
              col: 1,
              onClick: ({ vm }) => {
                vm.resetFormData();
                this.resetQuery();
              }
            },
            {
              btnName: "查询",
              type: "button",
              attrs: { type: "primary" },
              col: 1,
              onClick: ({ vm }) => {
                this.getList();
              },
            },
          ],
        },
      ],
      //投诉来源树
      complaint_source_tree: [],
      complaint_phenomenon_tree: [],
      complaint_reason_tree: [],
      complaint_product_tree: [],
      timeType: '1',
      timeGrouping: ''
    };
  },
  created() {
    this.$nextTick(() => this.$refs.table?.doLayout());
    this.columns.props = []
    this.listComplaintSourceTree()
    this.listComplaintPhenomenonTree()
    this.getComplaintReasonTree();
    this.listProductTree()
  },
  mounted() {
    // this.getList();
    // this.$refs.PageSearchPanelRef.initFormData({ timeType: '1' });
  },
  methods: {
    handleCloseTag(tag, str) {
      if (str === 'wd') {
        const index = this.wd.findIndex(item => item.id === tag.id);
        if (index !== -1) {
          this.wd.splice(index, 1);
        }
      } else {
        const index2 = this.zb.findIndex(item => item.id === tag.id);
        if (index2 !== -1) {
          this.zb.splice(index2, 1);
        }
      }

      this.setColumns()//更新列表
    },
    //产品
    listProductTree() {
      this.$$api.productClassification.listProductTree({ params: { status: 1 } }).then((res, err) => {
        if (err) return;
        this.complaint_product_tree = this.$$formatCascaderTree(
          res?.res.list || [],
          'productName', 'productCode', 'children'
        );
      })
    },
    /** 查询投诉原因树形列表 */
    getComplaintReasonTree() {
      this.$$api.complaintReason
        .listComplaintReasonTree().then(({ res, err }) => {

          if (err) return;
          this.complaint_reason_tree = this.$$formatCascaderTree(
            res.reasonList || [],
            'reasonName', 'reasonCode', 'reasonList'
          )
        })
    },
    //投诉现象
    listComplaintPhenomenonTree() {
      this.$$api.complaintPhenomenon
        .listComplaintPhenomenonTree({
          data: { status: 1 },
        })
        .then((res, err) => {
          if (err) return;
          this.complaint_phenomenon_tree = this.$$formatCascaderTree(
            res.res.phenomList || [],
            'phenomName', 'phenomCode', 'phenomList'
          );
        });
    },
    //投诉来源下拉菜单
    listComplaintSourceTree() {
      this.$$api.complaintSource
        .listComplaintSourceTree({
          data: { status: 1 },
        })
        .then((res, err) => {
          if (err) return;
          this.complaint_source_tree = this.$$formatCascaderTree(
            res?.res.list || [],
            "sourceName",
            "sourceCode",
            "children"
          );
        });
    },
    setColumns() {
      let arr = []
      this.timeGrouping = ''
      this.wd.forEach(element => {
        if (['1', '2', '3'].includes(element.id)) {
          this.timeGrouping = element.id
        }
        arr.push({
          name: element.string,
          key: element.id,
        })
      });
      this.zb.forEach(element => {
        arr.push({
          name: element.label,
          key: element.id,
        })
      });
      this.columns.props = arr

    },
    submit(obj) {
      this.wd = obj.wd
      this.zb = obj.zb
      this.setColumns()
      this.handleClose()
    },
    selectTag() {
      this.drawerModeld = true
    },
    handleClose() {
      this.drawerModeld = false
    },
    //级联用
    getListSearchForm(arr, key1, key2, key3) {
      if (!arr) return null
      const returnData = (val, label) => {
        return {
          "field": label, //名
          "value": val, //值 ,
          "compare": "="
        }
      }
      let data_ = []
      if (typeof arr === 'string') {
        if (arr) {
          data_.push(returnData(arr, key1))
        }
      } else {
        const [str1, str2, str3] = arr || [];

        if (str1) {
          data_.push(returnData(str1, key1))
        }
        if (str2) {
          data_.push(returnData(str2, key2))
        }
        if (str3) {
          data_.push(returnData(str3, key3))
        }
      }
      return data_
    },
    formValidate() {
      let flag = true
      const formData = this.$refs.PageSearchPanelRef.getFormData();
      if (!formData.startTime || !formData.startTime[0]) {
        this.$$Toast({ message: `必须选择时间`, type: 'warning' })
        flag = ''
        return flag
      }
      let selectItems_ = this.columns.props.map(item => {
        if (!['1', '2', '3'].includes(item.key)) {
          return item.key;
        }
      }).filter(Boolean)
      if (selectItems_.length < 1) {
        this.$$Toast({ message: `必须选择维度/指标`, type: 'warning' })
        flag = ''
        return flag
      }
      return flag
    },
    downloadFile() {
      if (!this.formValidate()) {
        return
      }
      this.$$api.millionsUsers
        .uploadMultiDimensional({ data: this.setSubData() })
        .then((res) => {
          const blob = new Blob([res.res.blob], { type: res.res.headers['content-type'] });
          // 创建一个链接元素用于下载
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = '文件名.xls'; // 指定下载的文件名

          // 触发下载
          link.click();

          // 清理
          setTimeout(() => {
            window.URL.revokeObjectURL(link.href);
            const existingLink = document.body.querySelector("a[href='" + link.href + "']");
            if (existingLink) {
              document.body.removeChild(existingLink);
            }
          }, 100); // 延迟100毫秒

        });
    },
    setSubData() {
      const formData = this.$refs.PageSearchPanelRef.getFormData();


      function mergeData(...data) {
        // 使用 filter 方法移除所有 null 值，然后使用 concat 方法合并所有数组
        return [].concat(...data.filter(item => item !== null));
      }


      let province_code = this.getListSearchForm(formData.province_code, 'province_name', 'city_name', 'town_name')
      let source_code_level = this.getListSearchForm(formData.source_code_level, 'source_code_level1_code', 'source_code_level2_code', "source_code_level3_code")
      let complaint_phenomenon_level = this.getListSearchForm(formData.complaint_phenomenon_level, 'complaint_phenomenon_level1_code', 'complaint_phenomenon_level2_code', "complaint_phenomenon_level3_code")
      let reason_level = this.getListSearchForm(formData.reason_level, 'reason_level1_code', 'reason_level2_code', 'reason_level3_code')
      let product_level = this.getListSearchForm(formData.product_level, 'product_level1_code', 'product_level2_code', 'product_level3_code')
      //字符串 下拉框
      let cust_type = this.getListSearchForm(formData.cust_type, 'cust_type')
      let user_star_level = this.getListSearchForm(formData.user_star_level, 'user_star_level')





      let selectParam_ = mergeData(province_code, source_code_level, complaint_phenomenon_level, reason_level, product_level, cust_type, user_star_level)



      let selectItems_ = this.columns.props.map(item => {
        if (!['1', '2', '3'].includes(item.key)) {
          return item.key;
        }
      }).filter(Boolean)

      let data = {//年月日不进连锁
        selectItems: selectItems_,
        selectParam: selectParam_,//筛选条件
        "timeDTO": {//建单时间
          "timeGrouping": this.timeGrouping || '',//时间分类，1为年，2为月,3为日
          "startTime": formData.startTime[0], //时间 必选
          "endTime": formData.startTime[1],
          "timeType": this.timeType
        }

      }
      return data
    },
    /** 查询标签类型列表 */
    getList() {


      if (!this.formValidate()) {
        return
      }
      this.loading = true;
      this.$$api.millionsUsers
        .multiDimensional({ params: this.queryParams, data: this.setSubData() })
        .then(({ res, err }) => {
          if (err) return (this.loading = false);
          if (res) {
            this.dataSource = res.list
            this.total = res.total
          }
          this.loading = false;
        });
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
      this.handleQuery();
    },
  },
};
</script>
<style scoped>
.war {
  height: auto !important;
}

.r-list {
  height: 80vh !important
}

::v-deep .el-color-picker__trigger {
  width: 132px;
}

::v-deep .el-color-picker__empty,
::v-deep .el-color-picker__icon {
  left: 90%;
}

.keyValue {
  color: #20a0ff;
  cursor: pointer;
}

.queryItem {
  width: 240px;
}

.tag-list {
  width: 80%;
  line-height: 0.4rem;
}

.tag-btn {
  /* width: 30%; */
  margin-left: auto;
}

.tag-box {
  padding: 0.16rem !important;
  margin: 0.22rem 0;
}

.tag-class {
  margin: auto 5px;
}
</style>
