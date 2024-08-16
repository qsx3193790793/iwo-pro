<template>
  <div class="user">
    <div class="userModel">
      <div class="tipText" :style="{ visibility: userProfile.birthdayFlag ? 'visible' : 'hidden' }">
        <i class="circle"></i> 今日生日
      </div>
      <img ref="" :src="userProfile.gender=='0'?womanImage:manImage" alt="" class="userImg"/>
      <template v-for="(item,i) in tagList">
        <div v-if="item.v&&item.v!=='-'" :key="i" :style="item.style" class="imgCss">
          {{ item.v }}
        </div>
      </template>
    </div>
  </div>
</template>
<script setup>
import {ref, onMounted, watch, computed} from "vue";
import manImage from '@assets/images/sex-1.png';
import womanImage from '@assets/images/sex-0.png';

const props = defineProps({
  userProfile: {
    type: Object,
    default: function () {
      return {
        birthdayFlag: false, //true 显示；false 隐藏
        gender: 0, //性别
        tagList: [],
      };
    },
  },
});
const leftHalfCirclePoints = [
  {right: '3.6rem', bottom: '0.2rem'},
  {right: '3.2rem', bottom: '0.7rem'},
  {right: '2.6rem', top: '0rem'},
  {left: '2.6rem', top: '0rem'},
  {left: '3.2rem', bottom: '0.7rem'},
  {left: '3.6rem', bottom: '0.2rem'},
];
const tagList = computed(() => {
  return props.userProfile.tagList.map((v, i) => ({v, style: leftHalfCirclePoints[i]}));
})
// watch(
//     () => props.userProfile,
//     (n) => {
//       console.log("props", n);
//       //借用宏任务，微任务实现异步操作
//       setTimeout(() => {
//         setPoint();
//       }, 0);
//
//     },
//     {
//       deep: true,
//     }
// );

// function getPointsOnLeftHalfCircleWithOffset(radius, numPoints) {
//   let points = [];
//   let angleIncrement = Math.PI / numPoints; // 角度增量
//
//   for (let i = 0; i < numPoints; i++) {
//     let angle = Math.PI + i * angleIncrement; // 计算每个点的角度
//     let x = radius * Math.cos(angle) + 110; // 使用余弦函数计算x坐标并加上偏移
//     let y = radius * Math.sin(angle) + 140; // 使用正弦函数计算y坐标并加上偏移
//
//     points.push({x: x, y: y});
//   }
//   return points;
// }

// onMounted(() => {
// 调用函数，获取左半圆上的10个点，带有最大偏移量为10的随机偏移
// let leftHalfCirclePoints = getPointsOnLeftHalfCircleWithOffset(140, 7);
// console.log(leftHalfCirclePoints);
// });
// const setPoint = () => {
//   let leftHalfCirclePoints = [
//     {right: '3.6rem', bottom: '0.2rem'},
//     {right: '3.2rem', bottom: '1.2rem'},
//     {right: '3.2rem', bottom: '1.2rem'},
//     {right: '3.2rem', bottom: '1.2rem'},
//     {right: '3.2rem', bottom: '1.2rem'},
//     {right: '3.2rem', bottom: '1.2rem'},
//   ];
//   let target = document.getElementsByClassName("imgCss");
//   if (target && target.length > 0) {
//     for (let i = 0; i <= 10; i++) {
//       if (target[i]) {
//         target[i].style.left = leftHalfCirclePoints[i + 1].x / 100 + "rem";
//         target[i].style.top = leftHalfCirclePoints[i + 1].y / 100 + "rem";
//       }
//     }
//   }
// };
</script>
<style lang="scss" scoped>
.user {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.imgCss {
  position: absolute;
  font-size: 12px;
  padding: 5px 6px;
  background-color: #ffffff;
  border-radius: 10%;
  // cursor: pointer;
}

.tipText {
  position: absolute;
  right: 0px;
  top: -10px;
  background-color: #fbb8ba;
  font-size: 13px;
  padding: 3px 12px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;

  .circle {
    margin-right: 6px;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background-color: #ffffff;
  }
}

.userModel {
  width: 100%;
  padding: 40px;
  padding-bottom: 10px;
  position: relative;
  text-align: center;

  .userImg {
    width: 180px !important;
  }
}
</style>
