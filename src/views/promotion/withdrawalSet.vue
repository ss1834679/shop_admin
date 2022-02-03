<template>
  <!-- 提现设置页 -->
  <div class="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>提现设置</span>
      </div>

      <div class="add-content">
        <el-form :model="withdrawalFrom" ref="withdrawalFrom" :rules="withdrawalRules" label-width="120px" class="demo-ruleForm">
          <el-form-item label="最小提现金额：" prop="minValue" class="is-required">
            <precision-input :num="withdrawalFrom.minValue" :text="'元'" :type="'price'" @getNum="(value)=>{withdrawalFrom.minValue=value}"></precision-input>
          </el-form-item>
          <el-form-item label="提现手续费：" prop="process" class="is-required">
            <el-input-number v-model="withdrawalFrom.process" :min="0" :max="100" :controls="false"></el-input-number>%
            <div style="color:#888;font-size:13px;width:800px">会员提现手续费比例，默认为0即为无手续费</div>
          </el-form-item>
          <el-form-item label="提现说明：" prop="remark" class="is-required">
            <el-input type="textarea" v-model="withdrawalFrom.remark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('withdrawalFrom')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import precisionInput from "../../components/precisionInput";
import { getCashOutSet, saveOrUpdateCashOut } from "../../api/distribuManage";
export default {
  components: { precisionInput },
  data() {
    return {
      withdrawalFrom: {
        minValue: 0 /* 最小金额 */,
        process: 1 /* 提现手续费 */,
        remark: null /* 提现说明 */
      },
      withdrawalRules: {
        minValue: [{ required: true, message: "填写最小提现金额", trigger: "blur" }],
        process: [{ required: true, message: "请填写提现手续费", trigger: "blur" }],
        remark: [{ required: true, message: "请填写提现说明", trigger: "blur" }]
      }
    };
  },
  mounted() {
    getCashOutSet().then(data => {
      if (data.data.status == 0) {
        data.data.data[0] ? (this.withdrawalFrom = data.data.data[0]) : this.$message.warning("添加提现设置");
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveOrUpdateCashOut(this.withdrawalFrom).then(data => {
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