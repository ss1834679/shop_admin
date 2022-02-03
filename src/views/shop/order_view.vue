<template>
  <div id="detail">
    <!-- 订单的详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">订单详情</span>
        </div>
      </div>
      <div class="content">
        <el-steps :active="Number(orderDetails.orders.orderStatus)" align-center finish-status="success">
          <el-step title="提交订单" v-if="orderDetails.orders.orderStatus==0" status="success"></el-step>
          <el-step title="提交订单" v-else></el-step>
          <el-step title="取消订单" v-if="orderDetails.orders.orderStatus==0" status="error"></el-step>
          <el-step title="支付订单">
            <template slot="icon" v-if="orderDetails.orders.orderStatus<=1">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
          <el-step title="平台发货">
            <template slot="icon" v-if="orderDetails.orders.orderStatus<=2">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
          <el-step title="确认收货">
            <template slot="icon" v-if="orderDetails.orders.orderStatus<=3">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
          <el-step title="完成评价">
            <template slot="icon" v-if="orderDetails.orders.orderStatus<=4">
              <i class="el-icon-time"></i>
            </template>
          </el-step>
        </el-steps>
        <el-card class="card">
          <div slot="header" class="status">
            <span>当前订单状态：</span>
            <span v-if="orderDetails.orders.orderStatus==0">已取消</span>
            <span v-if="orderDetails.orders.orderStatus==1">待付款</span>
            <span v-if="orderDetails.orders.orderStatus==2">待发货</span>
            <span v-if="orderDetails.orders.orderStatus==3">待收货</span>
            <span v-if="orderDetails.orders.orderStatus==4">已完成</span>
          </div>
          <div slot="header" class="btn">
            <template v-if="orderDetails.orders.orderStatus!=0">
              <template v-if="orderDetails.orders.orderStatus==1||orderDetails.orders.orderStatus==2">
                <el-button plain @click="receiptVisible=true">修改发票信息</el-button>
                <el-button plain @click="receiveVisible=true">修改收货人信息</el-button>
                <template v-if="orderDetails.orders.orderStatus==1">
                  <el-button plain @click="alterGoodsInfo">修改商品信息</el-button>
                  <el-button plain @click="costInfoVisible=true">修改费用信息</el-button>
                </template>
              </template>
              <template v-else>
                <el-button plain>订单跟踪</el-button>
              </template>
              <el-button plain @click="mailVisible=true">发送站内信</el-button>
              <el-button plain @click="noteVisible=true">备注订单</el-button>
              <el-button type="danger" @click="closeOrder('open')" plain v-if="orderDetails.orders.orderStatus==1">关闭订单</el-button>
              <el-button type="danger" plain v-if="orderDetails.orders.orderStatus==2">取消订单</el-button>
            </template>
            <template v-else>
              <el-button type="danger" plain>删除订单</el-button>
              <el-button plain>备注订单</el-button>
            </template>
          </div>
          <div class="content">
            <div class="info">
              <b class="title">基本信息</b>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="订单编号">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="发货单流水号"></el-table-column>
                <el-table-column label="用户账号"></el-table-column>
                <el-table-column label="支付方式"></el-table-column>
                <el-table-column label="订单来源"></el-table-column>
                <el-table-column label="订单类型"></el-table-column>
              </el-table>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="配送方式">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="物流单号"></el-table-column>
                <el-table-column label="自动确认收货时间"></el-table-column>
                <el-table-column label="订单可得优币"></el-table-column>
                <el-table-column label="活动信息"></el-table-column>
                <el-table-column></el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">发票信息</b>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="发票类型">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="发票抬头"></el-table-column>
                <el-table-column label="发票内容"></el-table-column>
                <el-table-column label="收票人信息"></el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">收货人信息</b>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="收货人">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="手机号码"></el-table-column>
                <el-table-column label="邮政编码"></el-table-column>
                <el-table-column label="收货地址"></el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">商品信息</b>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="商品图片">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="商品名称"></el-table-column>
                <el-table-column label="价格/货号"></el-table-column>
                <el-table-column label="属性"></el-table-column>
                <el-table-column label="数量"></el-table-column>
                <el-table-column label="库存"></el-table-column>
                <el-table-column label="小计"></el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">费用信息</b>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="商品合计">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="运费"></el-table-column>
                <el-table-column label="优惠券"></el-table-column>
                <el-table-column label="优币抵扣"></el-table-column>
              </el-table>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="活动优惠">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="折扣金额"></el-table-column>
                <el-table-column label="订单总金额"></el-table-column>
                <el-table-column label="应付款金额"></el-table-column>
              </el-table>
            </div>
            <div class="info">
              <b class="title">操作信息</b>
              <el-table :data="details" border style="width: 100%">
                <el-table-column label="操作者">
                  <template slot-scope="scope">{{scope.row.number}}</template>
                </el-table-column>
                <el-table-column label="操作时间"></el-table-column>
                <el-table-column label="订单状态"></el-table-column>
                <el-table-column label="付款状态"></el-table-column>
                <el-table-column label="发货状态"></el-table-column>
                <el-table-column label="备注"></el-table-column>
              </el-table>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
    <el-dialog title="修改发票信息" :visible.sync="receiptVisible">
      <el-form label-width="90px">
        <el-form-item label="发票类型">
          <el-select v-model="receiptform.type" placeholder="发票类型">
            <el-option label="电子发票" value="1"></el-option>
            <el-option label="纸质发票" value="2"></el-option>
            <el-option label="不开发票" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发票抬头">
          <el-input v-model="receiptform.head"></el-input>
        </el-form-item>
        <el-form-item label="发票内容">
          <el-select v-model="receiptform.content" placeholder="发票内容">
            <el-option v-for="i in recContent" :key="i.value" :label="i.label" :value="i.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收票人手机">
          <el-input v-model="receiptform.recPhone"></el-input>
        </el-form-item>
        <el-form-item label="收票人邮箱">
          <el-input v-model="receiptform.recEmail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiptVisible = false">取 消</el-button>
        <el-button type="primary" @click="alter(receiptform)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改收货人信息" :visible.sync="receiveVisible">
      <el-form label-width="90px">
        <el-form-item label="收货人姓名">
          <el-input v-model="receiveform.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="receiveform.phone"></el-input>
        </el-form-item>
        <el-form-item label="邮政编码">
          <el-input v-model="receiveform.postalCode"></el-input>
        </el-form-item>
        <el-form-item label="所在区域">
          <!-- 级联菜单 -->
          <el-input v-model="receiveform.recPhone"></el-input>
        </el-form-item>
        <el-form-item label="详细地址">
          <el-input v-model="receiveform.address"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="receiveVisible = false">取 消</el-button>
        <el-button type="primary" @click="alter(receiveform)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发送站内信" :visible.sync="mailVisible">
      <el-form label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="mailform.title"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" v-model="mailform.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="mailVisible = false">取 消</el-button>
        <el-button type="primary" @click="alter(mailform)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="修改费用信息" :visible.sync="costInfoVisible">
      <el-table :data="details" border style="width: 100%">
        <el-table-column label="商品合计">
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="运费">
          <template slot-scope="scope">
            <el-input v-model="scope.row.number"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="优惠券"></el-table-column>
        <el-table-column label="优币抵扣"></el-table-column>
      </el-table>
      <el-table :data="details" border style="width: 100%">
        <el-table-column label="活动优惠">
          <template slot-scope="scope">{{scope.row.number}}</template>
        </el-table-column>
        <el-table-column label="折扣金额">
          <template slot-scope="scope">
            <el-input v-model="scope.row.number"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="订单总金额"></el-table-column>
        <el-table-column label="应付款金额"></el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="costInfoVisible = false">取 消</el-button>
        <!-- 还要修改 传入一个表单 修改的的运费和折扣 以及订单id等 还没有创建表单 -->
        <el-button type="primary" @click="alter(receiveform)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="备注订单" :visible.sync="noteVisible">
      <el-form label-width="80px">
        <el-form-item label="操作备注">
          <el-input type="textarea" v-model="noteform.text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="nodeVisible = false">取 消</el-button>
        <el-button type="primary" @click="alter(noteform)">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="关闭订单" :visible.sync="closeVisible">
      <el-form label-width="80px">
        <el-form-item label="操作备注">
          <el-input type="textarea" v-model="noteform.text"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="nodeVisible = false">取 消</el-button>
        <el-button type="primary" @click="closeOrder('close')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getOneOrder, alterOrder } from "../../api/order";
