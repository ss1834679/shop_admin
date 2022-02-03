<template>
  <div id="userDetails">
    <!-- 用户详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">用户详情</span>
      </div>
      <div class="content">
        <div class="usersDetails">
          <div class="userImg">
            <img v-if="usersDetails.avatar" :src="usersDetails.avatar.includes('http')?`${usersDetails.avatar}`:`${base}${usersDetails.avatar}`" alt />
          </div>
          <div class="userMsg">
            <div class="userMsgItem">
              <span class="userTitle">用户昵称：</span>
              <span class="ellipsis">{{usersDetails.nickname}}</span>
            </div>
            <div class="userMsgItem">
              <span v-if="usersDetails.source==1">来源：小程序</span>
              <span v-if="usersDetails.source==2">来源：安卓</span>
              <span v-if="usersDetails.source==3">来源：ios</span>
              <span v-if="usersDetails.source==4">来源：pc</span>
              <span v-if="usersDetails.source==5">来源：其他</span>
            </div>
            <div class="userMsgItem">
              <span v-if="usersDetails.gender==1">性别：男</span>
              <span v-if="usersDetails.gender==2">性别：女</span>
              <span v-if="usersDetails.gender==3">性别：保密</span>
            </div>
            <div class="userMsgItem">
              <span>成交订单：{{usersDetails.paidCount}}</span>
            </div>
            <div class="userMsgItem">
              <span>联系电话：{{usersDetails.phone}}</span>
            </div>
            <div class="userMsgItem">
              <span>注册时间：{{usersDetails.createTime}}</span>
            </div>
            <div class="userMsgItem">
              <span>生日：{{usersDetails.birthday}}</span>
            </div>
            <div class="userMsgItem">
              <span>成交金额：¥{{usersDetails.paidSum}}</span>
            </div>
          </div>
        </div>
        <div class="status">
          <el-tabs v-model="status" type="card">
            <el-tab-pane label="成交订单" name="order"></el-tab-pane>
            <el-tab-pane label="下单商品" name="good"></el-tab-pane>
            <el-tab-pane label="浏览记录" name="view"></el-tab-pane>
          </el-tabs>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
        </div>
        <el-table v-if="status=='order'" :data="orderList" border style="width: 100%">
          <el-table-column label="编号" width="80px" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="orderSn" label="订单编号" align="center"></el-table-column>
          <el-table-column prop="createTime" label="下单时间" align="center"></el-table-column>
          <el-table-column prop="recipient" label="收件人" align="center"></el-table-column>
          <el-table-column prop="phone" label="收件电话" align="center"></el-table-column>
          <el-table-column prop="addrInfo" label="收件地址" align="center">
            <template slot-scope="scope">{{scope.row.addrInfo}}</template>
          </el-table-column>
          <el-table-column prop="amountPaid" label="订单金额" align="center">
            <template slot-scope="scope">{{"¥"+(scope.row.amountPaid/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="订单状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orderStatus==1">待付款</span>
              <span v-if="scope.row.orderStatus==2">待发货</span>
              <span v-if="scope.row.orderStatus==3">待收货</span>
              <span v-if="scope.row.orderStatus==4">已完成</span>
              <span v-if="scope.row.orderStatus==5">待成团</span>
            </template>
          </el-table-column>
          <el-table-column prop="sourceType" label="订单来源" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.sourceType==1">WEB</span>
              <span v-if="scope.row.sourceType==2">app</span>
              <span v-if="scope.row.sourceType==3">微信公众号</span>
              <span v-if="scope.row.sourceType==4">微信小程序</span>
              <span v-if="scope.row.sourceType==5">H5手机页面</span>
            </template>
          </el-table-column>
          <el-table-column prop="payType" label="支付方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.payType==1">微信</span>
              <span v-if="scope.row.payType==2">支付宝</span>
              <span v-if="scope.row.payType==3">银联</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewOrder(scope.row)">查看订单</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-if="status=='good'" :data="goodsList" border style="width: 100%">
          <el-table-column label="编号" width="80px" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="goodsImage" align="center" label="商品图片" width="80">
            <template slot-scope="scope" v-if="scope.row.goodsImage">
              <Thumbnail :image="scope.row.goodsImage" />
            </template>
          </el-table-column>
          <el-table-column prop="goodsTitle" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="goodsData" label="规格" align="center"></el-table-column>
          <el-table-column prop="goodsNum" label="累计购买数量" align="center">
            <template slot-scope="scope">{{scope.row.goodsNum}}</template>
          </el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewGood(scope.row)">查看商品</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-table v-if="status=='view'" :data="viewList" border style="width: 100%">
          <el-table-column label="编号" width="80px" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="goodsId" label="商品ID" align="center"></el-table-column>
          <el-table-column prop="goodsImage" align="center" label="商品图片" width="80">
            <template slot-scope="scope" v-if="scope.row.goodsImage">
              <Thumbnail :image="scope.row.goodsImage" />
            </template>
          </el-table-column>
          <el-table-column prop="goodsTitle" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="views" label="累计浏览次数" align="center"></el-table-column>
          <el-table-column label="操作" width="80" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewGood(scope.row)">查看商品</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{getList({ page: val })}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getUserDealOrderList, getUserOrderGoodsList, getUserViewRecordsList } from "../../../api/user";
import Thumbnail from "../../../components/thumbnail";
import paginationCom from "../../../components/paginationCom";
export default {
  components: { paginationCom, Thumbnail },
  data() {
    return {
      usersDetails: {} /* 商品概况 */,
      status: "order" /* 统计图tab */,
      orderList: [],
      goodsList: [],
      viewList: [],
      base: "",
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    status: {
      handler() {
        /* 切换chart */
        this.total = 0;
        this.cPage = 1;
        this.size = 20;
        this.getList();
      }
    }
  },
  mounted() {
    this.base = this.$store.state.base_url;
    this.usersDetails = JSON.parse(this.$route.query.row);
    this.getorderList();
  },
  methods: {
    viewOrder(row) {
      let routeUrl = this.$router.resolve({ name: "order_view", query: { id: row.id, type: "newtag" } });
      window.open(routeUrl.href, "_blank");
    },
    viewGood(row) {
      let routeUrl = this.$router.resolve({ name: "goods_view", query: { id: row.goodsId, type: "newtag" } });
      window.open(routeUrl.href, "_blank");
    },
    getList(obj = {}) {
      if (this.status == "order") {
        this.getorderList(obj.page);
      } else if (this.status == "good") {
        this.getGoodList(obj.page);
      } else if (this.status == "view") {
        this.getViewList(obj.page);
      }
    },
    getorderList(page) {
      getUserDealOrderList({ userId: this.usersDetails.id, pageNum: page ? page : 1, pageSize: this.size }).then(
        data => {
          this.orderList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
          this.size = data.data.data.pageSize;
        }
      );
    },
    getGoodList(page) {
      getUserOrderGoodsList({ userId: this.usersDetails.id, pageNum: page ? page : 1, pageSize: this.size }).then(
        data => {
          this.goodsList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
          this.size = data.data.data.pageSize;
        }
      );
    },
    getViewList(page) {
      getUserViewRecordsList({ userId: this.usersDetails.id, pageNum: page ? page : 1, pageSize: this.size }).then(
        data => {
          this.viewList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
          this.size = data.data.data.pageSize;
        }
      );
    }
  }
};
</script>

<style lang='less'>
#userDetails {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .se-content {
        span {
          font-size: 15px;
        }
      }
      .usersDetails {
        // height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid rgba(215, 215, 215, 1);
        .userImg {
          width: 100px;
          height: 100px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .userMsg {
          width: calc(~"100% - 100px");
          padding: 0 10px;
          display: flex;
          flex-wrap: wrap;
          .userTitle {
            display: inline;
            line-height: 25px;
            min-width: 80px;
          }
          .userMsgItem {
            font-size: 14px;
            width: 15%;
            height: 50px;
            line-height: 25px;
            padding: 0 10px;
            display: flex;
            .ellipsis {
              line-height: 25px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
      .chartTab {
        .status {
          .el-tabs--card > .el-tabs__header .el-tabs__nav {
            border: 1px solid #e4e7ed;
          }
          .el-tabs__item {
            border-bottom: none;
          }
        }
        .chart {
          height: 350px;
        }
      }
    }
  }
}
</style>