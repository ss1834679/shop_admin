<template>
  <div id="capitalAccountVerifyRecorddetails">
    <!-- 财务明细 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">财务明细</span>
      </div>
      <div class="content">
        <div class="data-top">
          <div
            class="title"
          >{{new Date(reconciliation.billDate).getFullYear()}}年{{new Date(reconciliation.billDate).getMonth()+1}}月{{new Date(reconciliation.billDate).getDate()}}日财务明细</div>
          <div class="time">
            <div>账单ID:{{reconciliation.billId}}</div>
            <div>账单周期:{{reconciliation.billDate}} 00:00:00 至 {{reconciliation.billDate}} 23:59:59</div>
          </div>
          <div class="data-top-list">
            <div v-for="(item,index) in dataItemList" :key="index">
              <div>{{item.money}}</div>
              <div>{{item.name}}</div>
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
            <span>订单编号：</span>
            <el-input placeholder="订单编号" v-model="searchOrderId" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>类型：</span>
            <el-select v-model="searchType" @change="showAll" placeholder="请选择类型" clearable>
              <el-option label="全部" :value="''"></el-option>
              <el-option label="充值" value="充值"></el-option>
              <el-option label="转入" value="转入"></el-option>
              <el-option label="转出" value="转出"></el-option>
              <el-option label="提现" value="提现"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>收支类型：</span>
            <el-select v-model="searchPaymentType" @change="showAll" placeholder="请选择收支类型" clearable>
              <el-option label="全部" :value="''"></el-option>
              <el-option label="收入" value="收入"></el-option>
              <el-option label="支出" value="支出"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>账户姓名：</span>
            <el-input placeholder="账户姓名" v-model="searchAccountName" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>流水号：</span>
            <el-input placeholder="流水号" v-model="searchSerialNumber" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>对账状态：</span>
            <el-select v-model="searchRecordType" @change="showAll" placeholder="请选择对账状态" clearable>
              <el-option label="全部" :value="''"></el-option>
              <el-option label="未对账" :value="0"></el-option>
              <el-option label="已对账" :value="1"></el-option>
              <el-option label="异常" :value="-1"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>开票状态：</span>
            <el-select v-model="searchInvoiceType" @change="showAll" placeholder="请选择开票状态" clearable>
              <el-option label="全部" :value="''"></el-option>
              <el-option label="未开票" :value="0"></el-option>
              <el-option label="已开票" :value="1"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>交易成功时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
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
        <el-table :data="capitalAccountDetailsList" border style="width: 100%">
          <el-table-column prop="reconciliationType" label="类型" align="center"></el-table-column>
          <el-table-column prop="ieType" label="收支类型" align="center"></el-table-column>
          <el-table-column prop="orderSn" label="订单编号" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.orderSn">{{scope.row.orderSn}}</span>
              <span v-else>N/A</span>
            </template>
          </el-table-column>
          <el-table-column prop="amount" label="交易金额" align="center">
            <template slot-scope="scope">¥{{(scope.row.amount/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="chargeAmount" label="手续费金额" align="center">
            <template slot="header">
              <span>手续费金额</span>
              <el-tooltip effect="dark" content="充值手续费0%；转账手续费率0.15%；提现单笔手续费，个人1元/每笔，企业3元/每笔。" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">¥{{(scope.row.chargeAmount/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="actualAmount" label="实际到账金额" align="center">
            <template slot-scope="scope">¥{{(scope.row.actualAmount/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="finishTime" label="交易成功时间" align="center"></el-table-column>
          <el-table-column prop="bankCard" align="center">
            <template slot="header">
              <span>银行账户</span>
              <el-tooltip effect="dark" content="充值银行账户是指从该银行账户充值到本资金账户，提现银行账户是指从本资金账户提现至该银行账户（转入和转出无银行账户）" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.bankCard">{{scope.row.bankCard}}</span>
              <span v-else>N/A</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountNo" align="center">
            <template slot="header">
              <span>资金账户</span>
              <el-tooltip effect="dark" content="充值资金账户是指本资金账户，转入资金账户是指付款方资金账户，转出资金账户是指收款方资金账户，提现资金账户是指本资金账户" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="accountName" align="center">
            <template slot="header">
              <span>账户名称</span>
              <el-tooltip effect="dark" content="转入账户名称是指付款方资金账户名称，转出账户名称是指收款方资金账户名称，提现账户名称是指提现到的银行账户户名" placement="top">
                <i class="el-icon-question"></i>
              </el-tooltip>
            </template>
            <template slot-scope="scope">
              <span v-if="scope.row.accountName">{{scope.row.accountName}}</span>
              <span v-else>N/A</span>
            </template>
          </el-table-column>
          <el-table-column prop="merchOrderNo" label="流水号" align="center"></el-table-column>
          <el-table-column prop="reconciliationTime" label="对账时间" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.reconciliationTime">{{scope.row.reconciliationTime}}</span>
              <span v-else>N/A</span>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="交易备注" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.remark">{{scope.row.remark}}</span>
              <span v-else>N/A</span>
            </template>
          </el-table-column>
          <el-table-column prop="reconciliationStatus" label="对账状态" align="center">
            <template slot-scope="scope">
              <p v-if="scope.row.reconciliationStatus==0">未对账</p>
              <p v-if="scope.row.reconciliationStatus==-1">异常</p>
              <p v-if="scope.row.reconciliationStatus==1">已对账</p>
              <el-button type="text" @click="handleAlterRecord(scope.row)">修改</el-button>
            </template>
          </el-table-column>
          <el-table-column prop="invoicingStatus" v-if="showStatus" label="开票状态" align="center">
            <template slot-scope="scope">
              <Switchcom
                v-if="scope.row.reconciliationType=='充值'||scope.row.reconciliationType=='转入'"
                :boolen="scope.row.invoicingStatus==1"
                activeText="已开票"
                inactiveText="未开票"
                @changeBoolen="handleChangeStatus($event,scope.row)"
              />
              <span v-else>N/A</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="160">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleRemark(scope.row)">备注</el-button>
                <el-button type="text" v-if="scope.row.orderSn" @click="handleViewOrder(scope.row)">订单</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
      <!-- 对账状态修改 -->
      <el-dialog :visible.sync="alterRecordVisible" title="对账" width="500px" @close="handleCloseAlterRecord">
        <el-form :model="alterRecordForm" ref="alterRecordForm" :rules="alterRules">
          <el-form-item prop="reconciliationStatus" label="对账状态">
            <el-radio-group v-model="alterRecordForm.reconciliationStatus">
              <el-radio label="0">未对账</el-radio>
              <el-radio label="-1">异常</el-radio>
              <el-radio label="1">已对账</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="reconciliationRemark">
            <el-input v-model.trim="alterRecordForm.reconciliationRemark" type="textarea" rows="4" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseAlterRecord">取 消</el-button>
          <el-button type="primary" @click="handleSubmitAlterRecord('alterRecordForm')">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 备注 -->
      <el-dialog :visible.sync="markVisible" title="备注" width="500px" @close="handleCloseMark">
        <el-form :model="remarkForm" ref="remarkForm" :rules="alterRules">
          <el-form-item prop="remark">
            <el-input v-model.trim="remarkForm.remark" type="textarea" rows="4" placeholder="备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleCloseMark">取 消</el-button>
          <el-button type="primary" @click="handleSubmitAlterRemark('remarkForm')">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import Switchcom from "../../../components/switch";
import {
  getPayAccountReconciliationTransferOne,
  getPayAccountReconciliationTransferInfoPage,
  udpatePayAccountReconciliationReconciliation,
  updatePayAccountReconciliationInvoicing,
  updatePayAccountReconciliationRemark,
  getOrderStatusValuePayAccountReconciliation
} from "../../../api/finance";
export default {
  components: { Paginationcom, Switchcom },
  data() {
    return {
      searchOrderId: "" /* 订单编号 */,
      searchType: "" /* 类型 */,
      searchPaymentType: "" /* 收支类型 */,
      searchAccountName: "" /* 账户姓名 */,
      searchSerialNumber: "" /* 流水号 */,
      searchRecordType: "" /* 对账状态 */,
      searchInvoiceType: "" /* 开票状态 */,
      searchTime: [],
      startTime: undefined /* 开始时间 */,
      endTime: undefined /* 结束时间 */,
      capitalAccountDetailsList: [] /* 财务明细列表 */,
      roleList: [] /* 角色列表 */,
      reconciliation: {
        billDate: "",
        billId: ""
      } /* 财务明细字段 */,
      dataItemList: [
        { name: "本期期初", money: "" },
        { name: "充值", money: "" } /* 充值30笔 */,
        { name: "提现", money: "" } /* 提现20笔 */,
        { name: "转入", money: "" } /* 转入20笔 */,
        { name: "转出", money: "" } /* 转出20笔 */,
        { name: "本期期末", money: "" },
        { name: "已对账", money: "" },
        { name: "未对账", money: "" },
        { name: "异常", money: "" }
      ],
      alterRecordForm: {
        reconciliationRemark: "",
        reconciliationStatus: "",
        id: ""
      } /* 修改分账的row */,
      alterRecordVisible: false,
      alterRules: {
        reconciliationStatus: [{ required: true, message: "请选择对账状态", trigger: "submit" }],
        reconciliationRemark: [{ required: true, message: "请填写修改备注", trigger: "submit" }],
        remark: [{ required: true, message: "请填写备注", trigger: "submit" }]
      },
      remarkForm: { id: "", remark: "" },
      markVisible: false,
      showStatus: true,
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
    getPayAccountReconciliationTransferOne(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        this.reconciliation = data.data.data;
        this.dataItemList[0].money = `¥${(this.reconciliation.beginningOfPeriod / 100).toFixed(2)}`;
        this.dataItemList[1].name = `充值${this.reconciliation.rechargeNumber}笔`;
        this.dataItemList[1].money = `¥${(this.reconciliation.rechargeAmount / 100).toFixed(2)}`;
        this.dataItemList[2].name = `提现${this.reconciliation.withdrawNumber}笔`;
        this.dataItemList[2].money = `¥${(this.reconciliation.withdrawAmount / 100).toFixed(2)}`;
        this.dataItemList[3].name = `转入${this.reconciliation.transfersNumber}笔`;
        this.dataItemList[3].money = `¥${(this.reconciliation.transferAmount / 100).toFixed(2)}`;
        this.dataItemList[4].name = `转出${this.reconciliation.transferOutNumber}笔`;
        this.dataItemList[4].money = `¥${(this.reconciliation.transferOutAmount / 100).toFixed(2)}`;
        this.dataItemList[5].money = `¥${(this.reconciliation.endOfTerm / 100).toFixed(2)}`;
      }
    });
    getOrderStatusValuePayAccountReconciliation({
      billDate: this.$route.query.billDate,
      outUserId: this.$route.query.outUserId
    }).then(data => {
      if (data.data.status == 0) {
        this.dataItemList[6].money = `${data.data.data.reconciliation}笔`; /* 已对账 */
        this.dataItemList[7].money = `${data.data.data.unreconciled}笔`; /* 未对账 */
        this.dataItemList[8].money = `${data.data.data.abnormal}笔`; /* 异常 */
      }
    });
    this.showAll();
  },
  methods: {
    /** 备注 */
    handleRemark(row) {
      this.remarkForm.id = row.id;
      this.remarkForm.remark = row.remark;
      this.markVisible = true;
    },
    /** 订单 */
    handleViewOrder(row) {
      this.$router.push({
        name: "trimOrderDetail",
        params: { routerTitle: "查看装修订单" },
        query: { id: row.orderSn }
      });
    },
    /* 刷新 */
    refreshTable() {
      this.showStatus = false;
      this.$nextTick(() => {
        this.showStatus = true;
      });
    },
    /** 对账状态修改 */
    handleAlterRecord(row) {
      this.alterRecordForm.id = row.id;
      this.alterRecordForm.reconciliationStatus = row.reconciliationStatus;
      this.alterRecordVisible = true;
    },
    handleCloseAlterRecord() {
      this.alterRecordVisible = false;
      this.alterRecordForm = {
        reconciliationRemark: "",
        reconciliationStatus: "",
        id: ""
      };
      setTimeout(() => {
        this.$refs.alterRecordForm.clearValidate();
      }, 10);
    },
    handleSubmitAlterRecord(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          udpatePayAccountReconciliationReconciliation(this.alterRecordForm).then(data => {
            if (data.data.data) {
              this.$message.success("修改对账状态成功");
              this.handleCloseAlterRecord();
            } else {
              this.$message.error("修改对账状态失败");
            }
          });
        } else {
          this.$message.warning("请检查是否填完参数");
        }
      });
    },
    handleCloseMark() {
      this.markVisible = false;
      this.remarkForm = { id: "", remark: "" };
      setTimeout(() => {
        this.$refs.remarkForm.clearValidate();
      }, 10);
    },
    handleSubmitAlterRemark(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updatePayAccountReconciliationRemark(this.remarkForm).then(data => {
            if (data.data.data) {
              this.$message.success("修改备注成功");
              this.handleCloseMark();
            } else {
              this.$message.error("修改备注失败");
            }
          });
        } else {
          this.$message.warning("请检查是否填完参数");
        }
      });
    },
    /** 开票状态修改 */
    handleChangeStatus(event, row) {
      updatePayAccountReconciliationInvoicing({ id: row.id, invoicingStatus: event ? 1 : 0 }).then(data => {
        if (data.data.data) {
          this.$message.success("修改开票状态成功");
        } else {
          this.$message.error("修改开票状态失败");
          this.showAll();
        }
      });
    },
    /** 重置搜索 */
    clearSearch() {
      this.searchOrderId = "";
      this.searchType = "";
      this.searchPaymentType = "";
      this.searchAccountName = "";
      this.searchSerialNumber = "";
      this.searchRecordType = "";
      this.searchInvoiceType = "";
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    showAll(val = {}) {
      getPayAccountReconciliationTransferInfoPage({
        accountName: this.searchAccountName == "" ? undefined : this.searchAccountName,
        billDate: this.$route.query.billDate,
        endDate: this.endTime,
        ieType: this.searchPaymentType == "" ? undefined : this.searchPaymentType,
        invoicingStatus: this.searchInvoiceType == "" ? undefined : this.searchInvoiceType,
        merchOrderNo: this.searchSerialNumber == "" ? undefined : this.searchSerialNumber,
        orderSn: this.searchOrderId == "" ? undefined : this.searchOrderId,
        outUserId: this.$route.query.outUserId,
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20,
        reconciliationStatus: this.searchRecordType == "" ? undefined : this.searchRecordType,
        reconciliationType: this.searchType == "" ? undefined : this.searchType,
        startDate: this.startTime
      }).then(data => {
        if (data.data.status == 0) {
          this.capitalAccountDetailsList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
          this.refreshTable();
        }
      });
    }
  }
};
</script>

<style lang='less'>
#capitalAccountVerifyRecorddetails {
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
      .data-top {
        border: 1px solid #f2f2f2;
        padding: 20px;
        margin-bottom: 20px;
        .title {
          text-align: center;
          font-size: 18px;
          font-weight: bold;
        }
        .time {
          font-size: 14px;
          margin-top: 25px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        .data-top-list {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 25px;
          > div {
            margin-top: 5px;
            font-weight: bold;
            text-align: center;
          }
          div:last-child {
            font-weight: normal;
          }
        }
      }
    }
  }
}
</style>