export default {
  data() {
    return {
      receiptVisible: false /* 发票弹窗 */,
      receiveVisible: false /* 收货人信息弹窗 */,
      mailVisible: false /* 站内信弹窗 */,
      costInfoVisible: false /* 修改费用弹窗 */,
      noteVisible: false /* 备注订单弹窗 */,
      closeVisible: false /* 关闭订单弹窗 */,
      recContent: [
        /* 发票内容 */
        { value: "0", label: "日用品" },
        { value: "1", label: "家居用品" },
        { value: "2", label: "食品" },
        { value: "3", label: "酒/饮料" },
        { value: "4", label: "服饰" },
        { value: "5", label: "化妆品" }
      ],
      receiptform: {
        /* 发票 */
        type: "" /* 发票类型 */,
        head: "" /* 发票抬头 */,
        content: "" /* 发票内容 */,
        recPhone: "" /* 收票人手机 */,
        recEmail: "" /* 收票人邮箱 */
      },
      receiveform: {
        /* 收货人信息 */
        name: "" /* 姓名 */,
        phone: "" /* 手机号 */,
        postalCode: "" /* 邮政编码 */,
        region: "" /* 所在区域 */,
        address: "" /* 详细地址 */
      },
      mailform: {
        /* 站内信 */
        title: "" /* 标题 */,
        content: "" /* 内容 */
      },
      noteform: {
        text: "12341415" /* 备注信息 */
      },
      details: [
        {
          number: "123143535346574"
        }
      ],
      orderDetails: {
        orderItem: {
          id: "1217292128019832834",
          createTime: "2020-01-15 11:47:14",
          updateTime: "2020-01-15 11:47:14",
          operator: "test",
          isDelete: 0,
          orderId: "1215184680547090433",
          orderSn: "15790600336289991214436104904716289",
          goodsItemId: "1214436104904716289",
          goodsPrice: 4469491,
          goodsNum: 10,
          realAmount: 44694910,
          couponId: ""
        },
        orders: {
          id: "1215184680547090433",
          createTime: "2020-01-09 16:12:59",
          updateTime: "2020-01-09 16:12:59",
          operator: "test",
          isDelete: 0,
          userId: "2",
          totalMoney: 14385640,
          disPrice: 0,
          payType: "",
          payTime: "1970-01-01 08:00:00",
          addressId: "233",
          deliverySn: "",
          sourceType: "2",
          orderStatus: "1",
          cancelReason: ""
        }
      }
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
    // submitForm() {
    // },
    alter(obj) {
      alterOrder(obj);
      this.receiptVisible = false;
      this.receiveVisible = false;
      this.mailVisible = false;
      this.costInfoVisible = false;
      this.noteVisible = false;
    },
    alterGoodsInfo() {
      /* 传入订单id 这个id待定 */
      this.$router.push({ name: "alterGoodsInfo", query: { orderId: this.orderDetails.orders.id } });
    },
    /* 关闭订单 */
    closeOrder(action) {
      if (action == "open") {
        this.noteform = { text: "" };
        this.closeVisible = true;
      } else if (action == "close") {
        /* 填写备注的接口 还有id */
        alterOrder(this.noteform);
        this.closeVisible = false;
        this.noteform = { text: "" };
      }
    }
  }
};
</script>

<style lang='less'>
#detail {
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
          .el-table__body-wrapper {
            min-height: 0px;
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