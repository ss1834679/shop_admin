<template>
  <div id="addAlter">
    <!-- 会员的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.params.data">修改会员</span>
          <span class="title" v-else>添加会员</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="userform" ref="userform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="用户名">
            <el-input v-model="userform.userName"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="userform.nickname"></el-input>
          </el-form-item>
          <el-form-item label="真实姓名">
            <el-input v-model="userform.realname"></el-input>
          </el-form-item>
          <el-form-item label="后台备注">
            <el-input v-model="userform.remark"></el-input>
          </el-form-item>
          <el-form-item label="会员头像">
            <upload-img
              @getimgArr="(imgarr)=>{this.userform.avatar = imgarr}"
              :imgArr="this.userform.avatar"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="userform.gender">
              <el-radio :label="'1'">男</el-radio>
              <el-radio :label="'2'">女</el-radio>
              <el-radio :label="'3'">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="userform.phone"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userform.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="证件类型">
            <el-radio-group v-model="userform.identityCardType">
              <el-radio :label="1">身份证</el-radio>
              <el-radio :label="2">军官证</el-radio>
              <el-radio :label="3">护照</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="证件号码">
            <el-input v-model="userform.identityCardNo"></el-input>
          </el-form-item>
          <el-form-item label="生日">
            <el-date-picker v-model="userform.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      userform: {
        id: null,
        userName: "可购买沙发保养服务" /* 用户名 */,
        avatar: "5e12ecf7a1a09a0baeb145fb" /* 会员头像 */,
        nickname: "dabnkca" /* 昵称 */,
        realname: "asgfa" /* 真实姓名 */,
        remark: "alkhfa" /* 后台人员备注的信息 */,
        phone: "12353536457" /* 电话 */,
        userEmail: "123414@qq.com" /* 邮箱 */,
        gender: "3" /* 性别 1:男 2:女 3:保密 */,
        birthday: "2011-10-23" /* 生日 */,
        identityCardType: null /* 证件类型：1 身份证 2 军官证 3 护照 */,
        identityCardNo: "12114253253456" /* 证件号码 */,
        isDelete: 0 /* 是否删除 */
      }
    };
  },
  mounted() {
    if (this.$route.params.data) {
      this.userform = this.$route.params.data;
      console.log(this.$route.params.data);
    }
  },
  methods: {
    submitForm() {
      if (this.$route.params.data) {
        this.userform.id = this.$route.params.data.id;
        console.log(this.$route.params.data.id);
      }
      console.log(this.userform);
      //   addProduct(this.productform).then(res => {
      //     if (res.data.status == 0) {
      //       this.$message({
      //         type: "success",
      //         message: "商品添加成功",
      //         center: true
      //       });
      //       this.$router.go(-1);
      //     }
      //   });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  //是否有富文本编辑
  components: { uploadImg }
};
</script>

<style lang='less'>
#addAlter {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      text-align: left;
      .img_box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 100px;
          height: 100px;
          margin-left: 25px;
        }
      }
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
</style>
