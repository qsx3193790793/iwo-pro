<template>
  <div class="container">
    <el-collapse v-model="recentAttention">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">
            <div class="collapse-title-name">近期关注</div>
            <div> {{ recentAttention[0] == 1 ? '折叠' : '展开' }} </div>
          </div>
        </template>
        <el-row :gutter="24">
          <el-col :span="6" v-for="item in new Array(8)" :key="item" style="margin-bottom: 10px;">
            <el-card shadow="never" style="border: 1px solid #dcdfec;">
              <div class="container-title">标题</div>
              <div style="padding: 10px 0;">
                心中无敌，方能无敌于天下
              </div>
              <div class="card-container">
                <div style="display: flex; align-items: center">
                  <el-avatar size="small" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                  <span style="margin-left: 5px;">元顺</span>
                </div>
                <div> 2024/12/12 10:10:10</div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </el-collapse-item>
    </el-collapse>

    <el-collapse v-model="serviceCases" style="margin-top: 20px;">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">
            <div class="collapse-title-name">服务案例</div>
            <div> {{ serviceCases[0] == 1 ? '折叠' : '展开' }} </div>
          </div>
        </template>
        <div v-for="item in new Array(8)" :key="item">
          <div style="display: flex;">
            <div style="display: flex;margin-right: 40px;">
              <div>
                <el-avatar src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
              </div>
              <div style="margin-left: 10px;">
                <div>晁盖</div>
                <div>2024/12/12 12:12:12</div>
              </div>
            </div>
            <div style="width: 85%;">
              <div class="container-title"> 2023年，你过得怎么样？</div>
              <div class="serviceCases-ellipsis">
                与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。
              </div>
            </div>
          </div>
          <el-divider></el-divider>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, onMounted} from "vue";

const {proxy} = getCurrentInstance();
// class asew {
//   constructor() {
//     this.a = 66
//   }

//   log() {
//     console.log('aaaaaaaaaa')
//   }
// }

// (new asew()).log()
const recentAttention = ref(['1'])
const serviceCases = ref('1')
onMounted(() => {

})
</script>
<script>
export default {name: 'Index'}
</script>
<style lang="scss" scoped>
$collapse_colorrgb: rgb(237, 244, 254);

::v-deep {
  .el-collapse-item__header {
    background-color: $collapse_colorrgb;
    border-radius: 5px 5px 0 0;
    padding: 30px 25px;
    color: #329cfe;
    font-size: 16px;
  }

  .el-collapse-item__wrap {
    padding: 10px 25px;
    background-color: $collapse_colorrgb;
    border-radius: 0 0 5px 5px;
    font-size: 16px;
  }
}

.container-title {
  font-size: 14px;
  font-weight: bold;
}

.card-container {
  display: flex;
  justify-content: space-between;
  align-items: center
}

.collapse-title {
  display: flex;
  justify-content: space-between;
  width: 100%;

  &-name {
    color: #2c2e34;
    font-weight: bold;
  }
}

.serviceCases-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
