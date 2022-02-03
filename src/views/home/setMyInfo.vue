<template>
  <div id="setMyInfo">
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <span class="title">修改个人信息</span>
        </div>
      </div>
      <div class="content">
        <div class="headImgBox">
          <img v-if="userform.icon!=null&&userform.icon!=''" :src="userform.icon.includes('http')?`${userform.icon}`:`${base}${userform.icon}`" alt />
          <img v-else :src="base+'5e854df475555a299c397de5'" alt />
        </div>
        <el-button type="text" @click="cutVisible=true">上传头像</el-button>
        <el-form :model="userform" ref="userform" label-width="110px" class="changeInfo">
          <el-form-item label="用户名">{{userform.username}}</el-form-item>
          <el-form-item label="用户姓名">
            <el-input v-model="userform.nickName"></el-input>
          </el-form-item>
          <el-form-item label="电话号码">
            <el-input v-model="userform.phone"></el-input>
          </el-form-item>
          <el-form-item label="旧密码">
            <el-input v-model="updatepassword.password"></el-input>
          </el-form-item>
          <el-form-item label="新密码">
            <el-input v-model="updatepassword.newPassword"></el-input>
          </el-form-item>
          <div class="submit">
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </div>
        </el-form>
        <el-dialog :visible.sync="cutVisible">
          <head-cut returnType="file" @cancel="cutVisible=false" @enter="(value)=>{uploadCut(value)}"></head-cut>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>
<script>
import { uploadFileOss } from "../../api/fileSever";
import headCut from "../../components/headCutting";
import { getUserMe, updateUserMe, updateUserPassword } from "../../api/permission";
export default {
  data() {
    return {
      userform: {
        username: "",
        nickName: "",
        phone: "",
        icon: "",
        id: ""
      },
      updatepassword: {
        username: "",
        password: "",
        newPassword: ""
      },
      cutVisible: false,
      base: ""
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
    if (this.$store.state.userinfo.sysUser) {
      this.userform.username = this.$store.state.userinfo.sysUser.username;
      this.updatepassword.username = this.$store.state.userinfo.sysUser.username;
      this.userform.nickName = this.$store.state.userinfo.sysUser.nickName;
      this.userform.phone = this.$store.state.userinfo.sysUser.phone;
      this.userform.icon = this.$store.state.userinfo.sysUser.icon;
      this.userform.id = this.$store.state.userinfo.sysUser.id;
    } else {
      getUserMe().then(data => {
        if (data.data.status == 200) {
          this.userform.username = data.data.content.sysUser.username;
          this.updatepassword.username = data.data.content.sysUser.username;
          this.userform.nickName = data.data.content.sysUser.nickName;
          this.userform.phone = data.data.content.sysUser.phone;
          this.userform.icon = data.data.content.sysUser.icon;
          this.userform.id = data.data.content.sysUser.id;
        }
      });
    }
  },
  methods: {
    submitForm() {
      if (this.updatepassword.password != "" && this.updatepassword.newPassword != "") {
        if (this.updatepassword.password != this.updatepassword.newPassword) {
          updateUserPassword(this.updatepassword).then(data => {
            if (data.data.status == 200) {
              this.$message({ type: "success", message: "修改密码成功" });
            }
          });
        } else {
          this.$message.error("新密码不能与原密码一样");
        }
      }
      updateUserMe(this.userform).then(data => {
        if (data.data.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.$store.commit("GETLOGIN", data.data.content);
          this.$router.push("/");
        } else {
          this.$message.error("修改失败");
        }
      });
    },
    uploadCut(value) {
      uploadFileOss(value).then(data => {
        if (data.data.state == "Success") {
          this.userform.icon = data.data.content[0].url;
          this.$message({
            type: "success",
            message: "上传成功"
          });
          this.$message("上传成功", "success");
          this.cutVisible = false;
        } else {
          this.$message("上传失败", "error");
        }
      });
    }
  },
  components: { headCut }
};
</script>
<style lang="less">
#setMyInfo {
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
        }
      }
    }
    .el-card__body {
      .content {
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        .uploadHead {
          width: 200px;
          height: 200px;
        }
        .changeInfo {
          width: 500px;
          margin-top: 15px;
          .submit {
            display: flex;
            justify-content: center;
          }
        }
        .headImgBox {
          height: 190px;
          width: 190px;
          border-radius: 50%;
          border: 1px solid #ccc;
          overflow: hidden;
          margin-bottom: 10px;
          img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>