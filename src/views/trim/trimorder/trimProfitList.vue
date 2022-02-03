<template>
  <div id="trimProfitList">
    <!-- 装修订单利润 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">装修订单利润</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>状态：</span>
            <el-select v-model="searchStatus" @change="showAll" placeholder="请选择状态" clearable>
              <el-option label="装修中" :value="7"></el-option>
              <el-option label="装修完毕" :value="8"></el-option>
              <el-option label="装修终止" :value="10"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="tProfitList" border style="width: 100%">
          <el-table-column label="业主" align="center" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.ownerName&&scope.row.ownerPhone">
                <p>{{scope.row.ownerPhone}}</p>
                <p>{{scope.row.ownerName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column label="管家" align="center" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.houseKeeperName&&scope.row.houseKeeperPhone">
                <p>{{scope.row.houseKeeperPhone}}</p>
                <p>{{scope.row.houseKeeperName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="项目经理" align="center" width="110">
            <template slot-scope="scope">
              <div v-if="scope.row.projectManagerName&&scope.row.projectManagerPhone">
                <p>{{scope.row.projectManagerPhone}}</p>
                <p>{{scope.row.projectManagerName}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="villageName" label="小区名称" align="center" min-width="100"></el-table-column>
          <el-table-column prop="houseNumber" label="门牌号" align="center"></el-table-column>
          <el-table-column label="户型" align="center">
            <template slot-scope="scope">
              <span>{{`${scope.row.roomNum?scope.row.roomNumDesc:""}${scope.row.hallNum?scope.row.hallNumDesc:""}${scope.row.toiletNum?scope.row.toiletNumDesc:""}`}}</span>
            </template>
          </el-table-column>
          <el-table-column label="面积" align="center">
            <template slot-scope="scope">{{scope.row.acreage}}㎡</template>
          </el-table-column>
          <el-table-column prop="styleDesc" label="风格" align="center"></el-table-column>
          <el-table-column label="定金" align="center">
            <template slot-scope="scope">
              <span style="color:red">¥{{(scope.row.earnestMoney/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="价格" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.decoratePrice" style="color:red">¥{{(scope.row.decoratePrice/1000000).toFixed(2)}}万</span>
            </template>
          </el-table-column>
          <el-table-column label="位置" align="center">
            <template slot-scope="scope">
              <span>{{`${scope.row.city?scope.row.city:""}${scope.row.district?scope.row.district:""}`}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="processClassifyName" label="使用装修流程" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.processClassifyName">{{scope.row.processClassifyName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="profit" label="累计利润" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleCumulativeProfit(scope.row)">
                <span style="color:red">¥{{(scope.row.profit/100).toFixed(2)}}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="withdraw" label="已提现" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="handleAlreadyWithdrawal(scope.row)">
                <span style="color:red">¥{{(scope.row.withdraw/100).toFixed(2)}}</span>
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="surplusProfit" label="剩余利润" align="center">
            <template slot-scope="scope">
              <span style="color:red">¥{{(scope.row.surplusProfit/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orderStatus==7" style="color:red">装修中</span>
              <span v-if="scope.row.orderStatus==8" style="color:red">装修完毕</span>
              <span v-if="scope.row.endStatus==1" style="color:red">装修终止</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group v-if="butlerVisible||managerVisible" class="alterDel">
                <el-button type="text" @click="handleWithDrawal(scope.row)">提现</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
      <!-- 累计利润明细弹窗 -->
      <el-dialog :visible.sync="cumulativeVisible" center width="630px" @close="handleCloseCumulative" class="cumulativeTable">
        <el-table :data="cumulativeProfitList" border style="width: 100%" height="500px">
          <el-table-column label="分账服务商" align="center" width="145">
            <template slot-scope="scope">
              <div v-if="scope.row.name&&scope.row.account">
                <p>{{scope.row.account}}</p>
                <p>{{scope.row.name}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="分账金额" align="center" width="115">
            <template slot-scope="scope">
              <span style="color:red">¥{{(scope.row.accountPaid/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column label="利润" align="center" width="130">
            <template slot-scope="scope">
              <span style="color:red">¥{{(scope.row.profit/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="确认分账时间" align="center"></el-table-column>
        </el-table>
      </el-dialog>
      <!-- 提现明细弹窗 -->
      <el-dialog :visible.sync="alreadyVisible" center width="630px" @close="handleCloseAlready" class="cumulativeTable">
        <el-table :data="alreadyWithdrawalList" border style="width: 100%" height="500px">
          <el-table-column prop="operator" label="提现操作人" align="center" width="145"></el-table-column>
          <el-table-column label="提现金额" align="center" width="115">
            <template slot-scope="scope">
              <span style="color:red">¥{{(scope.row.withdraw/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="提现时间" align="center"></el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import { mapGetters } from "vuex";
import {
  getProfitDecorateOrderPage,
  getProfitRecordPageByOrderId,
  getWithdrawRecordPageByOrderId,
  saveWithdrawRecord
} from "../../../api/trim";
export default {
  components: { Paginationcom },
  data() {
    return {
      searchStatus: "" /* 搜索分类 */,
      tProfitList: [],
      cumulativeProfitList: [] /* 获取订单累计利润 */,
      alreadyWithdrawalList: [] /* 获取订单已提现 */,
      cumulativeVisible: false /* 累计利润可见 */,
      alreadyVisible: false /* 已提现可见 */,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
  },
  computed: {
    ...mapGetters({
      butlerVisible: "onGetIsButler",
      managerVisible: "onGetIsManager"
    })
  },
  methods: {
    handleWithDrawal(row) {
      if (row.surplusProfit < 10000) {
        this.$message.error("提现金额至少为100元");
      } else {
        this.$alert(
          `为平台账户提现“¥${(row.surplusProfit / 100).toFixed(2)}”，提现后会即时到账平台银行账户，确认提现吗？`,
          "",
          {
            confirmButtonText: "确定",
            center: true
          }
        )
          .then(() => {
            saveWithdrawRecord({ decorateOrderId: row.id, withdraw: row.surplusProfit }).then(data => {
              if (data.data.status == 0) {
                this.$message.success("提现成功");
                this.showAll();
              } else {
                this.$message.error(data.data.msg);
              }
            });
          })
          .catch(() => {});
      }
    },
    handleCumulativeProfit(row) {
      getProfitRecordPageByOrderId(row.id).then(data => {
        if (data.data.status == 0) {
          this.cumulativeProfitList = data.data.data;
          this.cumulativeVisible = true;
        }
      });
    },
    handleAlreadyWithdrawal(row) {
      getWithdrawRecordPageByOrderId(row.id).then(data => {
        if (data.data.status == 0) {
          this.alreadyWithdrawalList = data.data.data;
          this.alreadyVisible = true;
        }
      });
    },
    handleCloseCumulative() {
      this.cumulativeVisible = false;
      this.cumulativeProfitList = new Array();
    },
    handleCloseAlready() {
      this.alreadyVisible = false;
      this.alreadyWithdrawalList = new Array();
    },
    /** 查看 */
    viewTrimOrder(row) {
      this.$router.push({
        name: "trimOrderDetail",
        params: { routerTitle: "查看装修订单" },
        query: { id: row.id }
      });
    },
    showAll(val = {}) {
      getProfitDecorateOrderPage({
        orderType: this.searchStatus == "" ? undefined : this.searchStatus,
        page: val.page ? val.page : this.cPage,
        pagesize: 20
      }).then(data => {
        this.tProfitList = data.data.data.list;
        this.total = data.data.data.total;
        this.cPage = data.data.data.pageNum;
      });
    }
  }
};
</script>

<style lang='less'>
#trimProfitList {
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
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .cumulativeTable {
    p {
      margin: 0;
    }
  }
}
</style>