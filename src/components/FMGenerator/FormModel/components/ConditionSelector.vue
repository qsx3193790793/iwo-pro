<template>
  <div class="ConditionSelector">
    <div class="inner">
      <div v-for="(v,i) in value" :key="i" class="item">
        <div class="base">
          <template v-if="value.length>1">
            {{ i === 0 ? '┌' : (i >= value.length - 1 ? '└' : '├') }}
          </template>
          <el-select v-model="v.key" placeholder="字段名" clearable>
            <el-option v-for="(vv,ii) in getKeys" v-bind="vv" :key="ii"></el-option>
          </el-select>
          <el-select class="fs0" v-model="v.condition" placeholder="条件" style="width: 54px;">
            <el-option label="=" value="等于"></el-option>
            <el-option label="≠" value="不等于"></el-option>
          </el-select>
          <el-input v-model="v.value" placeholder="值:多个,号分割" clearable></el-input>
          <div class="del" @click="value.splice(i, 1)">×</div>
        </div>
        <div v-if="value.length>1&&i<value.length-1" class="relation">
          ├ 关系
          <el-select v-if="value.length>1&&i<value.length-1" class="fs0" v-model="v.relation" placeholder="关系" style="width: 54px;">
            <el-option label="且" value="&&"></el-option>
            <el-option label="或" value="||"></el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="tools">
      <span class="add" title="添加" @click="$emit('input', [].concat(value || [], [{key: '',condition:'等于', value: '',relation:'&&'}]))">+</span>
    </div>
  </div>
</template>

<script setup>
import {computed, getCurrentInstance, useAttrs} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  root: {type: Object, default: {}},
  value: {type: Array, default: null}
});

const getKeys = computed(() => useAttrs().handleKeys({vm: proxy}))

</script>
<style scoped lang="scss">
.ConditionSelector {
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
      & > .relation {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        margin: 4px 0;

        & > * {
          margin: 0 4px;
        }
      }

      & > .base {
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
