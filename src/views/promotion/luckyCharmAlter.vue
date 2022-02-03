<template>
  <!-- 报名用户详情 -->
  <div class="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>报名用户详情</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-back" style="margin-right:30px">返回</el-button>
      </div>
      <div class="add-content">
        <el-form :model="luckyuserForm" ref="luckyuserForm" :rules="luckyCharmRules" label-width="120px">
          <el-form-item label="用户ID：">{{luckyuserForm.userId}}</el-form-item>
          <el-form-item label="用户昵称：">{{luckyuserForm.nickName}}</el-form-item>
          <el-form-item label="用户账号：">{{luckyuserForm.userPhone}}</el-form-item>
          <el-form-item label="报名时间：">{{luckyuserForm.createTime}}</el-form-item>
          <el-form-item label="小区名称：" prop="villageName" class="is-required">
            <el-input v-model="luckyuserForm.villageName" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="户型：" v-if="showImg" prop="layout" class="is-required">
            <upload-img
              @getimgArr="(imgarr)=>{this.luckyuserForm.layout = imgarr}"
              :imgArr="this.luckyuserForm.layout"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item label="面积：" prop="area" class="is-required">
            <el-input-number v-model="luckyuserForm.area" :min="0" :controls="false"></el-input-number>㎡
          </el-form-item>
          <el-form-item label="得票数：">{{luckyuserForm.sumVotes}}</el-form-item>
          <el-form-item label="心愿：" prop="wish" class="is-required">
            <el-input type="textarea" v-model="luckyuserForm.wish" style="width:400px"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="isDisplay" class="is-required">
            <el-radio-group v-model="luckyuserForm.isDisplay">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('luckyuserForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import uploadImg from "../../components/uploadImg";
import { koiSelectById, koiUpdate } from "../../api/luckyCharm";
export default {
  components: { uploadImg },
  data() {
    return {
      luckyuserForm: {
        area: "",
        createTime: "",
        isDisplay: 1,
        layout: "",
        no: 0,
        sumVotes: 0,
        userId: "",
        villageName: "",
        virtualVotes: null,
        wish: ""
      },
      searchTime: [],
      showImg: true,
      luckyCharmRules: {
        villageName: [{ required: true, message: "请填写小区名称", trigger: "blur" }],
        layout: [{ required: true, message: "请上传户型图", trigger: "blur" }],
        area: [{ required: true, message: "请填写面积", trigger: "blur" }],
        wish: [{ required: true, message: "请填写心愿", trigger: "blur" }]
      }
    };
  },
  mounted() {
    koiSelectById(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        this.luckyuserForm = data.data.data;
        this.refreshImg();
      }
    });
  },
  methods: {
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          koiUpdate(this.luckyuserForm).then(data => {
            if (data.data.status == 0) {
              this.$message({ type: "success", message: "编辑成功" });
              this.$router.go(-1);
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.error("请检查是否填完所有参数");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.add-page {
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card .el-card__header {
    background: #f2f2f2 !important;
    height: 50px;
  }
}
</style>