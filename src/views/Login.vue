<template>
   <div class="login-container">
    <el-form ref="loginForm" :model="user" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <h3 class="title">测试BUG排行</h3>
      </div>

      <el-form-item prop="username">
        <span class="svg-container">
          <i class="el-icon-user-solid" style="font-size:18px;"></i>
        </span>
        <el-input
          ref="username"
          v-model="user.username"
          placeholder="用户名"
          name="username"
          type="text"
          tabindex="1"
        />
      </el-form-item>

      <el-form-item prop="password">
          <span class="svg-container">
            <i class="el-icon-lock" style="font-size:18px;"></i>
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="user.password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            @keyup.enter.native="login"
          />
        </el-form-item>
      <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="login">登录</el-button>
    </el-form>
  </div>
</template>
<script>
import * as cookies from '@/util/cookies'
import * as accountApi from '@/api/account'

export default {
  name: 'Login',
  data() {
    return {
      user: {},
      loginRules: {
        username: [{ required: true, trigger: 'blur', message: '用户名不能为空' }],
        password: [{ required: true, trigger: 'blur', message: '密码不能为空' }]
      },
      passwordType: 'password',
    }
  },
  mounted() {
    //给window对象绑定keydown事件
    window.addEventListener('keydown', this.keyDown)
  },
  //Vue生命周期销毁钩子
  destroyed() {
    //给window对象移除keydown事件
    window.removeEventListener('keydown', this.keyDown, false)
  },
  methods: {
    login() {
      accountApi.login(this.user).then((response) => {
        let responseData = response.data
        if (responseData.code == 0) {
          //登录成功，将当前登录成功返回的用户关联信息保存到cookies
          //1、设置cookies
          cookies.setCurrentUser(responseData.data)
          //2、成功提示
          this.$message({
            message: '登录成功。',
            type: 'success',
          })
          //3、跳转到首页或原来cookies到期所在页
          let redirect = '/'
          if (this.$route.query.redirect != undefined) {
            redirect = this.$route.query.redirect
          }
          this.$router.push(redirect)
        } else {
          //登录失败，提示返回的错误信息
          this.$alert(responseData.message, '错误', {
            confirmButtonText: '确定',
            callback: () => {
              return
            },
          })
        }
      })
    },
    keyDown(e) {
      //如果按下的是回车键，直接登录
      if (e.keyCode == 13) {
        this.login()
      }
    },
  },
}
</script>
<style scoped>
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #eee;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #2d3a4b inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
}

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }

  .login-container {
  min-height: 100%;
  width: 100%;
  background-color: #2d3a4b;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: #889aa4;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: #eee;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: #889aa4;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}


.box-card {
  width: 300px;
  margin-left: 40vw;
  margin-top: 20vh;
  background-color: #e9eef3;
  padding-right: 60px;
  padding-bottom: 5px;
}

</style>