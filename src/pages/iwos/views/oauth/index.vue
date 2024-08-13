<template>
  <div v-loading="loading" :element-loading-text="text" class="auth"></div>
</template>

<script setup>
import Vue, {getCurrentInstance, onBeforeMount, ref} from "vue";

const {proxy} = getCurrentInstance();

const text = ref('认证中...');

const loading = ref(true);

// 1000：首页；1001：建单页面
const redirectUrlMap = {'1000': 'Index', '1001': 'ComplaintDetail'};

async function ssoAuth() {
  const token = proxy.$store.getters['user/GET_TOKEN'];
  const p = proxy.$route.query.p, json = JSON.parse(proxy.$route.query.p ? decodeURIComponent(proxy.$route.query.p) : 'null');
  if (token) return proxy.$router.push({name: redirectUrlMap[json?.para?.redirectUrl || '1000'] || 'Index'});
  if (!p) return text.value = '认证失败', proxy.$$Toast({message: `认证失败`, type: 'error'}), proxy.$router.replace({name: 'Login'});
  proxy.$store.dispatch("user/DO_LOGIN", {isSsoAuth: !0, p})
      .then(redirectUrl => {
        proxy.$store.dispatch("user/DO_GET_USERINFO").then(() => {
          proxy.$router.push({name: redirectUrlMap[redirectUrl || '1000'] || 'Index'});
        })
      }).catch(() => {
    text.value = '认证失败', proxy.$$Toast({message: `认证失败`, type: 'error'});
    proxy.$router.replace({name: 'Login'});
  });
}

onBeforeMount(() => ssoAuth());
</script>

<style lang="scss" scoped>
.auth {
  height: 100vh;
  background-size: cover;
  background-image: url(../../../../assets/images/login/login_background.png);
}
</style>
