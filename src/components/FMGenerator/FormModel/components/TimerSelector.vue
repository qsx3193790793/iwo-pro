<template>
  <div class="timer-selector">
    <Popover v-model:visible="visible" width="100%" placement="bottom" trigger="click" :teleported="!1" @show="initValue">
      <template #reference>
        <Input v-bind="$attrs" v-model="text" ref="InputRef" readonly :clearable="!1">
          <template #prefix>
            <Icon class="el-input__icon">
            </Icon>
          </template>
        </Input>
      </template>
      <div class="timer-picker">
        <div class="header">
          <div>小时</div>
          <div>分钟</div>
          <div>秒</div>
        </div>
        <div class="body">
          <div ref="scrollRef_p_h" class="h">
            <div v-for="(v,i) in maxH" ref="itemRef_h" class="item" :class="{active:selectH===i}" @click="selectH=i">{{ i.toString().padStart(2, '0') }}</div>
          </div>
          <div ref="scrollRef_p_m" class="m">
            <div v-for="(v,i) in 60" ref="itemRef_m" class="item" :class="{active:selectM===i,disabled:i>maxM}" @click="i<=maxM&&(selectM=i)">{{ i.toString().padStart(2, '0') }}</div>
          </div>
          <div ref="scrollRef_p_s" class="s">
            <div v-for="(v,i) in 60" ref="itemRef_s" class="item" :class="{active:selectS===i,disabled:i>maxS}" @click="i<=maxS&&(selectS=i)">{{ i.toString().padStart(2, '0') }}</div>
          </div>
        </div>
        <div class="footer">
          <Button size="small" @click="onCancel">取消</Button>
          <Button size="small" type="primary" @click="onConfirm">确认</Button>
        </div>
      </div>
    </Popover>
  </div>
</template>

<script setup>
import {Button, Input, Icon, Popover} from "element-ui";
import {computed, getCurrentInstance, nextTick, ref} from "vue";

const {proxy} = getCurrentInstance();

const props = defineProps({
  value: {type: Number, default: 0},
  max: {type: Number, default: 86400},
});

const emitter = defineEmits(['change']);

const visible = ref(!1);

const selectH = ref(0);
const selectM = ref(0);
const selectS = ref(0);

//时数据
const maxH = computed(() => {
  const surplusH = Math.floor(props.max / (60 * 60));
  return surplusH === 0 ? 1 : (surplusH + 1);
});

//分数据
const maxM = computed(() => {
  const surplusM = Math.floor((props.max - (selectH.value * 60 * 60)) / 60);//剩余分钟数
  return surplusM >= 60 ? 60 : ((selectM.value > surplusM && (selectM.value = surplusM)), (surplusM || 1));
});

//秒数据
const maxS = computed(() => {
  const surplusS = Math.floor((props.max - (selectH.value * 60 * 60) - (selectM.value * 60)));//剩余秒数
  return surplusS >= 60 ? 60 : ((selectS.value > surplusS && (selectS.value = surplusS)), (surplusS || 1));
});

function getH() {
  return Math.floor(props.value / (60 * 60));
}

function getM() {
  return Math.floor((props.value - (getH() * (60 * 60))) / 60);
}

function getS() {
  return Math.floor(props.value % 60);
}

const text = computed(() => {
  return `${getH().toString().padStart(2, '0')}小时${getM().toString().padStart(2, '0')}分${getS().toString().padStart(2, '0')}秒`;
});

const scrollRef_p_h = ref(null);
const itemRef_h = ref([]);
const scrollRef_p_m = ref(null);
const itemRef_m = ref([]);
const scrollRef_p_s = ref(null);
const itemRef_s = ref([]);

function initValue() {
  selectH.value = getH();
  selectM.value = getM();
  selectS.value = getS();
  nextTick(() => {
    scrollRef_p_h.value && proxy.$$scrollParentToChild(scrollRef_p_h.value, itemRef_h.value[selectH.value]);
    scrollRef_p_m.value && proxy.$$scrollParentToChild(scrollRef_p_m.value, itemRef_m.value[selectM.value]);
    scrollRef_p_s.value && proxy.$$scrollParentToChild(scrollRef_p_s.value, itemRef_s.value[selectS.value]);
  })
}

function onCancel() {
  visible.value = !1;
  initValue();
}

function onConfirm() {
  const time = selectH.value * 60 * 60 + selectM.value * 60 + selectS.value;
  visible.value = !1;
  emitter('input', time);
  emitter('change', time);
}

</script>
<style scoped lang="scss">

.timer-picker {
  .header {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    margin-bottom: 10px;

    & > div {
      width: 33%;
      font-size: 14px;
      line-height: 28px;
      text-align: center;
      font-weight: bold;
      color: $main-text;
    }
  }

  .body {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    height: 160px;

    & > div {
      width: 33%;
      height: 100%;
      overflow: auto;

      .item {
        font-size: 14px;
        line-height: 28px;
        text-align: center;
        color: $main-text;
        cursor: pointer;

        &.active {
          color: $main-color;
        }

        &.disabled {
          color: $main-disabled;
          cursor: not-allowed;
        }
      }
    }
  }

  .footer {
    margin-top: 10px;
    text-align: right;
  }
}

</style>
