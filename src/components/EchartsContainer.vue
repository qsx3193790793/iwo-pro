<template>
  <div ref="echartsContainerRef" class="EchartsContainer">
    <div v-if="status!==1" class="ApiStatus">
      <div v-if="status===0" class="ApiStatus-empty">
        <div class="svg-loading">
          <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="25" height="25" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
            <g transform="translate(50 50)">
              <g transform="translate(-19 -19) scale(0.6)">
                <g transform="rotate(26.2996)">
                  <animateTransform attributeName="transform" type="rotate" values="0;45" keyTimes="0;1" dur="0.1984126984126984s" begin="0s" repeatCount="indefinite"></animateTransform>
                  <path
                      d="M31.27102740821564 17.835998565671233 L38.34209522008111 24.907066377536708 L24.90706637753671 38.34209522008111 L17.835998565671236 31.27102740821564 A36 36 0 0 1 9.500000000000002 34.72391107003933 L9.500000000000002 34.72391107003933 L9.500000000000002 44.72391107003933 L-9.499999999999998 44.72391107003933 L-9.499999999999998 34.72391107003933 A36 36 0 0 1 -17.83599856567124 31.271027408215637 L-17.83599856567124 31.271027408215637 L-24.907066377536715 38.34209522008111 L-38.342095220081106 24.907066377536722 L-31.27102740821563 17.835998565671247 A36 36 0 0 1 -34.72391107003933 9.499999999999996 L-34.72391107003933 9.499999999999996 L-44.72391107003933 9.499999999999998 L-44.723911070039335 -9.499999999999986 L-34.723911070039335 -9.499999999999988 A36 36 0 0 1 -31.271027408215637 -17.835998565671236 L-31.271027408215637 -17.835998565671236 L-38.34209522008111 -24.90706637753671 L-24.907066377536722 -38.342095220081106 L-17.835998565671247 -31.27102740821563 A36 36 0 0 1 -9.499999999999998 -34.72391107003933 L-9.499999999999998 -34.72391107003933 L-9.5 -44.72391107003933 L9.499999999999984 -44.723911070039335 L9.499999999999986 -34.723911070039335 A36 36 0 0 1 17.835998565671236 -31.27102740821564 L17.835998565671236 -31.27102740821564 L24.907066377536708 -38.34209522008112 L38.342095220081106 -24.90706637753673 L31.27102740821563 -17.83599856567125 A36 36 0 0 1 34.72391107003933 -9.500000000000002 L34.72391107003933 -9.500000000000002 L44.72391107003933 -9.500000000000004 L44.723911070039335 9.499999999999982 L34.723911070039335 9.499999999999984 A36 36 0 0 1 31.27102740821564 17.835998565671233 M0 -25A25 25 0 1 0 0 25 A25 25 0 1 0 0 -25"
                      fill="#5376fe"></path>
                </g>
              </g>
              <g transform="translate(19 19) scale(0.6)">
                <g transform="rotate(41.2004)">
                  <animateTransform attributeName="transform" type="rotate" values="45;0" keyTimes="0;1" dur="0.1984126984126984s" begin="-0.0992063492063492s" repeatCount="indefinite"></animateTransform>
                  <path
                      d="M-31.271027408215637 -17.835998565671236 L-38.34209522008111 -24.90706637753671 L-24.907066377536722 -38.342095220081106 L-17.835998565671247 -31.27102740821563 A36 36 0 0 1 -9.499999999999998 -34.72391107003933 L-9.499999999999998 -34.72391107003933 L-9.5 -44.72391107003933 L9.499999999999984 -44.723911070039335 L9.499999999999986 -34.723911070039335 A36 36 0 0 1 17.835998565671236 -31.27102740821564 L17.835998565671236 -31.27102740821564 L24.907066377536708 -38.34209522008112 L38.342095220081106 -24.90706637753673 L31.27102740821563 -17.83599856567125 A36 36 0 0 1 34.72391107003933 -9.500000000000002 L34.72391107003933 -9.500000000000002 L44.72391107003933 -9.500000000000004 L44.723911070039335 9.499999999999982 L34.723911070039335 9.499999999999984 A36 36 0 0 1 31.27102740821564 17.835998565671233 L31.27102740821564 17.835998565671233 L38.34209522008112 24.907066377536704 L24.90706637753673 38.342095220081106 L17.83599856567125 31.27102740821563 A36 36 0 0 1 9.500000000000004 34.72391107003933 L9.500000000000004 34.72391107003933 L9.500000000000002 44.72391107003933 L-9.500000000000014 44.72391107003933 L-9.500000000000012 34.72391107003933 A36 36 0 0 1 -17.835998565671176 31.271027408215673 L-17.835998565671176 31.271027408215673 L-24.90706637753664 38.342095220081156 L-38.34209522008109 24.907066377536736 L-31.271027408215627 17.835998565671254 A36 36 0 0 1 -34.72391107003932 9.500000000000036 L-34.72391107003932 9.500000000000036 L-44.72391107003932 9.500000000000039 L-44.72391107003933 -9.500000000000007 L-34.72391107003933 -9.50000000000001 A36 36 0 0 1 -31.27102740821564 -17.83599856567123 M0 -25A25 25 0 1 0 0 25 A25 25 0 1 0 0 -25"
                      fill="#0800bc"></path>
                </g>
              </g>
            </g>
          </svg>
          <span>加载中...</span>
        </div>
      </div>
      <Empty v-if="status===2" class="ApiStatus-empty">
        <template #description>
          <template v-if="$attrs.onRetry">数据加载失败，<a @click="$emit('retry')">重试</a></template>
          <template v-else>数据加载失败</template>
        </template>
      </Empty>
      <Empty v-if="status===3" class="ApiStatus-empty"></Empty>
    </div>
    <div v-else class="echarts-el"></div>
  </div>
