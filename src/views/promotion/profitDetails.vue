<template>
  <div id="profitDetails">
    <!-- 分销收益明细 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">分销收益明细</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-back" style="margin-right:30px">返回</el-button>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="selectByKwd()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>订单编号：</span>
            <el-input placeholder="请输入订单编号" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>下单时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
          <div class="search_box">
            <span>结算状态：</span>
            <el-select v-model="searchSettlementStatus" @change="selectByKwd">
              <el-option label="全部" value="all"></el-option>
              <el-option label="待结算" :value="1"></el-option>
              <el-option label="已结算" :value="2"></el-option>
              <el-option label="已失效" :value="3"></el-option>
              <el-option label="已提现" :value="4"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="profitList" border style="width: 100%">
          <el-table-column prop="orderSn" label="订单编号"></el-table-column>
          <el-table-column prop="resultsAmount" align="center" label="业绩金额">
            <template slot-scope="scope">{{"¥"+(scope.row.resultsAmount/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="结算状态" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.performanceStatus==1">待结算</span>
              <span v-if="scope.row.performanceStatus==2">已结算</span>
              <span v-if="scope.row.performanceStatus==3">已失效</span>
              <span v-if="scope.row.performanceStatus==4">已提现</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderTime" label="下单时间"></el-table-column>
          <el-table-column prop="settlementTime" label="结算时间">
            <template slot-scope="scope">{{scope.row.settlementTime?scope.row.settlementTime:'/'}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="viewOrderDetail(scope.row)">订单详情</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGroupPerformance } from "../../api/distribuManage";
import paginationCom from "../../components/paginationCom";
export default {
  components: { paginationCom },
  data() {
    return {
      searchSettlementStatus: "all" /* 结算状态 */,
      searchInput: "" /* 订单编号 */,
      searchTime: [] /* 时间搜索 */,
      startTime: null,
      endTime: null,
      profitList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
          this.selectByKwd();
        } else {
          this.startTime = null;
          this.endTime = null;
          this.selectByKwd();
        }
        /* 搜索 */
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    viewOrderDetail(rows) {
      this.$router.push({ name: "order_view", query: { id: rows.orderId } });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchSettlementStatus = "all";
      this.searchInput = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.showAll();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchSettlementStatus != "all" || this.searchInput != "" || this.startTime != null) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}, type) {
      getGroupPerformance({
        id: this.$route.query.id,
        pageIndex: val.page ? val.page : 1,
        pageSize: 20,
        endTime: this.endTime,
        startTime: this.startTime,
        orderSn: this.searchInput == "" ? null : this.searchInput,
        performanceStatus: this.searchSettlementStatus == "all" ? null : this.searchSettlementStatus
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.profitList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(val) {
      getGroupPerformance({ id: this.$route.query.id, pageIndex: val ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#profitDetails {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
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
        .el-button {
          margin-right: 20px;
          height: 36px;
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
