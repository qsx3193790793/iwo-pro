<template>
  <el-form ref="form" :model="user" :rules="rules" label-width="80px">
    <el-form-item label="旧密码" prop="oldPassword">
      <el-input v-model="user.oldPassword" placeholder="请输入旧密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input v-model="user.newPassword" placeholder="请输入新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item label="确认密码" prop="confirmPassword">
      <el-input v-model="user.confirmPassword" placeholder="请确认新密码" type="password" show-password/>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" size="small" @click="submit">保存</el-button>
      <!--      <el-button type="danger" size="small" @click="close">关闭</el-button>-->
    </el-form-item>
  </el-form>
</template>

<script>

import {$$validator} from "@/utils";

export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    const complexPW = (rule, value, callback) => {
      if (this.$$validator.isPwd(value)) {
        callback();
      } else {
        callback(new Error("密码为8到16位数字、小写字母、大写字母、特殊符号4类中的3类组合"));
      }
    };
    return {
      user: {
        oldPassword: undefined,
        newPassword: undefined,
        confirmPassword: undefined
      },
      // 表单校验
      rules: {
        oldPassword: [
          {required: true, message: "旧密码不能为空", trigger: "blur"}
        ],
        newPassword: [
          {required: true, message: "新密码不能为空", trigger: "blur"},
          {validator: complexPW, trigger: "blur"},
        ],
        confirmPassword: [
          {required: true, message: "确认密码不能为空", trigger: "blur"},
          {required: true, validator: equalToPassword, trigger: "blur"},
          {validator: complexPW, trigger: "blur"},
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.$$api.user.updateUserPwd({
            params: {
              oldPassword: this.$$encrypt(this.user.oldPassword.trim()),
              newPassword: this.$$encrypt(this.user.newPassword.trim()),
            }
          }).then(({res, err}) => {
            if (err) return;
            this.$$Toast.success("修改成功");
          });
        }
      });
    },
    // close() {
    // this.$tab.closePage();
    // }
  }
};
</script>
