<template>
  <div class="one-screen">
    <ELScrollbar>
      <el-collapse v-model="recentAttention">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="collapse-title">
              <div class="collapse-title-name" @click.stop="more('1')">
                通知公告
                <el-badge class="mark" :value="recentAttentionTotal" v-if="recentAttentionTotal"/>
                <i
                    class="el-icon-arrow-right"></i>
              </div>
              <div> {{ recentAttention[0] == 1 ? '折叠' : '展开' }} </div>
            </div>
          </template>
          <el-row :gutter="24" v-if="recentAttentionlist?.length > 0">
            <el-col :span="6" v-for="item in recentAttentionlist" :key="item.noticeId" style="margin-bottom: 10px;">
              <el-card shadow="never" style="border: 1px solid #dcdfec;">
                <div class="container-title" @click="detail(item.noticeId)">{{ item.noticeTitle }}</div>
                <div class="container-text text-ellipsis line2">
                  {{ item.noticeText }}
                </div>
                <div class="card-container">
                  <div style="width: 50%;">
                    <!-- <el-avatar size="small"
                      src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar> -->
                    <el-tooltip class="item" effect="dark" :content="`${item.publisher}-${item.publishDeptName}`"
                                placement="top-start">
                      <div class="text-ellipsis">{{ item.publisher + '-' + item.publishDeptName }}</div>
                    </el-tooltip>
                  </div>
                  <div style="flex: 1;text-align: right;"> {{ item.createTime }}</div>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-empty v-else></el-empty>
        </el-collapse-item>
      </el-collapse>

      <el-collapse v-model="serviceCases" style="margin-top: 20px;">
        <el-collapse-item name="1">
          <template slot="title">
            <div class="collapse-title">
              <div class="collapse-title-name" @click.stop="more('2')">
                服务案例
                <el-badge class="mark" :value="serviceCasesTotal" v-if="serviceCasesTotal"/>
                <i
                    class="el-icon-arrow-right"></i>
              </div>
              <div> {{ serviceCases[0] == 1 ? '折叠' : '展开' }} </div>
            </div>
          </template>
          <template v-if="serviceCasesList?.length > 0">
            <div v-for="item in serviceCasesList" :key="item.noticeId">
              <div style="display: flex;">
                <div style="display: flex;margin-right: 40px;flex: 1;">
                  <!-- <div>
                    <el-avatar src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"></el-avatar>
                  </div> -->
                  <div>
                    <div style="margin-bottom: 5px;">{{ item.publisher + '-' + item.publishDeptName }}</div>
                    <div>{{ item.createTime }}</div>
                  </div>
                </div>
                <div style="width: 85%;">
                  <div style="margin-bottom: 5px;" class="container-title" @click="detail(item.noticeId)"> {{
                      item.noticeTitle
                    }}</div>
                  <div class="serviceCases-ellipsis">
                    {{ item.noticeText }}
                  </div>
                </div>
              </div>
              <el-divider></el-divider>
            </div>
          </template>
          <el-empty v-else></el-empty>
        </el-collapse-item>
      </el-collapse>
      <MoreNotice v-if="isShowAddDialog" v-model="isShowAddDialog" :noticeType="noticeType"></MoreNotice>
      <DetailDialog v-if="showDetailDialog" v-model="showDetailDialog" :noticeId="noticeId"></DetailDialog>
    </ELScrollbar>
  </div>
</template>

<script setup>
import {getCurrentInstance, ref, onMounted} from "vue";
import MoreNotice from './more/index.vue'
import DetailDialog from './detail/index.vue'

const {proxy} = getCurrentInstance();
const recentAttention = ref(['1'])
const serviceCases = ref('1')
const recentAttentionlist = ref([])
const recentAttentionTotal = ref(0)
const serviceCasesTotal = ref(0)
const serviceCasesList = ref([])
const isShowAddDialog = ref(false)
const noticeType = ref(null)
const showDetailDialog = ref(false)
const noticeId = ref(null)

async function getStagingList(noticeType) {
  const {res, err} = await proxy.$$api.staging.workbench({params: {pageNum: 1, pageSize: 8, noticeType}})
  if (err) return
  if (noticeType == 1) {
    recentAttentionlist.value = res.rows
    recentAttentionTotal.value = res.total
  } else {
    serviceCasesList.value = res.rows
    serviceCasesTotal.value = res.total
  }
}

function more(val) {
  noticeType.value = val
  isShowAddDialog.value = true
}

function detail(val) {
  noticeId.value = val
  showDetailDialog.value = true
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
  cursor: pointer;
}

.container-text {
  margin: 15px 0;
  width: 80%;
  line-height: 21px;
  height: 42px;
  // overflow: hidden;
  // text-overflow: ellipsis;
  // white-space: nowrap;
}

.card-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 0.75;
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

.one-screen {
  border-radius: 6px;
}
</style>
