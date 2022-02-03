<template>
  <!-- 分销设置页 -->
  <div class="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分销设置</span>
      </div>

      <div class="add-content">
        <el-form :model="retailStoreFrom" ref="retailStoreFrom" :rules="retailStoreRules" label-width="140px">
          <el-form-item label="成为分销会员条件" prop="requirement" class="is-required">
            <precision-input :num="retailStoreFrom.requirement" :text="'元'" :type="'price'" @getNum="(value)=>{retailStoreFrom.requirement=value}"></precision-input>
          </el-form-item>
          <el-form-item label="分销规则说明：" v-if="showImg" prop="rule">
            <upload-img
              @getimgArr="(imgarr)=>{this.retailStoreFrom.rule = imgarr}"
              :imgArr="this.retailStoreFrom.rule"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item label="分销服务协议：" prop="agreement" class="is-required">
            <wang-editor :value="retailStoreFrom.agreement" @getHtmlFromWang="(value)=>{this.retailStoreFrom.agreement=value}"></wang-editor>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('retailStoreFrom')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import precisionInput from "../../components/precisionInput";
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
import { getRetailStoreSet, saveOrUpdateRetailStore } from "../../api/distribuManage";
export default {
  components: { wangEditor, uploadImg, precisionInput },
  data() {
    return {
      retailStoreFrom: {
        agreement: "" /* 协议 */,
        requirement: 16800 /* 成为分销会员条件 */,
        rule: "" /* 规则 */
      },
      showImg: true,
      retailStoreRules: {
        agreement: [{ required: true, message: "请填写分销服务协议", trigger: "blur" }],
        requirement: [{ required: true, message: "请成为分销会员条件", trigger: "blur" }],
        rule: [{ required: true, message: "请上传分销规则说明", trigger: "blur" }]
      }
    };
  },
  mounted() {
    getRetailStoreSet().then(data => {
      if (data.data.status == 0) {
        this.retailStoreFrom = data.data.data[0];
        this.refreshImg();
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveOrUpdateRetailStore(this.retailStoreFrom).then(data => {
            if (data.data.status == 0) {
              this.$message({ type: "success", message: "编辑成功" });
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          this.$message.error("请检查是否填完所有参数");
          return false;
        }
      });
    },
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
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