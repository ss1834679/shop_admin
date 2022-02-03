<template>
  <!-- 取消订单页面 -->
  <div id="quxiao-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>取消订单</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>

      <div class="content">
        <el-form :model="cancelOrderForm" :rules="rules2" ref="cancelOrderForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="操作备注:" prop="shopsRemarks">
            <el-input type="textarea" v-model="cancelOrderForm.shopsRemarks" rows="3" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label="取消原因:" prop="cancelReason">
            <el-input type="textarea" v-model="cancelOrderForm.cancelReason" rows="3" show-word-limit></el-input>
          </el-form-item>
          <el-form-item label prop>
            <div>
              <span class="te-te">会记录在商家给客户的留言中</span>
            </div>
          </el-form-item>
          <el-form-item label="订单金额:">
            <div>
              <span>{{"¥" + (orderMoney / 100).toFixed(2)}}</span>
            </div>
          </el-form-item>
          <el-form-item label="退运费：" prop="isReturnfreight">
            <el-radio v-model="cancelOrderForm.isReturnfreight" :label="1">退运费</el-radio>
            <el-radio v-model="cancelOrderForm.isReturnfreight" :label="0">不退运费</el-radio>
          </el-form-item>
          <el-form-item label="确退金额：">
            <div v-if="cancelOrderForm.isReturnfreight==1">
              <span class="spa-money">{{"¥" + (orderMoney / 100).toFixed(2)}}</span>
            </div>
            <div v-if="cancelOrderForm.isReturnfreight==0">
              <span class="spa-money">{{"¥" + ((orderMoney-fightMoney) / 100).toFixed(2)}}</span>
            </div>
          </el-form-item>
          <el-form-item label="退款方式：" prop="refundWay">
            <el-radio v-model="cancelOrderForm.refundWay" :label="1">退回到原支付渠道</el-radio>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('cancelOrderForm')">确定</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { closeOrder } from "../../api/order";
export default {
  data() {
    return {
      orderMoney: 0,
      fightMoney: 0,
      cancelOrderForm: {
        cancelReason: "",
        isReturnfreight: 1,
        orderId: "",
        refundWay: 1,
        shopsRemarks: ""
      },
      rules2: {
        shopsRemarks: [{ required: true, message: "请填写备注", trigger: "blur" }],
        cancelReason: [{ required: true, message: "请填写取消原因", trigger: "blur" }]
      }
    };
  },
  mounted() {
    this.orderMoney = this.$route.query.amountPayable;
    this.fightMoney = this.$route.query.totalFreightCharge;
    this.cancelOrderForm.orderId = this.$route.query.orderId;
  },
  methods: {
    /* 提交取消订单 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          closeOrder(this.cancelOrderForm).then(data => {
            if (data.data.status == 0) {
              this.$router.push({ name: "return_Money" });
              this.$message({ type: "success", message: "取消成功" });
            } else {
              this.$message.error("取消失败");
            }
          });
        } else {
          this.$message.error("请上传完成参数");
        }
      });
    }
  }
};
</script>
<style lang="less" scoped>
#quxiao-page {
  padding: 20px;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.content {
  margin: 0 auto;
  width: 500px;
}

.te-te {
  font-size: 12px;
  color: #ccc;
}
</style>