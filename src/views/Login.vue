<template>
  <div id="log">
    <div class="wrap">
      <div class="content_wrap">
        <el-col :xs="24" :sm="16" :md="12" :lg="8" class="content">
          <div class="logo_title">
            <img src="../../public/img/logo-signin.png" alt />
            <p>涂邦之家后台管理</p>
          </div>
          <el-form :model="userinfo" status-icon :rules="rules" ref="userinfo">
            <el-form-item label="用户名">
              <el-input type="text" v-model="userinfo.username" autocomplete="off" placeholder="请输入用户名"></el-input>
            </el-form-item>
            <el-form-item label="密码">
              <el-input
                type="password"
                v-model="userinfo.password"
                autocomplete="off"
                placeholder="请输入密码"
                @keyup.native.enter="submitForm('userinfo')"
              ></el-input>
            </el-form-item>
            <el-form-item class="forget">
              <div>
                <el-switch disabled v-model="userinfo.rememberMe"></el-switch>
                <span>7天内自动登录?</span>
              </div>
              <div>
                <a href>忘记密码？</a>
              </div>
            </el-form-item>
            <el-form-item class="btnitem">
              <el-col :xs="24" :sm="12" :md="8" :lg="8">
                <el-button type="primary" @click="submitForm('userinfo')" class="btn">登录</el-button>
              </el-col>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </div>
  </div>
</template>

<script>
import { getLogin } from "../api/log";
export default {
  data() {
    return {
      delivery: false,
      userinfo: {
        username: "",
        password: "",
        rememberMe: false
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 4, max: 10, message: "长度在 4 到 10 个字符", trigger: "blur" }
        ]
      }
    };
  },
  mounted() {
    this.$route.query.type == "reLogin" && this.$message.error("请重新登录");
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          getLogin(this.userinfo).then(data => {
            if (data.data.status == 200) {
              localStorage.setItem("reqHeaders", data.data.content.Authorization);
              localStorage.setItem("loginState", "true");
              this.$route.query.type == "reLogin" && window.close();
              this.$router.push("/");
              this.$message({ message: "登录成功", type: "success" });
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang='less'>
.flex_a() {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
}
#log {
  height: 100%;
  width: 100%;
  .flex_a;
  align-items: center;
  background-color: #f5f5f5;
  .wrap {
    // margin-top: -50px;
    width: 100%;
    min-width: 375px;
    height: 520px;
    background-color: white;
    .flex_a;
    justify-content: center;
    align-items: center;
    .content_wrap {
      .flex_a;
      justify-content: center;
      align-items: center;
      margin: 0px 15px 0px 15px;
      width: 100%;
      height: 500px;
      max-width: 1250px;
      .content {
        height: 460px;
        margin: 15px 0 25px 0;
        .flex_a;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        .logo_title {
          text-align: center;
          p {
            margin-top: 15px;
            margin-bottom: 30px;
          }
        }
        form.el-form {
          width: 100%;
          .el-form-item__content::before,
          .el-form-item__content::after {
            display: none !important;
            content: "";
          }
          .el-form-item__label {
            font-size: 13px;
            font-weight: 600;
          }
          .el-form-item.forget {
            .el-form-item__content {
              .flex_a;
              justify-content: space-between;
            }
          }
          .el-form-item.btnitem {
            .el-form-item__content {
              .flex_a;
              justify-content: center;
            }
          }
          .btn {
            width: 100%;
          }
        }
      }
    }
  }
}
</style>
