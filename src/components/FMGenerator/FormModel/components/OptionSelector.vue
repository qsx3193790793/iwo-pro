<template>
  <div class="OptionSelector">
    <div class="inner">
      <div v-for="(v,i) in value" :key="i" class="item">
        <el-select v-if="getKeys.length" v-model="v.label" :placeholder="formPlaceholder" filterable clearable>
          <el-option v-for="(vv,ii) in getKeys" v-bind="vv" :key="ii"></el-option>
        </el-select>
        <el-input v-else v-model="v.label" :placeholder="formPlaceholder"></el-input>
        <el-input v-model="v.value" :placeholder="toPlaceholder"></el-input>
        <div class="del" @click="value.splice(i, 1)">×</div>
      </div>
    </div>
    <div class="tools">
      <span class="add" title="增加数据" @click="$emit('input', [].concat(value || [], [{label: '', value: ''}]))">+</span>
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

const getKeys = computed(() => useAttrs().handleKeys?.({vm: proxy}) || [])

</script>
<style scoped lang="scss">
.OptionSelector {
  position: relative;
  border: 1PX solid #DCDFE6;
  border-radius: 4px;

  .del {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    font-size: 16px;
    color: #fff;
    background-color: $main-error;
    flex-shrink: 0;
    flex-grow: 0;
    cursor: pointer;
    border-radius: 4px;
  }

  & > .inner {
    max-height: 150px;
    overflow: auto;
    min-height: 60px;
    padding: 5px 5px 10px 5px;

    & > .item {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      margin: 4px 0;

      .fs0 {
        flex-shrink: 0;
        flex-grow: 0;
      }

      & > * {
        margin: 0 4px;
      }
    }
  }

  & > .tools {
    position: absolute;
    bottom: 0;
    right: 9px;
    transform: translateY(50%);

    & > span {
      display: inline-block;
      width: 20px;
      height: 20px;
      line-height: 20px;
      font-size: 14px;
      color: #fff;
      text-align: center;
      margin: 0 4px;
      border-radius: 4px;
      cursor: pointer;

      &.add {
        background-color: $main-success;
      }
    }
  }
}
</style>
