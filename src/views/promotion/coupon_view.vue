<template>
  <div id="coupon_veiw">
    <!-- 优惠券详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">优惠券详情</span>
        </div>
      </div>
      <div class="content">
        <el-table :data="couponForm" style="width: 100%" border>
          <el-table-column label="名称" align="center">
            <template slot-scope="scope">{{scope.row.name}}</template>
          </el-table-column>
          <el-table-column label="优惠券类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.couponCategory==1">注册赠券</span>
              <span v-if="scope.row.couponCategory==2">购物赠券</span>
              <span v-if="scope.row.couponCategory==3">全场赠券</span>
              <span v-if="scope.row.couponCategory==4">会员赠券</span>
            </template>
          </el-table-column>
          <el-table-column label="可使用商品" align="center">
            <template slot-scope="scope">
              <div v-if="scope.row.appoint=='1'">
                <span>指定商品</span>
                <el-button type="text" style="margin-left:5px" @click="getToAlter">去查看</el-button>
              </div>
              <div v-if="scope.row.appoint=='2'">
                <span>指定商品分类</span>
                <el-button type="text" style="margin-left:5px" @click="getToAlter">去查看</el-button>
              </div>
              <div v-if="scope.row.appoint=='3'">
                <span>全场适用</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="使用门槛" align="center">
            <template slot-scope="scope">{{"¥"+(scope.row.fullMoney/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="面值" align="center">
            <template slot-scope="scope">{{"¥"+(scope.row.price/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isInvalid">已过期</span>
              <span v-else>未过期</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="couponForm" style="width: 100%;margin-bottom:15px" border>
          <el-table-column label="有效期" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.invalidType==1">{{scope.row.startTime}}到{{scope.row.endTime}}</span>
              <span v-if="scope.row.invalidType==2">领取日起{{scope.row.days}}天</span>
            </template>
          </el-table-column>
          <el-table-column label="总发行量" align="center">
            <template slot-scope="scope">{{scope.row.total}}</template>
          </el-table-column>
          <el-table-column label="已领取" align="center">
            <template slot-scope="scope">{{scope.row.total-scope.row.quota}}</template>
          </el-table-column>
          <el-table-column label="待领取" align="center">
            <template slot-scope="scope">{{scope.row.quota}}</template>
          </el-table-column>
          <el-table-column label="已使用" align="center">
            <template slot-scope="scope">{{scope.row.useCount}}</template>
          </el-table-column>
          <el-table-column label="未使用" align="center">
            <template slot-scope="scope">{{scope.row.total-scope.row.quota-scope.row.useCount}}</template>
          </el-table-column>
        </el-table>
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span class="s-size">请输入:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="订单编号" v-model="searchOrderId" @keyup.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchStatus" @change="selectByKwd" placeholder="推荐状态" clearable>
              <el-option label="未使用" value="0"></el-option>
              <el-option label="已使用" value="1"></el-option>
              <el-option label="已过期" value="-1"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>领取记录</span>
          </div>
        </div>

        <el-table :data="couponReceivedList" style="width: 100%" border>
          <el-table-column prop="id" label="优惠券ID" align="center"></el-table-column>
          <el-table-column prop="userId" label="领取会员ID" align="center"></el-table-column>
          <el-table-column prop="receiveType" label="领取方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveType=='1'">主动领取</span>
              <span v-else>后台赠送</span>
            </template>
          </el-table-column>
          <el-table-column prop="couponCreateTime" label="领取时间" align="center"></el-table-column>
          <el-table-column prop="status" label="当前状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status=='1'">已使用</span>
              <span v-if="scope.row.status=='0'">未使用</span>
            </template>
          </el-table-column>
          <el-table-column prop="useTime" label="使用时间" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.useTime">{{scope.row.useTime}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderSn" label="订单编号" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orderSn">{{scope.row.orderSn}}</span>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCouponById, getReceiveList } from "../../api/promotion";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      couponForm: [],
      couponReceivedList: [],
      searchOrderId: "",
      searchStatus: "",
      cPage: 1,
      size: 20,
      total: 0
    };
  },
  mounted() {
    getCouponById(this.$route.query.id).then(data => {
      if (data.data.status == 200) {
        this.couponForm.push(data.data.content);
      }
    });
    this.showAll();
  },
  methods: {
    getToAlter() {
      this.$router.push({ name: "coupon_alter", query: { id: this.$route.query.id } });
    },
    handleCurrentChange(val) {
      if (this.searchOrderId != "" || this.searchStatus != "") {
        this.selectByKwd({ page: val });
      } else {
        this.showAll(val);
      }
    },
    selectByKwd(obj) {
      getReceiveList({
        couponId: this.$route.query.id,
        pageNo: obj.page ? obj.page : 1,
        pageSize: 20,
        orderId: this.searchOrderId !== "" ? this.searchOrderId : null,
        status: this.searchStatus !== "" ? this.searchStatus : null
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          this.$message({
            type: "success",
            message: "搜索成功"
          });
        }
      });
    },
    showAll(val) {
      getReceiveList({ couponId: this.$route.query.id, pageNo: val ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    setView(data) {
      this.couponReceivedList = data.data.content.data.list;
      this.total = data.data.content.CouponNum;
      this.cPage = data.data.content.CouponNo;
    },
    clearSearch() {
      this.searchOrderId = "";
      this.searchStatus = "";
      this.showAll();
    }
  },
  components: { paginationCom }
};
</script>

<style lang='less'>
#coupon_veiw {
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
    .el-pagination {
      padding: 0;
      margin-top: 20px;
    }
  }
}
</style>
