<template>
  <div id="capitalAccountDetails">
    <!-- 资金账户明细 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">资金账户</span>
        </div>
        <div>
          <el-button size="small" @click="handleExport">导出数据</el-button>
        </div>
      </div>
      <div class="baseHaedbox">
        <div class="basebox">
          <template v-for="it in baseDetails">
            <div :key="it.title" v-if="it.value" class="baseboxItem">
              <span>{{it.title}}{{it.value}}</span>
            </div>
          </template>
        </div>
        <div class="basemoney">
          <template v-for="it in baseMoney">
            <div :key="it.title" v-if="it.value" class="basemoneyItem">
              <strong>{{it.value}}</strong>
              <p>{{it.title}}</p>
            </div>
          </template>
        </div>
      </div>
      <div class="status">
        <el-tabs @tab-click="handleChangeTab" v-model="status" type="card">
          <el-tab-pane label="转账明细" name="1"></el-tab-pane>
          <el-tab-pane label="提现明细" name="2"></el-tab-pane>
          <el-tab-pane label="充值明细" name="3"></el-tab-pane>
          <el-tab-pane label="应收款明细" name="4"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button size="small" @click="clearSearch">重置搜索</el-button>
            <el-button size="small" @click="showAll()">搜索</el-button>
          </div>
        </div>
        <div class="search" v-if="status=='1'">
          <div class="search_box">
            <span>订单编号：</span>
            <el-input placeholder="订单编号" v-model.trim="searchOrderId" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>分账编号：</span>
            <el-input placeholder="分账编号" v-model.trim="searchRecordId" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>流水号：</span>
            <el-input placeholder="流水号" v-model.trim="searchSerialNumber" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>转账类型：</span>
            <el-select v-model="searchTransferType " @change="showAll" placeholder="请选择转账类型" clearable>
              <el-option label="全部" :value="''"></el-option>
              <el-option label="转入" :value="1"></el-option>
              <el-option label="转出" :value="0"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>交易类型：</span>
            <el-select v-model="searchTradeType" @change="showAll" placeholder="请选择交易类型" clearable>
              <el-option label="全部" :value="''"></el-option>
              <el-option label="装修" :value="0"></el-option>
              <el-option label="退款" :value="2"></el-option>
              <el-option label="增项" :value="1"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>付款账户：</span>
            <el-input placeholder="付款账户" v-model.trim="searchPayAccount" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>付款账户名称：</span>
            <el-input placeholder="付款账户名称" v-model.trim="searchPayUserName" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>收款账户：</span>
            <el-input placeholder="收款账户" v-model.trim="searchCollectionAccount" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>收款账户名称：</span>
            <el-input placeholder="收款账户名称" v-model.trim="searchCollectionUserName" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>交易成功时间：</span>
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
        <div class="search" v-if="status=='2'">
          <div class="search_box">
            <span>流水号：</span>
            <el-input placeholder="业务流水号" v-model.trim="searchSerialNumber" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>银行卡号：</span>
            <el-input placeholder="银行卡号" v-model.trim="searchBankCardId" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>交易成功时间：</span>
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
        <div class="search" v-if="status=='3'">
          <div class="search_box">
            <span>流水号：</span>
            <el-input placeholder="业务流水号" v-model.trim="searchSerialNumber" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>银行卡号：</span>
            <el-input placeholder="银行卡号" v-model.trim="searchBankCardId" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>交易成功时间：</span>
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
        <div class="search" v-if="status=='4'">
          <div class="search_box">
            <span>付款账户：</span>
            <el-input placeholder="付款账户" v-model.trim="searchPayAccount" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>付款账户名称：</span>
            <el-input placeholder="付款账户名称" v-model.trim="searchPayUserName" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>订单编号：</span>
            <el-input placeholder="订单编号" v-model.trim="searchOrderId" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>预计到账时间：</span>
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
        </div>
        <el-table :data="transferDetailsList" border v-if="status=='1'" style="width: 100%">
          <el-table-column label="编号" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column label="转账类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.transferType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易类型" align="center">
            <template slot-scope="scope">
              <span>{{scope.row.tradingType}}</span>
            </template>
          </el-table-column>
          <el-table-column label="交易金额" align="center">
            <template slot-scope="scope">¥{{scope.row.tradeAmount}}</template>
          </el-table-column>
          <el-table-column label="手续费金额" align="center">
            <template slot-scope="scope">¥{{scope.row.chargeAmount}}</template>
          </el-table-column>
          <el-table-column label="实际到账金额" align="center">
            <template slot-scope="scope">¥{{scope.row.actualAmount}}</template>
          </el-table-column>
          <el-table-column label="付款账户" align="center">
            <template slot-scope="scope">{{scope.row.buyerUserAccount}}</template>
          </el-table-column>
          <el-table-column label="付款账户名称" align="center">
            <template slot-scope="scope">{{scope.row.buyerAcctName}}</template>
          </el-table-column>
          <el-table-column label="付款用户账号" align="center">
            <template slot-scope="scope">{{scope.row.buyerAccount}}</template>
          </el-table-column>
          <el-table-column label="收款账户" align="center">
            <template slot-scope="scope">{{scope.row.sellerUserAccount}}</template>
          </el-table-column>
          <el-table-column label="收款账户名称" align="center">
            <template slot-scope="scope">{{scope.row.sellerAcctName}}</template>
          </el-table-column>
          <el-table-column label="收款用户账号" align="center">
            <template slot-scope="scope">{{scope.row.sellerAccount}}</template>
          </el-table-column>
          <el-table-column label="订单编号" align="center">
            <template slot-scope="scope">{{scope.row.orderSn}}</template>
          </el-table-column>
          <el-table-column label="分账编号" align="center">
            <template slot-scope="scope">{{scope.row.accountingRecordsSn}}</template>
          </el-table-column>
          <el-table-column label="交易成功时间" align="center">
            <template slot-scope="scope">{{scope.row.notifyTime}}</template>
          </el-table-column>
          <el-table-column label="流水号" align="center">
            <template slot-scope="scope">{{scope.row.serialSn}}</template>
          </el-table-column>
          <el-table-column label="备注" align="center">
            <template slot-scope="scope">{{scope.row.remark}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleViewTrimOrder(scope.row)">查看订单</el-button>
                <el-button type="text" @click="handleViewProfit(scope.row)">查看分账</el-button>
              </el-button-group>
              <el-button-group class="alterDel" v-if="scope.row.tradingType=='增项'">
                <el-button type="text" @click="handleViewAppend(scope.row)">查看增项</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="withdrawalDetailsList" border v-if="status=='2'" style="width: 100%">
          <el-table-column label="编号" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column label="提现金额" align="center">
            <template slot-scope="scope">¥{{scope.row.amount}}</template>
          </el-table-column>
          <el-table-column label="手续费金额" align="center">
            <template slot-scope="scope">¥{{scope.row.chargeAmount}}</template>
          </el-table-column>
          <el-table-column label="实际到账金额" align="center">
            <template slot-scope="scope">¥{{scope.row.actualAmount}}</template>
          </el-table-column>
          <el-table-column label="收款方姓名" align="center">
            <template slot-scope="scope">{{scope.row.corpName}}</template>
          </el-table-column>
          <el-table-column label="收款银行卡号" align="center">
            <template slot-scope="scope">{{scope.row.bankCardNo}}</template>
          </el-table-column>
          <el-table-column label="交易创建时间" align="center">
            <template slot-scope="scope">{{scope.row.createTime}}</template>
          </el-table-column>
          <el-table-column label="转账类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.acctType=='PERSON'">个人</span>
              <span v-else>企业</span>
            </template>
          </el-table-column>
          <el-table-column label="流水号" align="center">
            <template slot-scope="scope">{{scope.row.merchOrderNo}}</template>
          </el-table-column>
          <el-table-column label="交易备注" align="center">
            <template slot-scope="scope">{{`${scope.row.memo?scope.row.memo:'N/A'}`}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center" width="160">
            <template slot-scope="scope">
              <span v-if="scope.row.orderStatus=='INIT'">初始化</span>
              <span v-if="scope.row.orderStatus=='PROCESSING'">处理中</span>
              <span v-if="scope.row.orderStatus=='FAIL'">失败</span>
              <span v-if="scope.row.orderStatus=='SUCCESS'">成功</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="rechargeDetailsList" border v-if="status=='3'" style="width: 100%">
          <el-table-column label="编号" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column label="充值金额" align="center">
            <template slot-scope="scope">¥{{scope.row.amount}}</template>
          </el-table-column>
          <el-table-column label="手续费金额" align="center">
            <template slot-scope="scope">¥{{scope.row.chargeAmount}}</template>
          </el-table-column>
          <el-table-column label="实际到账金额" align="center">
            <template slot-scope="scope">¥{{scope.row.actualAmount}}</template>
          </el-table-column>
          <el-table-column label="付款银行卡号" align="center">
            <template slot-scope="scope">{{scope.row.bankCard}}</template>
          </el-table-column>
          <el-table-column label="流水号" align="center">
            <template slot-scope="scope">{{scope.row.merchOrderNo}}</template>
          </el-table-column>
          <el-table-column label="交易创建时间" align="center">
            <template slot-scope="scope">{{scope.row.merchCreateTime}}</template>
          </el-table-column>
          <el-table-column label="交易成功时间" align="center">
            <template slot-scope="scope">{{scope.row.finishTime}}</template>
          </el-table-column>
          <el-table-column label="交易备注" align="center">
            <template slot-scope="scope">{{`${scope.row.memo?scope.row.memo:'N/A'}`}}</template>
          </el-table-column>
          <el-table-column label="状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.tradeStatus=='INIT'">初始状态</span>
              <span v-if="scope.row.tradeStatus=='PROCESSING'">处理中</span>
              <span v-if="scope.row.tradeStatus=='SUCCESS'">交易成功</span>
              <span v-if="scope.row.tradeStatus=='FAIL'">交易失败</span>
              <span v-if="scope.row.tradeStatus=='CLOSE'">交易关闭</span>
            </template>
          </el-table-column>
        </el-table>
        <el-table :data="receivablesDetailsList" border v-if="status=='4'" style="width: 100%">
          <el-table-column label="编号" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column label="交易金额" align="center">
            <template slot-scope="scope">¥{{scope.row.amount}}</template>
          </el-table-column>
          <el-table-column label="手续费金额" align="center">
            <template slot-scope="scope">¥{{scope.row.chargeAmount}}</template>
          </el-table-column>
          <el-table-column label="预计到账金额" align="center">
            <template slot-scope="scope">¥{{scope.row.actualAmount}}</template>
          </el-table-column>
          <el-table-column label="付款账户" align="center">
            <template slot-scope="scope">{{scope.row.userAccount}}</template>
          </el-table-column>
          <el-table-column label="付款账户名称" align="center">
            <template slot-scope="scope">{{scope.row.acctName}}</template>
          </el-table-column>
          <el-table-column label="付款用户账号" align="center">
            <template slot-scope="scope">{{scope.row.account}}</template>
          </el-table-column>
          <el-table-column label="订单编号" align="center">
            <template slot-scope="scope">{{scope.row.decorateOrderSn}}</template>
          </el-table-column>
          <el-table-column label="节点编号" align="center">
            <template slot-scope="scope">{{scope.row.bigNodeId}}</template>
          </el-table-column>
          <el-table-column label="预计到账时间" align="center">
            <template slot-scope="scope">{{scope.row.completeTime}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleViewTrimOrder(scope.row)">查看订单</el-button>
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
  getCapitalAccountDetailsByAccount,
  getCapitalAccountMoney,
  getCapitalAccountWithdrawal,
  getCapitalAccountInto,
  getCapitalAccountRollout,
  getCapitalAccountReceivable,
  getCapitalAccountTransferPage,
  getCapitalAccountWithdrawalPage,
  getCapitalAccountRechargePage,
  getCapitalAccountReceivablesPage,
  exportCapitalAccountFundDetails
} from "../../../api/finance";
export default {
  components: { Paginationcom },
  data() {
    return {
      status: "1",
      searchOrderId: "" /* 订单编号 */,
      searchRecordId: "" /* 分账编号 */,
      searchSerialNumber: "" /* 流水号 */,
      searchTransferType: "" /* 转账类型 */,
      searchTradeType: "" /* 交易类型 1.装修，2.退款，3.增项 */,
      searchPayAccount: "" /* 付款账户 */,
      searchPayUserName: "" /* 付款账户名称 */,
      searchCollectionAccount: "" /* 收款账户 */,
      searchCollectionUserName: "" /* 收款账户名称 */,
      searchBankCardId: "" /* 银行卡号 */,
      searchTime: [],
      startTime: undefined /* 开始时间 */,
      endTime: undefined /* 结束时间 */,
      baseDetails: [
        { title: "资金账户：", value: "" },
        { title: "用户ID：", value: "" },
        { title: "账户名称：", value: "" },
        { title: "用户账号：", value: "" },
        { title: "角色类型：", value: "" },
        { title: "账户类型：", value: "" },
        { title: "注册时间：", value: "" },
        { title: "激活时间：", value: "" }
      ] /* 资金账户详情 */,
      baseMoney: [
        { title: "总金额", value: "" },
        { title: "可用金额", value: "" },
        { title: "冻结金额", value: "" },
        { title: "已提现", value: "" } /* 已提现20笔 */,
        { title: "转入", value: "" } /* 转入20笔 */,
        { title: "转出", value: "" } /* 转出20笔 */,
        { title: "应收", value: "" } /* 应收30笔 */
      ],
      transferDetailsList: [] /* 转账明细列表 */,
      withdrawalDetailsList: [] /* 提现明细列表 */,
      rechargeDetailsList: [] /* 充值明细列表 */,
      receivablesDetailsList: [] /* 应收款明细列表 */,
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
  mounted() {
    this.showAll();
    getCapitalAccountDetailsByAccount(this.$route.query.capitalId).then(data => {
      if (data.data.status == 0) {
        this.baseDetails[0].value = data.data.data.userAccount;
        this.baseDetails[1].value = data.data.data.userId;
        this.baseDetails[2].value = data.data.data.acctName;
        this.baseDetails[3].value = data.data.data.account;
        this.baseDetails[4].value = data.data.data.roleName;
        this.baseDetails[5].value = data.data.data.acctType == "PERSON" ? "个人" : "企业";
        this.baseDetails[6].value = data.data.data.createTime;
        this.baseDetails[7].value = data.data.data.createTime;
      }
    });
    getCapitalAccountMoney(this.$route.query.capitalId).then(data => {
      if (data.data.status == 0) {
        this.baseMoney[0].value = `￥${data.data.data.totalMoney}`;
        this.baseMoney[1].value = `￥${data.data.data.balanceMoney}`;
        this.baseMoney[2].value = `￥${data.data.data.freezeMoney}`;
      }
    });
    getCapitalAccountWithdrawal(this.$route.query.capitalId).then(data => {
      if (data.data.status == 0) {
        console.log(data);
        this.baseMoney[3].title = `已提现${data.data.data.number}笔`;
        this.baseMoney[3].value = `￥${(data.data.data.amount / 100).toFixed(2)}`;
      }
    });
    getCapitalAccountInto(this.$route.query.capitalId).then(data => {
      console.log(data, 1);
      if (data.data.status == 0) {
        this.baseMoney[4].title = `转入${data.data.data.number}笔`;
        this.baseMoney[4].value = `￥${(data.data.data.amount / 100).toFixed(2)}`;
      }
    });
    getCapitalAccountRollout(this.$route.query.capitalId).then(data => {
      console.log(data, 2);
      if (data.data.status == 0) {
        this.baseMoney[5].title = `转出${data.data.data.number}笔`;
        this.baseMoney[5].value = `￥${(data.data.data.amount / 100).toFixed(2)}`;
      }
    });
    getCapitalAccountReceivable(this.$route.query.outUserId).then(data => {
      console.log(data, 3);
      if (data.data.status == 0) {
        this.baseMoney[6].title = `应收${data.data.data.num}笔`;
        this.baseMoney[6].value = `￥${(data.data.data.money / 100).toFixed(2)}`;
      }
    });
  },
  methods: {
    handleExport() {
      exportCapitalAccountFundDetails(this.$route.query.outUserId).then(data => {
        let a = document.createElement("a");
        a.href = data.request.responseURL;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
    },
    /** 查看订单 */
    handleViewTrimOrder(row) {
      let routeUrl = this.$router.resolve({
        name: "trimOrderDetail",
        params: { routerTitle: "查看装修订单" },
        query: { id: row.orderSn || row.decorateOrderSn, type: "newtag" }
      });
      window.open(routeUrl.href, "_blank");
    },
    /** 查看分账 */
    handleViewProfit(row) {
      let routeUrl = this.$router.resolve({
        name: "profitList",
        query: { orderId: row.orderSn, id: row.accountingRecordsSn, type: "newtag" }
      });
      window.open(routeUrl.href, "_blank");
    },
    /** 查看增项 */
    handleViewAppend(row) {
      let routeUrl = this.$router.resolve({
        name: "appendMaterialList",
        query: { id: row.decorateAdditionsId, type: "newtag" } // 增项id
      });
      window.open(routeUrl.href, "_blank");
    },
    /** 重置搜索 */
    clearSearch() {
      this.searchOrderId = "";
      this.searchRecordId = "";
      this.searchSerialNumber = "";
      this.searchTransferType = "";
      this.searchTradeType = "";
      this.searchPayAccount = "";
      this.searchPayUserName = "";
      this.searchCollectionAccount = "";
      this.searchCollectionUserName = "";
      this.searchBankCardId = "";
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    handleChangeTab() {
      this.cPage = 1;
      this.total = 0;
      this.clearSearch();
    },
    showAll(val = {}) {
      if (this.status == "1") {
        getCapitalAccountTransferPage({
          accountingRecordsSn: this.searchRecordId == "" ? undefined : this.searchRecordId,
          buyerAcctName: this.searchPayUserName == "" ? undefined : this.searchPayUserName,
          buyerUserAccount: this.searchPayAccount == "" ? undefined : this.searchPayAccount,
          orderSn: this.searchOrderId == "" ? undefined : this.searchOrderId,
          outUserId: this.$route.query.outUserId,
          pageNo: val.page ? val.page : this.cPage,
          pageSize: 20,
          sellerAcctName: this.searchCollectionUserName == "" ? undefined : this.searchCollectionUserName,
          sellerUserAccount: this.searchCollectionAccount == "" ? undefined : this.searchCollectionAccount,
          serialSn: this.searchSerialNumber == "" ? undefined : this.searchSerialNumber,
          startDate: this.startTime,
          endDate: this.endTime,
          tradingType: this.searchTradeType == "" ? undefined : this.searchTradeType,
          transferType: this.searchTransferType == "" ? undefined : this.searchTransferType
        }).then(data => {
          if (data.data.status == 0) {
            this.transferDetailsList = data.data.data.list;
            this.cPage = data.data.data.pageNum;
            this.total = data.data.data.total;
          }
        });
      } else if (this.status == "2") {
        getCapitalAccountWithdrawalPage({
          bankCardNo: this.searchBankCardId == "" ? undefined : this.searchBankCardId,
          endDate: this.endTime,
          merchOrderNo: this.searchSerialNumber == "" ? undefined : this.searchSerialNumber,
          outUserId: this.$route.query.outUserId,
          pageNo: val.page ? val.page : this.cPage,
          pageSize: 20,
          startDate: this.startTime
        }).then(data => {
          if (data.data.status == 0) {
            this.withdrawalDetailsList = data.data.data.list;
            this.cPage = data.data.data.pageNum;
            this.total = data.data.data.total;
          }
        });
      } else if (this.status == "3") {
        getCapitalAccountRechargePage({
          bankCardNo: this.searchBankCardId == "" ? undefined : this.searchBankCardId,
          endDate: this.endTime,
          merchOrderNo: this.searchSerialNumber == "" ? undefined : this.searchSerialNumber,
          outUserId: this.$route.query.outUserId,
          pageNo: val.page ? val.page : this.cPage,
          pageSize: 20,
          startDate: this.startTime
        }).then(data => {
          if (data.data.status == 0) {
            this.rechargeDetailsList = data.data.data.list;
            this.cPage = data.data.data.pageNum;
            this.total = data.data.data.total;
          }
        });
      } else if (this.status == "4") {
        getCapitalAccountReceivablesPage({
          acctName: this.searchPayUserName == "" ? undefined : this.searchPayUserName,
          decorateOrderSn: this.searchOrderId == "" ? undefined : this.searchOrderId,
          endDate: this.endTime,
          outUserId: this.$route.query.outUserId,
          pageNo: val.page ? val.page : this.cPage,
          pageSize: 20,
          startDate: this.startTime,
          userAccount: this.searchPayAccount == "" ? undefined : this.searchPayAccount
        }).then(data => {
          if (data.data.status == 0) {
            this.receivablesDetailsList = data.data.data.list;
            this.cPage = data.data.data.pageNum;
            this.total = data.data.data.total;
          }
        });
      }
    }
  }
};
</script>

<style lang='less'>
#capitalAccountDetails {
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
    .baseHaedbox {
      border: 1px solid #ccc;
      margin-bottom: 15px;
      .basebox {
        display: flex;
        flex-wrap: wrap;
        margin: 20px 0;
        .baseboxItem {
          width: 30%;
          span {
            margin-left: 50px;
          }
        }
      }
      .basemoney {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        .basemoneyItem {
          padding: 0 30px;
          text-align: center;
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