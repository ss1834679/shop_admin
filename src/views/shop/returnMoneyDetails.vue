<template>
  <div id="returnMoneyDetails">
    <!-- 服务单的详情 -->
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
                  {{serviceDetails.status}}
                  <span v-if="serviceDetails.status=='0'">商家已拒绝</span>
                  <span v-if="serviceDetails.status=='4'">待处理</span>
                  <span v-if="serviceDetails.status=='6'">已处理</span>
                </el-form-item>
                <el-form-item label="订单编号">{{serviceDetails.orderItemId}}</el-form-item>
                <el-form-item label="申请时间">{{serviceDetails.createTime}}</el-form-item>
                <el-form-item label="用户账号">{{serviceDetails.userName}}</el-form-item>
              </div>
              <div class="formTable">
                <el-form-item label="订单金额">{{"¥"+(serviceDetails.orderPrice/100).toFixed(2)}}</el-form-item>
                <el-form-item label="确认退款金额">{{"¥"+(serviceDetails.totalMoney/100).toFixed(2)}}</el-form-item>
                <el-form-item label="退款方式">退回到原支付渠道</el-form-item>
                <el-form-item label="退款类型">取消订单</el-form-item>
                <el-form-item label="退款原因">{{serviceDetails.returnReason}}</el-form-item>
              </div>
              <template v-if="serviceDetails.status!='4'">
                <div>
                  <div class="formTable" v-for="item in serviceDetails.handle" :key="item.handleTime">
                    <el-form-item label="处理人">{{item.handler}}</el-form-item>
                    <el-form-item label="处理时间">{{item.handleTime}}</el-form-item>
                    <el-form-item label="处理备注">{{item.handleNote}}</el-form-item>
                  </div>
                </div>
              </template>

              <div class="formTable">
                <el-form-item label="处理备注" v-if="serviceDetails.status=='4'">
                  <el-input placeholder="处理备注" v-model="handleNote"></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="buttom" v-if="serviceDetails.status=='4'">
              <el-button @click="processReturns('agree')" type="success">确认退款</el-button>
              <el-button @click="processReturns('refuse')" type="danger">拒绝退款</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getOneOrder } from "../../api/order";
export default {
  data() {
    return {
      handleNote: "" /* 处理备注 */,
      serviceDetails: {
        sn: "1217292128019832834" /* 服务单号 id */,
        orderItemId: "14125125" /* 订单id */,
        createTime: "2020-01-06 15:11:12" /* 申请时间 */,
        handleTime: "2020-01-06 15:11:12" /* 处理时间 */,
        userName: "用户名1" /* 通过userId查到的用户名 */,
        returnReasonType: "1" /* 退货理由类型 0.快递太慢 1.质量原因 2.服务原因 3.找不到人工 4.其他 */,
        returnReason: "太慢" /* 问题 退货理由描述 */,
        img: "5e12ecf9a1a09a0baeb14607,5e12ecf7a1a09a0baeb145fb,5e12ec66a1a09a0baeb145f7" /* 图片 */,
        orderPrice: 31200 /* 订单金额 分 */,
        isReturnfreight: 1 /* 是否退运费 0：不退 1：退 */,
        totalMoney: 21296 /* 退款金额(分) */,
        contactName: "联系人mz" /* 联系人 */,
        contactNumber: "13598276485" /* 联系人电话 */,
        returnAddress: "" /* 邮寄地址 */,
        /* 申请状态  0:商家已拒绝 1:待商家同意 2:商家已同意 3:商家已收货 4:退款中(退款) 5:已发货(换货) 6:已完成 7:客户已取消 */
        status: "4",
        handle: [
          { handler: "admin", handleTime: "2020-01-06 15:11:12", handleNote: "处理备注1122334" },
          { handler: "admin", handleTime: "2020-01-06 15:11:13", handleNote: "处理备注1122334" }
        ]
      },
      orderDetails: {}
    };
  },
  mounted() {
    if (this.$route.query.id) {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      getOneOrder(this.$route.query.id).then(data => {
        console.log(data);
      });
    }
  },
  methods: {
    processReturns() {
      console.log(this.handleNote);
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      console.log(param);
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
    },
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