</template>

<script setup>
import {getCurrentInstance, markRaw, nextTick, onBeforeMount, onBeforeUnmount, ref, useAttrs, watch} from "vue";
import {Empty} from 'element-ui';

const {proxy} = getCurrentInstance();

const props = defineProps({
  status: {type: Number, default: 0},//0-加载中 1-成功 2-失败 3-无数据
  config: {type: Object, default: () => ({})}
});

const emitter = defineEmits(['finished', 'rendered']);

const echartsContainerRef = ref(null);

const resizeObserver = ref(null);

const echartsInstance = ref(null);

//添加事件监听
function addEventCallbacks() {
  props.config.eventCallbacks && props.config.eventCallbacks.forEach(event => {
    echartsInstance.value.on(event.eventName, event.target, params => {
      if (['finished', 'rendered'].includes(event.eventName)) emitter(event.eventName);
      event.callBack && event.callBack(echartsInstance.value, params);
    });
  });
}

//移除事件
function removeEventCallbacks() {//移除事件
  props.config.eventCallbacks && props.config.eventCallbacks.forEach(event => echartsInstance.value.off(event.eventName));
}

//窗口大小变化事件
function addResizeEvent() {
  resizeObserver.value = proxy.$$elementResizeObserver(echartsContainerRef.value, () => echartsInstance.value.resize());
}

function removeResizeEvent() {
  proxy.$$elementResizeUnobserve(resizeObserver.value, echartsContainerRef.value);
}

function reload() {
  echartsInstance.value.resize();
}

function setOption(isMerger = !1) {
  echartsInstance.value.setOption(props.config.option, isMerger);
}

function init() {
  console.log('EchartsContainer init', props.config)
  if (!props.config) throw new Error('echarts config未定义...');
  if (!props.config.option) throw new Error('echarts config.option未定义...');
  nextTick(() => {
    echartsInstance.value = markRaw(window['echarts'].init(echartsContainerRef.value));
    addEventCallbacks();
    addResizeEvent();
    setOption();
  })

}

watch(() => props.status, () => props.status === 1 && init());

onBeforeMount(() => {
  props.status === 1 && init()
});

onBeforeUnmount(() => {
  echartsInstance.value?.dispose();
  removeResizeEvent();
});

defineExpose({echartsContainerRef, resizeObserver, echartsInstance});
</script>

<style lang="scss" scoped>
.EchartsContainer {
  position: relative;
  width: 100%;
  height: 100%;

  .echarts-el {
    width: 100%;
    height: 100%;
  }
}

.ApiStatus {
  height: 100%;
  width: 100%;
  color: #626b7d;
}

.ApiStatus-empty {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  font-size: 16px;

  a {
    color: $main-color;
  }
}

.svg-loading {
  font-size: 0;
  vertical-align: middle;
  white-space: nowrap;
  display: inline-block;

  & > span {
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    line-height: 16px;
    margin-left: 6px;
  }

  & > svg {
    display: inline-block;
    vertical-align: middle;
  }
}
</style>
