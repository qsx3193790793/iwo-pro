<template>
  <div class="ConditionSelector">
    <div class="inner">
      <div class="title">
        <span style="width: 0.94rem;">表单字段</span>
        <span style="width: 0.60rem;padding-right: 0.08rem;">条件</span>
        <span>值</span>
        <div class="btn add" title="增加数据" @click="$emit('input', [].concat(value || [], [{key: '',condition:'等于', value: '',relation:'&&'}]))">+</div>
      </div>
      <div v-for="(v,i) in value" :key="i" class="item">
        <div class="base">
          <template v-if="value.length>1">
            {{ i === 0 ? '┌' : (i >= value.length - 1 ? '└' : '├') }}
          </template>
          <el-select v-model="v.key" class="fs0" placeholder="字段名" style="width: 0.9rem;" clearable>
            <el-option v-for="(vv,ii) in getKeys" v-bind="vv" :key="ii"></el-option>
          </el-select>
          <el-select class="fs0" v-model="v.condition" placeholder="条件" style="width: 0.6rem;">
            <el-option label="=" value="等于"></el-option>
            <el-option label="≠" value="不等于"></el-option>
          </el-select>
          <el-input v-model="v.value" class="fs1" placeholder="值:多个,号分割" clearable></el-input>
          <div class="btn del fs0" @click="value.splice(i, 1)">×</div>
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
    max-height: 200px;
    overflow: auto;
    min-height: 80px;
    padding: 0 5px 10px 5px;

    & > .title {
      position: sticky;
      top: 0;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding: 8px 0;
      z-index: 1;
      background-color: #fff;

      & > div {
        flex-grow: 0;
        flex-shrink: 0;
      }

      & > span {
        width: 50%;
        font-size: 14px;
        font-weight: bold;
        line-height: 1.26;
        color: rgb(97, 101, 110);
        text-align: center;
        border-right: 1PX solid #d5d5d5;
        flex-grow: 0;
        flex-shrink: 0;
        margin: 0 4px;

        &:nth-child(n+3) {
          border-right: none;
        }

        &:nth-child(3) {
          flex-grow: 1;
          width: auto;
        }
      }
    }

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

        .fs1 {
          flex-grow: 1;
        }

        & > * {
          margin: 0 4px;
        }
      }
    }
  }
}
</style>
