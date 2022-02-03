<template>
  <div id="capitalAccountVerifyList">
    <!-- 对账 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">对账</span>
        </div>
      </div>
      <div class="content">
        <div class="data_list">
          <div class="list_box" v-for="(item,index) in topData" :key="index">
            <img src="../../../../public/img/123dsfsds.png" v-if="index===0" />
            <img src="../../../../public/img/1231sa.png" v-if="index===1||index===2" />
            <img src="../../../../public/img/totle.png" v-if="index===3" />
            <div>
              <div>{{item.name}}</div>
              <div>{{item.data}}</div>
            </div>
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="small" @click="clearSearch">重置搜索</el-button>
            <el-button size="small" @click="showAll()">搜索</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>账单日期：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div>
            <el-dropdown @command="downLoadList">
              <el-button size="small">
                数据导出
                <i class="el-icon-arrow-down el-icon--right"></i>
              </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="all">全部数据</el-dropdown-item>
                <el-dropdown-item command="search" :disabled="isSearch">筛选数据</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
        </div>
        <el-table :data="recordList" border style="width: 100%">
          <el-table-column prop="billId" label="账单ID" align="center"></el-table-column>
          <el-table-column prop="billDate" label="日期" align="center"></el-table-column>
          <el-table-column prop="beginningOfPeriod" label="本期期初" align="center">
            <template slot-scope="scope">¥{{scope.row.beginningOfPeriod | moenyFilter}}</template>
          </el-table-column>
          <el-table-column prop="transferAmount" label="转入总额" align="center">
            <template slot-scope="scope">¥{{scope.row.transferAmount | moenyFilter}}</template>
          </el-table-column>
          <el-table-column prop="transfersNumber" label="转入笔数" align="center"></el-table-column>
          <el-table-column prop="transfersNumber" label="充值总额" align="center">
            <template slot-scope="scope">¥{{scope.row.transfersNumber | moenyFilter}}</template>
          </el-table-column>
          <el-table-column prop="rechargeNumber" label="充值笔数" align="center"></el-table-column>
          <el-table-column prop="transferOutAmount" label="转出总额" align="center">
            <template slot-scope="scope">¥{{scope.row.transferOutAmount | moenyFilter}}</template>
          </el-table-column>
          <el-table-column prop="transferOutNumber" label="转出笔数" align="center"></el-table-column>
          <el-table-column prop="withdrawAmount" label="提现金额" align="center">
            <template slot-scope="scope">¥{{scope.row.withdrawAmount | moenyFilter}}</template>
          </el-table-column>
          <el-table-column prop="withdrawNumber" label="提现笔数" align="center"></el-table-column>
          <el-table-column prop="endOfTerm" label="本期期末" align="center">
            <template slot-scope="scope">¥{{scope.row.endOfTerm | moenyFilter}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleFinanceDetails(scope.row)">财务明细</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import {
  getPayAccountReconciliationAmountAvailable,
  getPayAccountReconciliationRevenue,
  getPayAccountReconciliationExpenditure,
  getPayAccountReconciliationWithdraw,
  getPayAccountReconciliationTransferPage,
  exportPayAccountReconciliationTransferInfo
} from "../../../api/finance";
export default {
  components: { Paginationcom },
  data() {
    return {
      topData: [
        { name: "可用金额", data: "" },
        { name: "总收入", data: "" } /* 总收入1000笔 */,
        { name: "总支出", data: "" },
        { name: "已提现金额", data: "" }
      ] /* 顶部数据 */,
      searchTime: [],
      startTime: undefined /* 开始时间 */,
      endTime: undefined /* 结束时间 */,
      recordList: [] /* 对账列表 */,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = undefined;
          this.endTime = undefined;
        }
      }
    }
  },
  computed: {
    isSearch() {
      let boolean = true;
      if (this.startTime || this.endTime) {
        boolean = false;
      }
      return boolean;
    }
  },
  mounted() {
    this.showAll();
    getPayAccountReconciliationAmountAvailable(this.$route.query.outUserId).then(data => {
      this.topData[0].data = `¥${(data.data / 100).toFixed(2)}`;
    });
    getPayAccountReconciliationRevenue(this.$route.query.outUserId).then(data => {
      this.topData[1].name = `总收入${data.data.num}笔`;
      this.topData[1].data = `¥${(data.data.amount / 100).toFixed(2)}`;
    });
    getPayAccountReconciliationExpenditure(this.$route.query.outUserId).then(data => {
      this.topData[2].name = `总支出${data.data.num}笔`;
      this.topData[2].data = `¥${(data.data.amount / 100).toFixed(2)}`;
    });
    getPayAccountReconciliationWithdraw(this.$route.query.outUserId).then(data => {
      this.topData[3].data = `¥${(data.data.amount / 100).toFixed(2)}`;
    });
  },
  methods: {
    /** 财务明细 */
    handleFinanceDetails(row) {
      this.$router.push({
        name: "capitalAccountVerifyRecorddetails",
        query: { id: row.id, outUserId: row.outUserId, billDate: row.billDate }
      });
    },
    /** 重置搜索 */
    clearSearch() {
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    downLoadList(key) {
      if (key == "all") {
        exportPayAccountReconciliationTransferInfo({ outUserId: this.$route.query.outUserId }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}财务明细导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      } else {
        exportPayAccountReconciliationTransferInfo({
          outUserId: this.$route.query.outUserId,
          startDate: this.startTime,
          endDate: this.endTime
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}财务明细导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
    },
    showAll(val = {}) {
      getPayAccountReconciliationTransferPage({
        endDate: this.endTime,
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20,
        startDate: this.startTime,
        outUserId: this.$route.query.outUserId
      }).then(data => {
        console.log(data);
        if (data.data.status == 0) {
          this.recordList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  },
  filters:{
	  moenyFilter(val){
		  return (val/100).toFixed(2);
	  }
  }
};
</script>

<style lang='less'>
#capitalAccountVerifyList {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        div {
          margin-left: 15px;
          margin-right: 20px;
        }
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .data_list {
        margin-bottom: 30px;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        .list_box {
          padding: 30px 60px 30px 30px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          border: 1px solid #f2f2f2;
          margin-right: 50px;
          img {
            width: 50px;
            height: 50px;
            margin-right: 10px;
          }
          div {
            > div:first-child {
              font-size: 16px;
              color: #999999;
            }
            > div:last-child {
              margin-top: 5px;
              font-size: 20px;
              color: #666666;
            }
          }
        }
      }
    }
  }
}
</style>