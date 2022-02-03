<template>
  <!-- 打印发货单页 -->
  <div style="padding:20px">
    <el-card>
      <div slot="header" class="clearfix">
        <span class="title">订单详情</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
          <el-button size="mini" @click="preview" icon="el-icon-arrow-left" style="margin-right:30px">打印</el-button>
        </div>
      </div>
      <!-- 订单信息  -->
      <div id="tablePrint" ref="tablePrint" style="width:100%">
        <div v-for="item in printShipmentsList" :key="item.id">
          <div style="margin-top:50px">
            <div class="or-header">订单信息</div>
            <div style="width:100%">
              <el-table :data="item.orderItemPrintShipmentss" border>
                <el-table-column prop="goodsItemId" label="货号"></el-table-column>
                <el-table-column prop="goodsTitle" label="名称"></el-table-column>
                <el-table-column prop="goodsPrice" label="价格"></el-table-column>
                <el-table-column prop="goodsData" label="属性"></el-table-column>
                <el-table-column prop="goodsNum" label="数量"></el-table-column>
                <el-table-column prop="realAmount" label="小计"></el-table-column>
              </el-table>
              <div class="or-he">
                <div>
                  商品总价:{{
                  "¥" + (item.totalGoodsPrice / 100).toFixed(2)
                  }}
                </div>
                <div>
                  运费:
                  {{
                  "¥" + (item.freightCharge / 100).toFixed(2)
                  }}
                </div>
                <div>
                  订单总金额:
                  {{
                  "¥" + (item.amountPayable / 100).toFixed(2)
                  }}
                </div>
                <div style="display:flex">
                  支付方式:
                  <div v-if="item.payType == '1'">微信</div>
                  <div v-if="item.payType == '2'">支付宝</div>
                  <div v-if="item.payType == '3'">银联</div>
                </div>
              </div>

              <div class="or-mu">
                <div class="left">
                  <div class="le-f">
                    <div>18000000000</div>
                    <div>
                      手机号码：
                      <span>{{item.phoneNumber}}</span>
                    </div>
                    <div>
                      订单编号：
                      <span>{{item.orderSn}}</span>
                    </div>
                  </div>
                  <div class="le-t" style="margin:22px 0 0 80px">
                    <div></div>
                    <div>
                      提交时间：
                      <span>{{item.createTime}}</span>
                    </div>
                    <div>
                      收货地址：
                      <span>{{item.address}}</span>
                    </div>
                  </div>
                </div>
                <div >
                  <div id="barcode" ref="barcode">
                    <barcode  :value="item.orderId" :options="barcode_option"></barcode>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { printShipments } from "../../api/order";
// import JsBarcode from 'jsbarcode'
import VueBarcode from "@xkeshi/vue-barcode";
export default {
  components: {
    'barcode': VueBarcode
  },
  data() {
    return {
      printShipmentsList: [], //返回的订单信息数据
      orId: "",
      barcode_option: {
        displayValue: true, //是否默认显示条形码数据
        background: "#fff",
        //条形码背景颜色
        width: "1px",
        //单个条形码的宽度
        height: "55px"
      }
    };
  },
  mounted() {
    printShipments(this.$route.query.orderIds).then(data => {
      if (data.data.status == 0) {
        this.printShipmentsList = data.data.data;
        this.printShipmentsList.forEach(item => {
          this.orId = item.orderSn;
        });
      }
    });
  },

  methods: {
    preview() {
      var barcodes=this.$refs.barcode
      var barcodesContent=barcodes.innerHTML
      document.body.innerHTML = barcodesContent;
      // var tablePrints = this.$refs.tablePrint;
      // var newContent = tablePrints.innerHTML;
      // var oldContent = document.body.innerHTML;
      // //赋值给body
      // document.body.innerHTML = newContent;
      window.print();
      // 重新加载页面，以刷新数据。以防打印完之后，页面不能操作的问题
      // window.location.reload();
      // document.body.innerHTML = oldContent;
      return false;
    }
  }
};
</script>
<style lang="less" scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.or-header {
  text-align: center;
  height: 70px;
  line-height: 70px;
  font-size: 26px;
  background: #f2f2f2;
}
.or-he {
  height: 50px;
  display: flex;
  justify-content: flex-end;
  border: 1px solid #f2f2f2;
  line-height: 50px;
  font-size: 12px;
  div {
    margin-right: 20px;
  }
}
.or-mu {
  padding: 0 30px;
  height: 150px;
  border: 1px solid #f2f2f2;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    display: flex;
    font-size: 12px;
    align-items: center;
    line-height: 25px;
  }
}

</style>