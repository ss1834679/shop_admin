<template>
  <div id="groupShopping_detail">
    <!-- 团单的详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">拼团管理</span>
        </div>
      </div>
      <div class="content">
        <div class="info">
          <b class="title">拼团信息</b>
          <!-- <div class="groupShopImage">
            <span>拼团详情二维码：</span>
            <div class="qrcode" ref="qrCodeUrl"></div>
          </div>-->
          <el-table :data="assembleBasicInfo" border style="width: 100%">
            <el-table-column prop="assembleSn" label="团单号"></el-table-column>
            <el-table-column label="团购人数" align="center">
              <template slot-scope="scope">{{ scope.row.existPersonNum+"/"+scope.row.assemblePersonNum}}</template>
            </el-table-column>
            <el-table-column prop="startTime" label="开团时间" align="center"></el-table-column>
            <el-table-column prop="endTime" label="到期时间" align="center"></el-table-column>
            <el-table-column label="状态" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">拼团中</span>
                <span v-if="scope.row.status==1">拼团成功</span>
                <span v-if="scope.row.status==2">拼团失败</span>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="info">
          <b class="title">用户信息</b>
          <el-table border :data="assembleInfo.assembleOrdersInfos" style="width: 100%">
            <el-table-column prop="orderSn" label="订单号"></el-table-column>
            <el-table-column prop="nickname" label="买家昵称"></el-table-column>
            <el-table-column prop="phone" label="电话"></el-table-column>
            <el-table-column prop="payType" label="支付方式">
              <template slot-scope="scope">
                <span v-if="scope.row.payType == '1'">微信</span>
                <span v-if="scope.row.payType == '2'">支付宝</span>
                <span v-if="scope.row.payType == '3'">银联</span>
              </template>
            </el-table-column>
            <el-table-column prop="orderStatus" label="订单状态">
              <template slot-scope="scope">{{scope.row.orderStatus}}</template>
            </el-table-column>
            <el-table-column prop="goodsNum" label="购买数量"></el-table-column>
            <el-table-column prop="goodsPrice" label="拼团价格">
              <template slot-scope="scope">{{"¥"+(scope.row.goodsPrice/100).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="expressAmount" label="运费">
              <template slot-scope="scope">{{"¥"+(scope.row.goodsPrice/100).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="disPrice" label="优惠金额">
              <template slot-scope="scope">{{"¥"+(scope.row.goodsPrice/100).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="amountPaid" label="实付金额">
              <template slot-scope="scope">{{"¥"+(scope.row.goodsPrice/100).toFixed(2)}}</template>
            </el-table-column>
            <el-table-column prop="createTime" label="下单时间"></el-table-column>
            <el-table-column prop="addrInfo" label="收货地址"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="viewOrderDetail(scope.row)">查看订单</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="info">
          <b class="title">商品信息</b>
          <el-table :data="assembleInfo.assembleGoodsInfos" border style="width: 100%">
            <el-table-column label="商品ID" prop="goodsId"></el-table-column>
            <el-table-column label="商品标题" prop="goodsTitle"></el-table-column>
            <el-table-column label="商品图片">
              <template slot-scope="scope" v-if="scope.row.goodsImage">
                <Thumbnail :image="scope.row.goodsImage" />
              </template>
            </el-table-column>
            <el-table-column label="规格" prop="goodsData"></el-table-column>
            <el-table-column label="拼团总数" prop="assembleNum"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// import QRCode from "qrcodejs2";
import { getAssembleInfoById } from "../../api/promotion";
import Thumbnail from "../../components/thumbnail";
export default {
  components: { Thumbnail },
  data() {
    return {
      assembleInfo: {} /* 团单信息 */,
      assembleBasicInfo: [],
      orderInfo1: [],
      recipientList: [],
      shareId: "",
      assmbleSn: ""
      // qrcode:{}
    };
  },
  mounted() {
    this.orderId = this.$route.query.id;
    if (this.$route.query.id) {
      getAssembleInfoById(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.assembleInfo = data.data.content;
          this.assembleBasicInfo.push(this.assembleInfo.assembleBasicInfo);
          this.shareId = this.assembleInfo.assembleGoodsInfos[0].goodsId;
          this.assmbleSn = this.assembleInfo.assembleBasicInfo.assembleSn;
          // this.creatQrCode();
        }
      });
    }
  },
  methods: {
    viewOrderDetail(row) {
      this.$router.push({ name: "order_view", query: { id: row.ordersId } });
    },
    // creatQrCode() {
    //   this.qrcode = new QRCode(this.$refs.qrCodeUrl, {
    //     text: `/pagesB/shopping/components/invitation?id=${this.shareId}&assmbleSn=${this.assmbleSn}`, // 需要转换为二维码的内容
    //     width: 100,
    //     height: 100,
    //     colorDark: "#000000",
    //     colorLight: "#ffffff",
    //     correctLevel: QRCode.CorrectLevel.H
    //   });
    // }
  }
};
</script>

<style lang='less'>
#groupShopping_detail {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      .info {
        margin-top: 15px;
        margin-bottom: 15px;
        .groupShopImage {
          margin-top: 12px;
          margin-bottom: 12px;
          height: 170px;
          width: 100%;
          display: flex;
          align-items: center;
          span {
            line-height: 170px;
          }
          img {
            width: 170px;
            height: 170px;
          }
        }
      }
    }
  }
}
</style>