<template>
  <div class="OptionSelector">
    <div class="inner">
      <div class="title">
        <span>{{ formPlaceholder }}</span>
        <span>{{ toPlaceholder }}</span>
        <div class="btn add" title="增加数据" @click="$emit('input', [].concat(value || [], [{label: '', value: ''}]))">+</div>
      </div>
      <div v-for="(v,i) in value" :key="i" class="item">
        <el-select v-if="getKeys?.length" v-model="v.label" placeholder="请选择" style="width: 50%;" filterable clearable>
          <el-option v-for="(vv,ii) in getKeys" v-bind="vv" :key="ii"></el-option>
        </el-select>
        <el-input v-else v-model="v.label" placeholder="请输入" style="width: 50%;"></el-input>
        <el-select v-if="getValueKeys?.filter(vk=>vk?.options?.length)?.length" v-model="v.value" placeholder="请选择" style="width: 50%;" filterable clearable>
          <el-option-group v-for="(vv,ii) in getValueKeys" v-bind="vv" :key="ii">
            <el-option v-for="(vvv,iii) in vv.options" v-bind="vvv" :key="iii"></el-option>
          </el-option-group>
        </el-select>
        <el-input v-else v-model="v.value" placeholder="请输入" style="width: 50%;"></el-input>
        <div class="btn del" @click="value.splice(i, 1)">×</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, useAttrs} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  root: {type: Object, default: {}},
  value: {type: Array, default: null},
  formPlaceholder: {type: String, default: '名称'},
  toPlaceholder: {type: String, default: '值'},
});

const getKeys = computed(() => {
  const values = (props.value || []).map(r => r.label);
  const keys = (useAttrs().handleKeys?.({vm: proxy.root.vm}) || []).map(r => Object.assign({}, r, {disabled: values.includes(r.value)}));
  console.log('getKeys', values, keys)
  return keys
});

const getValueKeys = computed(() => useAttrs().handleValueKeys?.({vm: proxy.root.vm}) || []);

</script>
<style scoped lang="scss">
.OptionSelector {
  position: relative;
  border: 1PX solid #DCDFE6;
  border-radius: 4px;

  .btn {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    font-size: 16px;
    color: #fff;
    flex-shrink: 0;
    flex-grow: 0;
    cursor: pointer;
    border-radius: 4px;
    margin: 0 4px;

    &.del {
      background-color: $main-error;
    }

    &.add {
      background-color: $main-success;
    }
  }

  & > .inner {
    position: relative;
    max-height: 200px;
    overflow: auto;
    min-height: 80px;
    padding: 0 5px 10px 5px;

    & > .title {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 0;
      z-index: 1;
      background-color: #fff;

      & > span {
        width: 50%;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.26;
        color: rgb(97, 101, 110);
        text-align: center;

        &:first-child {
          border-right: 1PX solid #d5d5d5;
        }
      }
    }

    & > .item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 4px 0;
      text-align: center;

      .fs0 {
        flex-shrink: 0;
        flex-grow: 0;
      }

      & > * {
        margin: 0 4px;
      }
    }
  }

}
</style>
