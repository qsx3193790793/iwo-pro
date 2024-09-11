<template>
  <div class="login">
    <div class="login_title">
      <img src="../../../../assets/images/login/logo.png" alt="" class="img">
    </div>
    <el-form ref="loginForm" size="large" :model="loginForm" :rules="loginRules" class="login-form">
      <h3 class="title">智慧客服工单系统</h3>
      <el-form-item prop="username">
        <el-input v-model="loginForm.username" type="text" auto-complete="off" placeholder="请输入账号" :maxlength="30">
          <!--          <svg-icon slot="prefix" icon-class="user" class="el-input__icon input-icon"/>-->
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input v-model="loginForm.password" type="password" auto-complete="off" placeholder="请输入密码" :maxlength="30" @keyup.enter.native="handleLogin">
          <!--          <svg-icon slot="prefix" icon-class="password" class="el-input__icon input-icon"/>-->
        </el-input>
      </el-form-item>
      <el-form-item prop="code" v-if="captchaEnabled">
        <div class="VerificationCode">
          <el-input v-model="loginForm.code" auto-complete="off" placeholder="验证码" :maxlength="30" @keyup.enter.native="handleLogin">
            <!--            <svg-icon slot="prefix" icon-class="validCode" class="el-input__icon input-icon"/>-->
          </el-input>
          <div class="login-code">
            <img :src="codeUrl" @click="getCode" class="login-code-img" alt=""/>
          </div>
        </div>

      </el-form-item>
      <!--      <el-checkbox v-model="loginForm.rememberMe" style="margin:0px 0px 25px 0px;">记住密码</el-checkbox>-->
      <el-form-item style="width:100%;">
        <el-button :loading="loading" size="medium" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
          <span v-if="!loading">登 录</span>
          <span v-else>登 录 中...</span>
        </el-button>
        <!--        <div style="float: right;" v-if="register">-->
        <!--          <router-link class="link-type" :to="'/register'">立即注册</router-link>-->
        <!--        </div>-->
      </el-form-item>
    </el-form>
    <!-- <div class="login_user">
      <img src="../../../../assets/images/login/logo_user_icon.png" alt="" class="img">
    </div> -->
    <!--  底部  -->
    <!--    <div class="el-login-footer">-->
    <!--      <span>Copyright © xxxxxxxxxx All Rights Reserved.</span>-->
    <!--    </div>-->
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      codeUrl: "",
      loginForm: {
        username: process.env.NODE_ENV === "development" ? "hb_admin" : '',
        password: process.env.NODE_ENV === "development" ? "Iwos@240708" : '',
        rememberMe: false,
        code: "",
        uuid: ""
      },
      loginRules: {
        username: [
          {required: true, trigger: "blur", message: "请输入您的账号"}
        ],
        password: [
          {required: true, trigger: "blur", message: "请输入您的密码"}
        ],
        code: [{required: true, trigger: "change", message: "请输入验证码"}]
      },
      loading: false,
      // 验证码开关
      captchaEnabled: true,
      // 注册开关
      // register: false,
      redirect: undefined
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true
    }
  },
  created() {
    this.getCode();
    // this.getCookie();
  },
  methods: {
    getCode() {
      this.$$api.login.getCodeImg({params: {_t: +new Date()}}).then(({res, err}) => {
        console.log("res:", res)
        if (err) return;
        this.captchaEnabled = res.captchaEnabled === undefined ? true : res.captchaEnabled;
        if (this.captchaEnabled) {
          this.codeUrl = "data:image/gif;base64," + res.img;
          this.loginForm.uuid = res.uuid;
        }
      });
    },
    // getCookie() {
    //   const username = Cookies.get("username");
    //   const password = Cookies.get("password");
    //   const rememberMe = Cookies.get('rememberMe')
    //   this.loginForm = {
    //     username: username === undefined ? this.loginForm.username : username,
    //     password: password === undefined ? this.loginForm.password : decrypt(password),
    //     rememberMe: rememberMe === undefined ? false : Boolean(rememberMe)
    //   };
    // },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // if (this.loginForm.rememberMe) {
          // Cookies.set("username", this.loginForm.username, {expires: 30});
          // Cookies.set("password", encrypt(this.loginForm.password), {expires: 30});
          // Cookies.set('rememberMe', this.loginForm.rememberMe, {expires: 30});
          // } else {
          // Cookies.remove("username");
          // Cookies.remove("password");
          // Cookies.remove('rememberMe');
          // }
          this.$store.dispatch("user/DO_LOGIN", this.loginForm)
              .then(() => this.$store.dispatch("user/DO_GET_USERINFO"))
              .then(() => this.$router.push({name: this.redirect || "Index"}))
              .catch(() => {
                this.loading = false;
                if (this.captchaEnabled) {
                  this.getCode();
                }
              });
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100vh;
  background-size: cover;
  background-image: url(../../../../assets/images/login/login_background.png);
  position: relative;

  .login_title {
    position: fixed;
    top: 40px;
    left: 40px;

    .img {
      height: 40px;
    }
  }

  .login_user {
    position: fixed;
    bottom: 40px;
    right: 80px;

    .img {
      height: 20vw;
    }
  }
}

.title {
  margin: 30px auto 70px auto;
  text-align: center;
  color: #707070;
  font-weight: 600;
  font-size: 34px;
  letter-spacing: 1px;
}

.login-form {
  margin-right: 200px;
  border-radius: 6px;
  // background: #ffffff;
  width: 600px;
  padding: 40px 60px;
  background-image: linear-gradient(to bottom, #FFFFFF, #FFFFFF, #DFE7FC);
  box-sizing: border-box;

  .el-input {
    height: 38px;

    input {
      height: 38px;
    }
  }

  .el-input__inner {
    background-color: #F5FBFE;
    color: #409DFE;

    padding-left: 15px;
  }

  .input-icon {
    height: 39px;
    width: 14px;
    margin-left: 2px;
  }
}

.login-tip {
  font-size: 13px;
  text-align: center;
  color: #bfbfbf;
}

.VerificationCode {
  position: relative;
}

.login-code {
  width: 33%;
  height: 40px;

  position: absolute;
  right: 0;
  top: 0;

  img {
    cursor: pointer;
    vertical-align: middle;
    float: right;
  }
}

.el-login-footer {
  height: 40px;
  line-height: 40px;
  position: fixed;
  bottom: 0;
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 12px;
  letter-spacing: 1px;
}

.login-code-img {
  height: 40px;
}

::v-deep(.el-form-item.el-form-item--large) {
  margin-bottom: 32px;
}
</style>
