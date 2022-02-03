<template>
  <div id="companyinSet">
    <!-- 入驻规则-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">入驻规则</span>
      </div>

      <div class="content">
        <el-form :model="companyInRuleFrom" ref="companyInRuleFrom" label-width="150px" class="demo-ruleForm">
          <el-form-item label="入驻规则介绍" prop="picture" required>
            <upload-img
              v-if="showImg"
              @getimgArr="(imgarr)=>{this.companyInRuleFrom.picture = imgarr}"
              :notMultiple="true"
              :imgArr="this.companyInRuleFrom.picture"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item>
            <el-button type="primary" @click="submitForm('companyInRuleFrom')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { insertDesignerCompanyInRule, getDesignerCompanyInRule } from "../../api/designer";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      showImg: true,
      companyInRuleFrom: {
        picture: ""
      },
      companyInRuleFromRule: {
        picture: [{ required: true, message: "请上传规则图片", tiggle: "blur" }]
      }
    };
  },
  mounted() {
    getDesignerCompanyInRule().then(data => {
      if (data.data.status == 200) {
        this.companyInRuleFrom.picture = data.data.content.picture;
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
    /* 提交 */
    submitForm(companyInRuleFrom) {
      this.$refs[companyInRuleFrom].validate(valid => {
        if (valid) {
          insertDesignerCompanyInRule(this.companyInRuleFrom).then(data => {
            if (data.data.status == 200) {
              this.$message({ message: "修改成功", type: "success" });
            } else {
              this.$message.error("修改失败，刷新页面重新上传");
            }
          });
        }
      });
    }
  },
  components: { uploadImg }
};
</script>

<style lang='less' scoped>
#companyinSet {
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
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
}
</style>