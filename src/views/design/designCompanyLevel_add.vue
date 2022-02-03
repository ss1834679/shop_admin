<template>
  <div id="designCompany_level">
    <!-- 编辑设计师公司登记-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加设计公司等级</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form :model="CompanyLevelForm" ref="CompanyLevelForm" :rules="CompanyLevelRules" label-width="150px" class="demo-ruleForm">
          <el-form-item label="等级名称" prop="name">
            <el-input v-model="CompanyLevelForm.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="保证金" prop="deposit">
            <template>
              <precision-input
                :num="this.CompanyLevelForm.deposit"
                :text="'元'"
                :placeholder="'填写金额'"
                :type="'price'"
                @getNum="(value)=>{this.CompanyLevelForm.deposit=value}"
              ></precision-input>
            </template>
          </el-form-item>
          <el-form-item label="设计师数量" prop="designerMaxNumber">
            <el-input-number v-model="CompanyLevelForm.designerMaxNumber" :controls="false" :min="0"></el-input-number>个
            <!-- <el-input v-model.number="CompanyLevelForm.designerMaxNumber" style="width:300px"></el-input> -->
            <div style="font-size:12px;color:#888">当前等级下的设计公司允许添加的设计师数量</div>
          </el-form-item>
          <el-form-item label="服务费比例" prop="feeRatio">
            <template>
              <el-input-number v-model="CompanyLevelForm.feeRatio" :controls="false" :min="0" :max="100"></el-input-number>%
              <div style="font-size:12px;color:#888">完成装修订单后当前等级下的设计公司分润占比</div>
            </template>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="submitForm('CompanyLevelForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addInsertCompanyLevel, addUpdateCompanyLevel, detailCompanyLevel } from "../../api/designer";
import precisionInput from "../../components/precisionInput";
export default {
  components: {
    precisionInput
  },
  data() {
    return {
      CompanyLevelForm: {
        id: "" /* 设计师公司等级id */,
        name: "" /* 设计师公司等级名 */,
        deposit: "" /* 保证金 */,
        designerMaxNumber: "" /* *设计师数量 */,
        feeRatio: "" /* *服务费比例 */
      },
      CompanyLevelRules: {
        /* 验证规则 */
        name: [{ required: true, message: "请填写设计师公司等级", trigger: "blur" }],
        deposit: [{ required: true, message: "请填写保证金", trigger: "blur" }],
        designerMaxNumber: [{ required: true, message: "请输入设计师数量", trigger: "blur" }],
        feeRatio: [{ required: true, message: "请输入服务费比例", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.type == "2") {
      detailCompanyLevel(this.$route.query.id).then(data => {
        this.CompanyLevelForm = data.data.content[0];
      });
    }
  },
  methods: {
    // 提交
    submitForm(CompanyLevelForm) {
      this.$refs[CompanyLevelForm].validate(valid => {
        if (valid) {
          if (this.$route.query.type == "1") {
            addInsertCompanyLevel({
              deposit: this.CompanyLevelForm.deposit,
              designerMaxNumber: this.CompanyLevelForm.designerMaxNumber,
              feeRatio: this.CompanyLevelForm.feeRatio,
              name: this.CompanyLevelForm.name
            }).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  message: data.data.state,
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
          } else if (this.$route.query.type == "2") {
            addUpdateCompanyLevel({
              id: this.$route.query.id,
              deposit: this.CompanyLevelForm.deposit,
              designerMaxNumber: this.CompanyLevelForm.designerMaxNumber,
              feeRatio: this.CompanyLevelForm.feeRatio,
              name: this.CompanyLevelForm.name
            }).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  message: data.data.state,
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang='less' scoped>
#designCompany_level {
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