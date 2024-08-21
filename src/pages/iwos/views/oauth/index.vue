<template>
  <div v-loading="loading" :element-loading-text="text" class="auth"></div>
</template>

<script setup>
import Vue, {getCurrentInstance, onBeforeMount, ref} from "vue";

const {proxy} = getCurrentInstance();

const text = ref('认证中...');

const loading = ref(true);

async function getBizData(p) {
  const {res, err} = await proxy.$$api.login.getBizData({params: {p}});
  proxy.$router.push({name: 'ComplaintCreate', query: {p: res ? JSON.stringify(res) : null}});
}

async function ssoAuth() {
  // {"msgId":"11001","timestamp":1722995664941,"para":{"ticket":"1001","clientId":"001","redirectUrl":"1001","staff":"admin","lanId":"8130100","sign":"08256ba1","bizData":{"callId":"5446543212321","callerNum":"18931177956","accNum":"18931177956","location":"8130100","phenomenonCode":"20205","prodCode":"51010","channelCode":"100101"}}}
  const token = proxy.$store.getters['user/GET_TOKEN'];
  const p = proxy.$route.query.p, json = JSON.parse(proxy.$route.query.p ? decodeURIComponent(proxy.$route.query.p) : 'null');
  if (token) {
    const redirectUrl = json?.para?.redirectUrl;
    if (redirectUrl == '1000') return proxy.$router.push({name: 'Index'});
    if (redirectUrl == '1001') return getBizData(p);
  }
  if (!p) return text.value = '认证失败', proxy.$$Toast({message: `认证失败`, type: 'error'}), proxy.$router.replace({name: 'Login'});
  proxy.$store.dispatch("user/DO_LOGIN", {isSsoAuth: !0, p})
      .then(redirectUrl => {
        proxy.$store.dispatch("user/DO_GET_USERINFO").then(() => {
          if (redirectUrl == '1000') return proxy.$router.push({name: 'Index'});
          if (redirectUrl == '1001') return getBizData(p);
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
