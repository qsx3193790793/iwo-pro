<template>
  <div class="main-container">
    <div>错误代码：{{ $route.query?.code || '500' }}</div>
  </div>
</template>
<script>
export default {name: 'NoPermission'}
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
    font-size: 32px;
    color: #fff;
    width: 100%;
    font-weight: 500;
  }

  img {
    width: 100%;
    margin-top: 120px;
  }
}

</style>
