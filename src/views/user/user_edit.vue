<template>
  <div id="addAlter">
    <!-- 编辑资料-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">编辑资料</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="userform" ref="userform" label-width="120px" class="demo-ruleForm">
          <el-form-item label="昵称：" required>
            <el-input v-model="userform.nickname"></el-input>
          </el-form-item>
          <el-form-item label="手机号码：" required>
            <el-input v-model="userform.phone"></el-input>
          </el-form-item>
          <el-form-item label="会员等级：">
            <el-select v-model="userform.levelValue" disabled placeholder="暂无此功能">
              <el-option v-for="item in levels" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="性别" required>
            <el-radio-group v-model="userform.gender">
              <el-radio :label="'1'">男</el-radio>
              <el-radio :label="'2'">女</el-radio>
              <el-radio :label="'3'">保密</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="生日" required>
            <el-date-picker v-model="userform.birthday" type="date" placeholder="选择日期"></el-date-picker>
          </el-form-item>
          <el-form-item label="城市:" required>
            <div style="display:flex">
              <div style="width:140px;">
                <el-select v-model="userform.regisAddress" placeholder="省" @change="changeProvince({level:1})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in provinceList" :key="item.id"></el-option>
                </el-select>
              </div>
              <div style="width:140px;">
                <el-select v-model="userform.reAddress" placeholder="市" @change="changeProvince({level:2})" filterable clearable>
                  <el-option :label="item.criName" :value="item.criCode" v-for="item in cityList" :key="item.id"></el-option>
                </el-select>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="职业：" required>
            <el-input v-model="userform.profession"></el-input>
          </el-form-item>
          <el-form-item label="个性签名：" required>
            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="userform.signatureInput"></el-input>
          </el-form-item>
          <el-form-item label="会员头像" required>
            <upload-img @getimgArr="(imgarr)=>{this.userform.avatar = imgarr}" :imgArr="userform.avatar" :limit="1"></upload-img>
          </el-form-item>
          <!-- <el-form-item label="新密码：">
            <el-input v-model="userform.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="确认密码：">
            <el-input v-model="userform.copyPassword" type="password"></el-input>
          </el-form-item>-->
          <el-form-item label="账户启用状态：" required>
            <el-switch v-model="switchStatus" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('userform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { userDetailPersonInfo, update_userInfo } from "../../api/user";
import { getProvinceList, getRegionList } from "../../api/usercenter";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      userform: {
        userId: "",
        nickname: "" /* 用户名 */,
        avatar: "" /* 会员头像 */,
        userName: "" /* 真实姓名 */,
        phone: "" /* 电话 */,
        gender: "" /* 性别 1:男 2:女 3:保密 */,
        birthday: "" /* 生日 */,
        profession: "" /* 职业*/,
        reAddress: "",
        regisAddress: "",
        decorationStageTitle: "",
        decorationStageContent: "",
        decorationTime: "",
        decorationWay: "",
        decorateType: "",
        villageName: "",
        decorateStyle: "",
        signatureInput: "",
        status: ""
      },
      switchStatus: true,
      provinceList: [],
      cityList: [],
      levels: [{ value: "暂无此功能", label: "暂无此功能" }],
      switchValue: true
    };
  },
  mounted() {
    if (this.$route.query.id) {
      userDetailPersonInfo({
        user_id: this.$route.query.id
      }).then(data => {
        this.userform = data.data.data;
      });
    }
    /**
     * 获取省直辖市地址列表
     */
    getProvinceList().then(data => {
      this.provinceList = data.data.content;
    });
  },
  methods: {
    // 切换省市区
    changeProvince(obj) {
      if (obj.level == 1) {
        getRegionList(this.userform.regisAddress).then(data => {
          this.cityList = data.data.content;
        });
        this.userform.reAddress = "";
      }
    },
    submitForm(userform) {
      this.$refs[userform].validate(valid => {
        if (valid) {
          if (this.switchStatus == true) {
            this.userform.status = 1;
          } else {
            this.userform.status = 0;
          }
          update_userInfo({
            addressId: this.userform.reAddress == "" ? null : this.userform.reAddress,
            birthday: this.userform.birthday == "" ? null : this.userform.birthday,
            gender: this.userform.gender == "" ? null : this.userform.gender,
            phone: this.userform.phone == "" ? null : this.userform.phone,
            profession: this.userform.profession == "" ? null : this.userform.profession,
            signature: this.userform.signatureInput == "" ? null : this.userform.signatureInput,
            status: this.userform.status == "" ? null : this.userform.status,
            userId: this.userform.userId == "" ? null : this.userform.userId
          }).then(data => {
            if (data.data.status == 0) {
              this.$message({
                type: "success",
                message: data.data.msg,
                center: true
              });
              this.$router.go(-1);
            } else {
              this.$message({
                type: "error",
                message: data.data.msg,
                center: true
              });
            }
          });
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  //是否有富文本编辑
  components: { uploadImg }
};
</script>

<style lang='less' scoped>
#addAlter {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      width: 40%;
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
.se-box {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
