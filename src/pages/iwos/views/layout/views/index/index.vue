<template>
  <div class="container">
    <el-collapse v-model="recentAttention">
      <el-collapse-item name="1">
        <template slot="title">
          <div class="collapse-title">
            <div class="collapse-title-name">通知公告</div>
            <div> {{ recentAttention[0] == 1 ? '折叠' : '展开' }} </div>
          </div>
        </template>
        <el-row :gutter="24">
          <el-col :span="6" v-for="item in recentAttentionlist" :key="item.noticeId" style="margin-bottom: 10px;">
            <el-card shadow="never" style="border: 1px solid #dcdfec;">
              <div class="container-title">{{ item.noticeTitle }}</div>
              <div style="padding: 10px 0;">
                {{ item.noticeText }}
              </div>
              <div class="card-container">
                <div style="display: flex; align-items: center">
                  <el-avatar size="small" src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                  <span style="margin-left: 5px;">{{ item.createBy }}</span>
                </div>
                <div> {{ item.createTime }}</div>
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
        <div v-for="item in serviceCasesList" :key="item.noticeId">
          <div style="display: flex;">
            <div style="display: flex;margin-right: 40px;">
              <div>
                <el-avatar src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
              </div>
              <div style="margin-left: 10px;">
                <div>{{ item.createBy }}</div>
                <div>{{ item.createTime }}</div>
              </div>
            </div>
            <div style="width: 85%;">
              <div class="container-title"> {{ item.noticeTitle }}</div>
              <div class="serviceCases-ellipsis">
                {{ item.noticeText }}
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
const recentAttention = ref(['1'])
const serviceCases = ref('1')
const recentAttentionlist=ref([])
const serviceCasesList=ref([])
async function getStagingList(noticeType){
  const {res,err} = await proxy.$$api.staging.workbench({params:{pageNum:1,pageSize:8,noticeType}})
  console.log('res',res);
    if(err) return 
    if(noticeType==1){
      recentAttentionlist.value=res.rows
    }else{
      serviceCasesList.value=res.rows
    }
 }
onMounted(() => {
  getStagingList(1)
  getStagingList(2)
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
