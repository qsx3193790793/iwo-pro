<template>
  <div class="main-container">
    <div>页面走丢了，请返回再试次~</div>
  </div>
</template>
<script>
export default {name: 'Err404'}
</script>
<style scoped lang="scss">
.main-container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  background: linear-gradient(#2258ec 0, #3b69e8 30%, #fff 70%);
  height: 100vh;

  div {
    margin-top: 20px;
    text-align: center;
    font-size: 14px;
    color: #5b5b5b;
    width: 100%;
    font-weight: 500;
  }

  img {
    width: 800px;
    margin-top: 120px;
  }
}

</style>
