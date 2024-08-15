<template>
  <div class="form-model-main-container" :class="{loading:formConfig.loading}">
    <div v-if="formConfig.topButtons?.length" class="form-name">
      <template v-for="(item,index) in formConfig.topButtons">
        <Button v-if="(!item.isShow)||item.isShow({vm})" v-bind="item.attrs" :key="index" @click="item.onClick&&item.onClick({vm})">{{ item.name }}</Button>
      </template>
    </div>
    <div class="form-model-inner" :style="[formConfig.maxHeight&&{maxHeight:`${formConfig.maxHeight}`,overflow:'auto'}]">
      <Form :model="formData" ref="Form" :inline="true" :label-position="formConfig.labelPosition||'top'" :label-width="formConfig.labelWidth" hide-required-asterisk scroll-to-error>
        <Collapse v-model="collapseActive">
          <template v-for="(item,index) in [].concat(formConfig.items,appendItems)">
            <CollapseItem v-if="!item.isShow||item.isShow({vm})" :key="item.name+`${index}`" :class="{'is-disabled':!item.name}" :name="item.name||`${index}`">
              <template v-if="item.name" #title>
                <div class="main-form-title" @click.stop="collapseActiveToggle(item.name||`${index}`)">
                  {{ item.name }}<span v-if="item.subName" class="sub-title-name" v-html="item.subName"></span>
                  <div class="collapse-mark" @click.stop>
                    <template v-for="(btItem,btIndex) in item.btnTools">
                      <Button v-if="(!btItem.isShow)||btItem.isShow({vm})" v-bind="btItem.attrs" :key="btIndex" @click="btItem.onClick&&btItem.onClick({vm})">{{ btItem.name }}</Button>
                    </template>
                  </div>
                  <span class="collapseTag">{{ collapseActive.includes(item.name || `${index}`) ? '收起' : '展开' }}</span>
                  <i class="el-icon-arrow-right" :class="{'is-active':collapseActive.includes(item.name||`${index}`)}"></i>
                </div>
              </template>
              <Row :gutter="16">
                <!-- 一行5列 无法整除 前后去掉1-->
                <template v-for="(v,i) in item.items">
                  <Col v-if="(!v.isShow)||v.isShow({vm})" :class="{'is-hidden':v.isHidden,[v.type]:!0,[(!v.resize||v.resize==='none')&&`mine-row-${v.type==='textarea'?v.row:1}`]:!['divider-line','divider-empty'].includes(v.type),[`mine-row-divider-empty`]:['divider-empty'].includes(v.type)}" :key="`${v.key}`+v.name+`${i}`" :span="(v.col||8)">
                    <FormItem :key="v.key+v.name" :prop="v.key" :key-value="v.key" :class="v.class" :style="v.style" :rules="getRules(v)" :required="v.isRequire">
                      <template v-if="v.name" #label>
                        <div class="slot-label">
                          <div v-html="getName(v.name)" :class="{require:v.isRequire}"></div>
                          <div v-html="getName(v.subName)" class="sub-name"></div>
                        </div>
                      </template>
                      <Input v-if="['input','FMInput'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请输入')" autocomplete="off" :clearable="v.clearable??true" :required="v.isRequire" :disabled="disabled||v.isDisable" @change="v.onChange&&v.onChange({vm,item:v})" @keydown.enter.native="v.onChange&&v.onChange({vm,item:v})">
                        <template v-if="!disabled&&v.dialog&&(!v.dialog.isShow||v.dialog.isShow({vm}))" #append>
                          <Button icon="Search" @click="v.dialog.beforeOpen?(v.dialog.isOpen=v.dialog.beforeOpen({vm})):(v.dialog.isOpen=!0)" :disabled="!!v.btnDisabled"/>
                          <Modal v-model="v.dialog.isOpen" :title="v.dialog.title" @onOpen="v.dialog.onOpen&&v.dialog.onOpen({vm})">
                            <template #default="slotProps">
                              <component v-on="v.dialog.emitter?.({vm})" v-bind="v.dialog.attrs||{}" :ref="v.key" :root="{...slotProps,vm}" :is="v.dialog.component"></component>
                            </template>
                          </Modal>
                        </template>
                      </Input>
                      <Input v-else-if="['textarea','FMTextarea'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :ref="v.key" type="textarea" :rows="v.rows??2" :maxlength="v.maxlength" :show-word-limit="!!v.maxlength" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请输入')" :clearable="v.clearable??true" :resize="v.resize||'none'" :required="v.isRequire" :disabled="disabled||v.isDisable" @change="v.onChange&&v.onChange({vm,item:v})"/>
                      <InputNumber v-else-if="['number','FMNumber'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :precision="v.precision??0" :min="$$getVariableType(v.min)==='[object Function]'?v.min({vm}):v.min" :max="$$getVariableType(v.max)==='[object Function]'?v.max({vm}):v.max" :controls="!0" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请输入')" :clearable="v.clearable??true" :required="v.isRequire" :disabled="disabled||v.isDisable" @change="v.onChange&&v.onChange({vm,item:v})"/>
                      <Autocomplete v-else-if="['inputAutocomplete','FMInputAutocomplete'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" value-key="name" :fetch-suggestions="v.suggestions&&v.suggestions({vm,options:v.options})" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请输入')" :required="v.isRequire" :disabled="disabled||v.isDisable" :clearable="v.clearable??true" @select="v.onChange&&v.onChange({vm,item:v})" @change="v.onChange&&v.onChange({vm,item:v})">
                        <template #default="{ item }">
                          <div class="autocomplete-name" :title="item.name">{{ item.name }}</div>
                        </template>
                      </Autocomplete>
                      <Select v-else-if="['remoteSelect','FMRemoteSelect'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请输入')" :clearable="v.clearable??true" :required="v.isRequire" :multiple="v.multiple??!1" filterable remote :remote-method="(query)=>v.remoteMethod&&v.remoteMethod({vm,options:v.options,query})" :disabled="disabled||v.isDisable" collapse-tags @change="v.onChange&&v.onChange({vm,item:v})">
                        <Option v-for="vv in getSelectOptions(v)" :key="vv.value+i" :label="vv.label" :value="vv.value" :disabled="vv.disabled"></Option>
                      </Select>
                      <Cascader v-else-if="['cascader','FMCascader'].includes(v.type)" v-loading.stop="v.loading" v-bind="getName(v.attrs)" v-model="formData[v.key]" :ref="v.key" :options="getSelectOptions(v)" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :clearable="v.clearable??true" :required="v.isRequire" :disabled="disabled||v.isDisable" filterable collapse-tags collapse-tags-tooltip @change="v.onChange&&v.onChange({vm,item:v})"></Cascader>
                      <Select v-else-if="['select','FMSelect'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :clearable="v.clearable??true" :required="v.isRequire" :disabled="disabled||v.isDisable" filterable @change="v.onChange&&v.onChange({vm,item:v})">
                        <template #label="slotProps">
                          <component :is="v.label_component" :item="slotProps"></component>
                        </template>
                        <Option v-for="vv in getSelectOptions(v)" :key="vv.value+i" :label="vv.label" :value="vv.value" :disabled="vv.disabled">
                          <component v-if="v.option_component" :is="v.option_component" :item="vv"></component>
                        </Option>
                      </Select>
                      <Select v-else-if="['multipleSelect','FMMultipleSelect'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :clearable="v.clearable??true" :required="v.isRequire" :disabled="disabled||v.isDisable" multiple collapse-tags filterable @change="v.onChange&&v.onChange({vm,item:v})">
                        <Option v-for="vv in getSelectOptions(v)" :key="vv.value+i" :label="vv.label" :value="vv.value" :disabled="vv.disabled"></Option>
                      </Select>
                      <Select v-else-if="['groupSelect','FMGroupSelect'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :clearable="v.clearable??true" :required="v.isRequire" :disabled="disabled||v.isDisable" multiple collapse-tags filterable @change="v.onChange&&v.onChange({vm,item:v})">
                        <OptionGroup v-for="item in getSelectOptions(v)" :key="item.label" :label="item.label">
                          <Option v-for="v in item.options" :key="v.value+i" :label="v.label" :value="v.value"/>
                        </OptionGroup>
                      </Select>
                      <DatePicker v-else-if="['datePicker','FMDatePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format" :value-format="v.valueFormat||'yyyy-MM-dd'" type="date" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['datesPicker','FMDatesPicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format" :value-format="v.valueFormat||'yyyy-MM-dd'" type="dates" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['dateRangePicker','FMDateRangePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy-MM-dd'" :value-format="v.valueFormat||'yyyy-MM-dd'" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['monthPicker','FMMonthPicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy-MM'" :value-format="v.valueFormat||'yyyy-MM'" type="month" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['monthsPicker','FMMonthsPicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy-MM'" :value-format="v.valueFormat||'yyyy-MM'" type="months" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['monthRangePicker','FMMonthRangePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy-MM'" :value-format="v.valueFormat||'yyyy-MM'" type="monthrange" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['yearPicker','FMYearPicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy'" :value-format="v.valueFormat||'yyyy'" type="year" :readonly="v.readonly??false" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['yearsPicker','FMYearsPicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy'" :value-format="v.valueFormat||'yyyy'" type="years" :readonly="v.readonly??false" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['dateTimePicker','FMDateTimePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy-MM-dd HH:mm:ss'" :value-format="v.valueFormat||'yyyy-MM-dd HH:mm:ss'" type="datetime" :default-time="v.defaultTime ||new Date(1970, 1, 1, 0, 0, 0)" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <DatePicker v-else-if="['dateTimeRangePicker','FMDateTimeRangePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'yyyy-MM-dd HH:mm:ss'" :value-format="v.valueFormat||'yyyy-MM-dd HH:mm:ss'" type="datetimerange" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></DatePicker>
                      <TimePicker v-else-if="['timePicker','FMTimePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'HH:mm:ss'" :value-format="v.valueFormat||'HH:mm:ss'" :clearable="v.clearable??true" :editable="!1" @change="v.onChange&&v.onChange({vm,item:v})"></TimePicker>
                      <TimePicker v-else-if="['timeRangePicker','FMTimeRangePicker'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" start-placeholder="开始时间" end-placeholder="结束时间" :disabled-date="(d)=>v.disabledDate?.({vm,d})" :required="v.isRequire" :disabled="disabled||v.isDisable" :format="v.format||'HH:mm:ss'" :value-format="v.valueFormat||'HH:mm:ss'" :clearable="v.clearable??true" :editable="!1" is-range @change="v.onChange&&v.onChange({vm,item:v})"></TimePicker>
                      <TimerSelector v-else-if="['timerSelector','FMTimerSelector'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :placeholder="(v.isDisable||disabled)?'':(v.placeholder||'请选择')" :required="v.isRequire" :disabled="disabled||v.isDisable" @change="v.onChange&&v.onChange({vm,item:v,value:$event})"></TimerSelector>
                      <RadioGroup v-else-if="['radio','FMRadio'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :required="v.isRequire" :disabled="disabled||v.isDisable" :max="v.max" @change="v.onChange&&v.onChange({vm,item:v})">
                        <RadioButton v-for="ev in getSelectOptions(v)" :key="ev.value+i" :label="ev.value" :style="{width: `calc(100% / ${v.options?.length||2})`}" border>{{ ev.label }}</RadioButton>
                      </RadioGroup>
                      <CheckboxGroup v-else-if="['checkbox','FMCheckbox'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" :required="v.isRequire" :disabled="disabled||v.isDisable" @change="v.onChange&&v.onChange({vm,item:v})">
                        <CheckboxButton v-for="ev in getSelectOptions(v)" :key="ev.value+i" :label="ev.value" :style="{width: `calc(100% / ${v.options?.length||2})`}" border>{{ ev.label }}</CheckboxButton>
                      </CheckboxGroup>
                      <Slider v-else-if="['slider','FMSlider'].includes(v.type)" v-model="formData[v.key]" :min="v.min??0" :max="v.max??100" :disabled="v.isDisable" @change="v.onChange&&v.onChange({vm,item:v})"></Slider>
                      <MonacoEditor v-else-if="['monacoEditor','FMMonacoEditor'].includes(v.type)" v-model="formData[v.key]" :height="v.height||'1.2rem'" @change="v.onChange&&v.onChange({vm,item:v})" :disabled="v.isDisable"></MonacoEditor>
                      <!-- v.component可以为字符串使用components导入的组件，或直接为组件对象-->
                      <component v-else-if="['component','FMComponent'].includes(v.type)" v-loading="v.loading" v-model="formData[v.key]" v-on="v.emitter?.({vm,item:v})" v-bind="v.attrs||{}" :ref="v.key" :root="{vm,item:v}" :is="v.component" :disabled="disabled||v.isDisable"></component>
                      <template v-else-if="['button','FMButton'].includes(v.type)">
                        <div v-if="v.verticalAlign!=='top'" style="height: 0.28rem;"></div>
                        <Button v-bind="v.attrs" :loading="v.loading" :disabled="$$getVariableType(v.attrs?.disabled)==='[object Function]'?v.attrs.disabled({vm}):v.attrs?.disabled" @click="v.onClick&&v.onClick({vm})">{{ v.btnName }}</Button>
                      </template>
                      <template v-else-if="['buttons','FMButtons'].includes(v.type)">
                        <div v-if="v.verticalAlign!=='top'" style="height: 0.28rem;"></div>
                        <div class="form-buttons" :class="v.align||'left'">
                          <Button v-for="(bv,bi) in v.items" v-bind="bv.attrs" :loading="v.loading" :key="bi" :disabled="$$getVariableType(bv.attrs?.disabled)==='[object Function]'?bv.attrs.disabled({vm}):bv.attrs?.disabled" @click="bv.onClick&&bv.onClick({vm})">{{ bv.btnName }}</Button>
                        </div>
                      </template>
                      <div v-else-if="['text','FMText'].includes(v.type)" class="just-text" :style="v.style">{{ formData[v.key] }}</div>
                      <Alert v-else-if="['alert','FMAlert'].includes(v.type)" :class="{'single-line':!(v.description&&v.title)}" type="info" :closable="false" show-icon>
                        <div v-if="v.description" class="description" v-html="v.description"></div>
                        <template v-if="v.title" #title>
                          <div class="title" v-html="v.title"></div>
                        </template>
                      </Alert>
                    </FormItem>
                  </Col>
                </template>
              </Row>
            </CollapseItem>
          </template>
        </Collapse>
      </Form>
    </div>
    <div v-if="formConfig.bottomButtons?.items?.length" class="bottomButtons" :class="formConfig.bottomButtons?.align">
      <template v-for="(bv,bi) in formConfig.bottomButtons?.items">
        <Button v-if="(!bv.isShow)||bv.isShow({vm})" v-bind="bv.attrs" :loading="bv.loading" :key="bi" :disabled="$$getVariableType(bv.attrs?.disabled)==='[object Function]'?bv.attrs.disabled({vm}):bv.attrs?.disabled" @click="bv.onClick&&bv.onClick({vm})">{{ bv.btnName }}</Button>
        <!--        <Button v-if="(!item.isShow)||item.isShow({vm})" v-bind="item.attrs" :key="index" @click="item.onClick&&item.onClick({vm})">{{ item.name }}</Button>-->
      </template>
    </div>
  </div>
</template>

<script>
import {Alert, Autocomplete, Button, Cascader, Checkbox, CheckboxButton, CheckboxGroup, Col, Collapse, CollapseItem, DatePicker, Form, FormItem, Icon, Input, InputNumber, Option, OptionGroup, Radio, RadioButton, RadioGroup, Row, Select, Slider, TimePicker} from "element-ui";
import Modal from "./components/Modal";
import TimerSelector from "./components/TimerSelector";
import OptionSelector from "./components/OptionSelector";
import ConditionSelector from "./components/ConditionSelector";
import MonacoEditor from "@/components/MonacoEditor";
import AddressSelector from "./components/AddressSelector";
import DingDanSelector from "./components/DingDanSelector";
import SalesSelector from "./components/SalesSelector";
import PaymentSelector from "./components/PaymentSelector";
import OrderSalesSelector from "./components/OrderSalesSelector";
import PointCosHisSelector from "./components/PointCosHisSelector";

export default {
  name: "FormModel",
  components: {
    DingDanSelector, MonacoEditor,
    PaymentSelector, SalesSelector, AddressSelector, PointCosHisSelector,
    TimePicker, OptionSelector, ConditionSelector, OrderSalesSelector,
    TimerSelector, Modal,
    Cascader, Slider, Alert, InputNumber, Checkbox, RadioButton, CheckboxGroup, CheckboxButton, Icon, Input, Button, Collapse, CollapseItem, Form, FormItem, Col, Row, RadioGroup, Radio, DatePicker, Select, OptionGroup, Option, Autocomplete
  },
  props: {
    formConfig: {type: Object, default: () => ({})},
    fixedWidth: {type: String, default: '45%'},
    disabled: {type: Boolean, default: !1},//表单禁用
  },
  data() {
    return {
      vm: null,
      collapseActive: [],
      reqQuery: {},//浏览器跳转参数
      expandFormConfigItems: [],
      formData: {},
      isSaved: !0//是否保存过
    };
  },
  watch: {
    formConfig() {
      this.init();
    },
    formData: {
      handler() {
        this.$emit('formDataChange', this.formData);
        this.isSaved = !1;//表单改动 标为未保存
      },
      deep: !0
    },
    appendItems: {
      handler(nV, oV) {
        this.loadExpandFormConfigItems();
        this.appendItems.forEach(ai => {
          !this.collapseActive.includes(ai.name) && this.collapseActive.push(ai.name);
        });
        // 先删除旧的 formData
        oV.forEach(v => (v.items || []).forEach(vi => {
          if (vi.key) delete this.formData[vi.key]
        }));
        // 再添加新的 formData
        nV.forEach(v => (v.items || []).forEach(vi => {
          vi.key && this.$set(this.formData, vi.key, vi.value ?? null);
        }));
      }
    }
  },
  computed: {
    appendItems() {
      return this.formConfig.appendItems?.length ? this.formConfig.appendItems : [];
    }
  },
  methods: {
    //将数字值转为字符串
    getStringValue(value) {
      if (this.$$getVariableType(value) === '[object Array]') return value.map(v => this.getStringValue(v));
      if (this.$$getVariableType(value) === '[object Number]') return value.toString();
      return value;
    },
    //赋值数据
    initFormData(res) {
      const formDataKeys = Object.keys(this.formData), resDataKeys = Object.keys(this.$$object2pathObject(res || {}));
      this.expandFormConfigItems?.forEach(efci => {
        if (!efci.key) return;
        let v = this.$$lodash.get(res || {}, efci.key?.replace(/\$dot\$/g, '.'));
        // 选择器类型的讲值转为字符串 不然element无法匹配 数字
        if (['radio', 'FMRadio', 'checkbox', 'FMCheckbox', 'select', 'FMSelect', 'groupSelect', 'FMGroupSelect', 'multipleSelect', 'FMMultipleSelect', 'cascader', 'FMCascader'].includes(efci.type)) {
          if (this.$$isEmpty(v)) return this.formData[efci.key] = efci.value ?? null;
          return this.formData[efci.key] = this.getStringValue(v);
        }
        this.formData[efci.key] = v ?? efci.value ?? null;
      });
      //然后再把resData里没用到的去插到formdata里
      resDataKeys.forEach(key => !(formDataKeys.includes(key) || formDataKeys.includes(key.replace(/\./g, '$dot$'))) && (this.formData[key] = res[key] ?? null));
      console.log('initFormData', res, formDataKeys, resDataKeys, this.formData);
    },
    //封装多级数据 填写时 key为 a.b.c 转换成 a：{b：{c}}
    getFormData() {
      return Object.keys(this.formData).reduce((t, k) => (this.$$lodash.set(t, k?.replace(/\$dot\$/g, '.'), this.formData[k]), t), {});
    },
    appendFormData(formData) {
      Object.assign(this.formData, formData);
    },
    removeFormData(keys = []) {
      keys.forEach(k => delete this.formData[k]);
    },
    validator(cb, err) {
      console.log('validator', this.formData);
      this.$refs['Form']?.validate(valid => valid ? cb?.(this.getFormData(), this) : (err ? err(valid) : this.$$Toast({message: `表单验证不通过，请检查`, type: 'error'})));
    },
    resetFormData(filterKeys = []) {
      this.$$resetFormFields({fields: this.formData, filterKeys});
      this.expandFormConfigItems.filter(efci => filterKeys.length ? filterKeys.includes(efci.key) : !0).forEach(efci => efci.onChange?.({vm: this}));
    },
    getSelectOptions(v) {
      if (this.$$getVariableType(v.options) === '[object Function]') {
        const res = v.options({vm: this, item: v});//如果是async函数 默认返回一个[]，由v.options = r赋值
        if (this.$$getVariableType(res) === '[object Promise]') {
          res.then(r => v.options = r);
          return v.options = [];//先返回空 避免重绘时继续调用options方法 等待上面then赋值
        }
        return res || [];
      }
      return v.options || [];
    },
    getRules(v) {
      const maxlengthRule = [];
      if (['textarea', 'FMTextarea'].includes(v.type) && v.maxlength) maxlengthRule.push({max: v.maxlength, message: `最多输入${v.maxlength}个字符`, trigger: ['blur', 'change']});
      if (['monacoEditor', 'FMMonacoEditor'].includes(v.type)) maxlengthRule.push({
        validator: (rule, value, cb) => {
          this.$$validator.isJson(value) ? cb() : cb(new Error('JSON格式错误'))
        }, message: `JSON格式错误`, trigger: ['blur', 'change']
      });
      if (['input', 'FMInput', 'textarea', 'FMTextarea', 'number', 'FMNumber', 'inputAutocomplete', 'FMInputAutocomplete', 'monacoEditor', 'FMMonacoEditor'].includes(v.type)) return [].concat(v.isRequire ? [{required: true, message: '此项必填', trigger: ['blur', 'change']}] : [], v.rules || [], maxlengthRule)
      return [].concat(v.isRequire ? [{required: true, message: '此项必选', trigger: 'change'}] : [], v.rules || [])
    },
    getName(name) {
      if (this.$$getVariableType(name) === '[object Function]') return name({vm: this});
      return name;
    },
    collapseActiveToggle(name) {
      const finderIndex = this.collapseActive.findIndex(ca => ca == name);
      if (finderIndex === -1) return this.collapseActive.push(name);
      this.collapseActive.splice(finderIndex, 1);
    },
    loadExpandFormConfigItems() {
      const items = [].concat(this.formConfig.items || [], this.appendItems || []);
      this.expandFormConfigItems = [].concat(...items?.map(ba => ba?.items || []));//展开
    },
    init() {
      this.reqQuery = this.$route.query;
      //把isHidden隐藏字段放到最后 避免影响布局 并格式化name
      this.formConfig.items?.forEach(it => {
        it.name = this.getName(it.name);
        // 把.key path转换成  a.b.c -》  a$dot$b$dot$c 不然与v-model不好绑定
        (it?.items || []).forEach(iti => iti.key && (iti.key = iti.key.replace(/\./g, '$dot$')));
      });
      // 模式mode为collapse可伸缩展开，collapsed是否默认展开 ，默认使用name||否则使用index
      this.collapseActive = this.formConfig.items?.map((fci, i) => fci.mode === 'collapse' ? (fci.collapsed ? (fci.name || `${i}`) : null) : (fci.name || `${i}`)).filter(f => f);
      this.loadExpandFormConfigItems();//展开
      // this.formData = this.expandFormConfigItems?.reduce((t, c) => (c.key && (this.$$lodash.set(t, c.key, c.value ?? null)), t), {});//初始化formData把数据key对应
      this.formData = [].concat(this.expandFormConfigItems, this.formConfig.hiddenFields || [])?.reduce((t, c) => (c.key && (t[c.key] = c.value ?? null), t), {});//初始化formData把数据key对应

      this.formConfig.onLoad && this.formConfig.onLoad({$store: this.$store, vm: this});
      console.log('formModel init', this.formConfig, this.expandFormConfigItems, this.formData);
    }
  },
  created() {
    this.vm = this;
    this.init();
  }
}
</script>

<style scoped lang="scss">
@import "../index.scss";
</style>
