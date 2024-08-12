<template>
  <div class="main-container">
    工作台
  </div>
</template>

<script setup>
import {getCurrentInstance, ref} from "vue";

class asew {
  constructor() {
    this.a = 66
  }

  log() {
    console.log('aaaaaaaaaa')
  }
}

(new asew()).log()

const {proxy} = getCurrentInstance();
</script>
<script>
export default {name: 'Index'}
</script>
<style lang="scss" scoped>
</style>
