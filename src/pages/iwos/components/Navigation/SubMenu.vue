<template>
  <el-submenu :index="$attrs.menu.name" :data-index="$attrs.menu.name" :data-active="$route.name">
    <template slot="title">
      <i v-if="$attrs.menu.meta?.icon" class="iconfont" :class="$attrs.menu.meta.icon"></i>
      <span>{{ $attrs.menu.meta.title }}</span>
    </template>
    <template v-for="(v,i) in $attrs.menu.children">
      <SubMenu v-if="v.children?.length" :key="v.name" :menu="v"></SubMenu>
      <el-menu-item v-else :index="v.name" :data-index="v.name" :data-active="$route.name">
        <i v-if="v.meta?.icon" class="iconfont" :class="v.meta.icon"></i>
        <span slot="title">{{ v.meta.title }}</span>
      </el-menu-item>
    </template>
  </el-submenu>
</template>
<script setup>
import SubMenu from "./SubMenu";
import {getCurrentInstance} from "vue";

const {proxy} = getCurrentInstance();

</script>
<script>
export default {name: 'SubMenu'}
</script>
<style lang="scss" scoped>
</style>
