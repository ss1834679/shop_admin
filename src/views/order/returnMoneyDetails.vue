<template>
  <div id="returnMoneyDetails">
    <!-- 退款服务单的详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">服务单详情</span>
        </div>
      </div>
      <div class="content">
        <el-card class="card">
          <div slot="header" class="status">
            <span>服务单信息</span>
          </div>
          <div class="content">
            <el-form label-width="100px" class="demo-ruleForm">
              <div class="formTable">
                <el-form-item label="服务单号">{{serviceDetails.sn}}</el-form-item>
                <el-form-item label="申请状态">
                  <span v-if="serviceDetails.status=='1'">待处理</span>
                  <span v-if="serviceDetails.status=='2'">已处理</span>
                </el-form-item>
                <el-form-item label="订单编号">{{serviceDetails.orderSn}}</el-form-item>
                <el-form-item label="申请时间">{{serviceDetails.createTime}}</el-form-item>
                <el-form-item label="用户账号">{{serviceDetails.userName}}</el-form-item>
              </div>
              <div class="formTable">
                <el-form-item label="订单金额">{{"¥"+(serviceDetails.refundAmount/100).toFixed(2)}}</el-form-item>
                <el-form-item label="确认退款金额">{{"¥"+(serviceDetails.refundAmount/100).toFixed(2)}}</el-form-item>
                <el-form-item label="退款方式">退回到原支付渠道</el-form-item>
              </div>
              <template v-if="serviceDetails.status!='2'">
                <div>
                  <div class="formTable">
                    <el-form-item label="处理人">{{serviceDetails.userName}}</el-form-item>
                    <el-form-item label="处理时间">{{serviceDetails.handleTime}}</el-form-item>
                    <el-form-item label="处理备注">{{serviceDetails.handleNote}}</el-form-item>
                  </div>
                </div>
              </template>

              <div class="formTable">
                <el-form-item label="处理备注" v-if="serviceDetails.status=='1'">
                  <el-input placeholder="处理备注" v-model="handleNotes"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="buttom" v-if="serviceDetails.status=='1'">
              <el-button @click="processReturns()" type="success">确认退款</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRefundInfo, refundMoneyInfo } from "../../api/order";
import { quickRefundV3_1 } from "../../api/pay";
export default {
  data() {
    return {
      serviceDetails: {
        sn: "" /* 服务单号 id */,
        orderItemId: "" /* 订单id */,
        createTime: "" /* 申请时间 */,
        handleTime: "" /* 处理时间 */,
        userName: "" /* 通过userId查到的用户名 */,
        refundAmount: "" /* 订单金额 分 */,
        handleNote: "",
        /* 申请状态  0:商家已拒绝 1:待商家同意 2:商家已同意 3:商家已收货 4:退款中(退款) 5:已发货(换货) 6:已完成 7:客户已取消 */
        status: ""
      },
      handleNotes: "" /* 处理备注 */
    };
  },
  mounted() {
    if (this.$route.query.id) {
      // 根据退货id查退货详情
      getRefundInfo(this.$route.query.id).then(data => {
        this.serviceDetails = data.data.data;
      });
    }
  },
  methods: {
    // 确认退款
    processReturns() {
      this.$confirm("确定要同意当确认退款吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.handleNotes == null || this.handleNotes == "") {
            this.handleNotes = "同意退款";
          }
          refundMoneyInfo({
            id: this.$route.query.id,
            refundNote: this.handleNotes
          }).then(data => {
            if (data.data.status == 0) {
              quickRefundV3_1({
                origMerchOrderNo: data.data.data.sn,
                amount: data.data.data.refundAmount,
                reason: data.data.data.returnReason,
                refundAdvanceAmount: data.data.data.refundAmount
              }).then(res => {
                if (res.data.status == 0) {
                  this.$message({ message: res.data.msg, type: "success" });
                  this.$router.go(-1);
                } else {
                  this.$message.error(res.data.msg);
                }
              });
              // this.$router.go(-1)
            } else {
              this.$message({
                message: data.data.msg,
                type: "info"
              });
            }
          });
        })
        .catch(() => {
          this.$message("已取消退款");
        });
    },
    // 总价
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (column.property == "price") {
          const values = data.map(item => Number((item[column.property] / 100).toFixed(2)));
          if (!values.every(value => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            sums[index] += " 元";
          } else {
            sums[index] = "N/A";
          }
        }
      });
      return sums;
    }
  }
};
</script>

<style lang='less'>
#returnMoneyDetails {
  .box-card {
    height: 100%;
  }
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
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
      .card {
        border-radius: 0px;
        .el-card__header {
          background-color: #f3f3f3;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .btn {
            margin-right: 10px;
            .el-button {
              padding: 7px 7px;
              border-radius: 0px;
            }
          }
          .status {
            margin-left: 10px;
          }
        }
        .content {
          .el-form {
            .el-form-item {
              margin: 0;
              .el-form-item__label {
                border: 1px solid #ebeef5;
                background-color: #f9fafc;
              }
              .el-form-item__content {
                height: 40px;
                line-height: 40px;
                padding-left: 20px;
                border: 1px solid #ebeef5;
              }
            }
            .el-form-item.imgItem {
              .el-form-item__label {
                height: 60px;
                line-height: 60px;
              }
              .el-form-item__content {
                height: 60px;
                line-height: 60px;
                .el-image {
                  width: 80px;
                  height: 60px !important;
                }
              }
            }
          }
          .formTable {
            margin-bottom: 30px;
          }
          .el-table__body-wrapper {
            min-height: 0px;
          }
          .el-form-item__content {
            display: flex;
          }
          .searchGood {
            width: 250px;
            margin-right: 20px;
          }
          .buttom {
            display: flex;
            justify-content: center;
            margin-top: 10px;
            .el-button {
              margin-left: 40px;
            }
          }
        }
        .content > div {
          margin-bottom: 10px;
          b.title {
            display: inline-block;
            margin-bottom: 5px;
          }
        }
      }
      .is-always-shadow {
        box-shadow: none;
        -webkit-box-shadow: none;
      }
    }
  }
}
</style>