<template>
  <div id="profitList">
    <!-- 分账记录 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">分账记录</span>
      </div>
      <div class="content">
        <div class="orderDetailsDiv">
          <div class="infoItem">
            <p class="itemTitle">基本信息</p>
            <div>
              <template v-for="item in orderDetailsList">
                <div class="infoinfoItem" v-if="item.value" :key="item.title">
                  <div class="leftInfo">{{item.title}}</div>
                  <div class="infoContent" v-html="item.value"></div>
                </div>
              </template>
            </div>
          </div>
          <div class="imgDiv">
            <p>户型图</p>
            <img v-for="(it,index) in imglist" :key="index" :src="it" />
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button @click="handleProfit">申请服务商分账</el-button>
            <el-button @click="handleProfitOwner">申请业主剩余款项提现</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>分账方式：</span>
            <el-select v-model="searchMethod" @change="showAll" placeholder="请选择分账方式" clearable>
              <el-option label="人工申请分账" :value="0"></el-option>
              <el-option label="系统申请分账" :value="1"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>审核状态：</span>
            <el-select v-model="searchStatus" @change="showAll" placeholder="请选择审核状态" clearable>
              <el-option label="审核中" :value="0"></el-option>
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="审核不通过" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <div class="moneyDiv">
          <p style="margin:0">
            <span
              v-html="`成本价 <span style='color:red'>¥${(this.money.orderCost / 100).toFixed(
            2
          )}</span>，已分账<span style='color:red'> ¥${(this.money.applied / 100).toFixed(
            2
          )}</span>，申请中 <span style='color:red'>¥${(this.money.applying / 100).toFixed(
            2
          )}</span>，待分账 <span style='color:red'>¥${(this.money.waitingNum / 100).toFixed(
            2
          )}</span>，用户账户剩余 <span style='color:red;margin-right:40px'>¥${(this.userRemain / 100).toFixed(
            2
          )}</span>`"
            ></span>
            <span
              v-if="!money.addPrice==0"
              v-html="`增项金额 <span style='color:red'>¥${(this.money.addPrice / 100).toFixed(
                  2
                )}</span> ，已分账 <span style='color:red'>¥${(this.money.addApplied / 100).toFixed(
                  2
                )}</span> ，申请中 <span style='color:red'>¥${(this.money.addApplying / 100).toFixed(
                  2
                )}</span> ，待分账 <span style='color:red'>¥${(this.money.addRemaining / 100).toFixed(2)}</span>`"
            ></span>
          </p>
        </div>
        <el-table :data="profitDataList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="name" label="服务商/业主" align="center">
            <template slot-scope="scope">
              <span>{{`${scope.row.roleName}：${scope.row.name}，${scope.row.mobile}`}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountPaid" label="分账数" align="center">
            <template slot-scope="scope">
              <span style="color:red">{{"¥"+(scope.row.accountPaid/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="paidType" label="款项类型" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.paidType==0">装修款</span>
              <span v-if="scope.row.paidType==1">装修增项</span>
              <span v-if="scope.row.paidType==2">剩余款项提现</span>
            </template>
          </el-table-column>
          <el-table-column prop="accountType" label="分账方式" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accountType==0">人工申请分账</span>
              <span v-if="scope.row.accountType==1">系统申请分账</span>
            </template>
          </el-table-column>
          <el-table-column prop="status" label="审核状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0" style="color:red">审核中</span>
              <span v-if="scope.row.status==1" style="color:red">审核通过</span>
              <span v-if="scope.row.status==2" style="color:red">审核不通过</span>
            </template>
          </el-table-column>
          <el-table-column prop="isAccount" label="到账状态" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isAccount==1" style="color:red">已到账</span>
              <span v-else style="color:red">未到账</span>
            </template>
          </el-table-column>
          <el-table-column prop="submitOperator" label="提交人" align="center"></el-table-column>
          <el-table-column prop="accountOperator" label="审核人" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="最后一次操作时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel" v-if="scope.row.remark||scope.row.opinion">
                <el-button type="text" v-if="scope.row.remark" @click="handleViewNote(scope.row)">查看备注</el-button>
                <el-button type="text" v-if="scope.row.opinion" @click="handleCheckMark(scope.row)">审核意见</el-button>
              </el-button-group>
              <span v-else>—</span>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
      <el-dialog :visible.sync="checkVisible" :show-close="false" center width="400px">
        <p>{{`业主 ：${orderDetails.ownerName}，${orderDetails.ownerPhone}`}}</p>
        <p>
          剩余款项金额：
          <span style="color:red" v-if="userRemain">¥{{(userRemain/100).toFixed(2)}}</span>
        </p>
        <el-input type="textarea" v-model="remark" placeholder="请输入申请业主提现备注"></el-input>
        <div slot="footer" class="dialog-footer">
          <el-button @click="handleClose()">取消</el-button>
          <el-button type="primary" @click="handleApply()">确认申请</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import {
  getDecorateAdditionsBaseInfo,
  getDecorateOrderAccountingRecordsPage,
  applyOwnerAccountDecorateOrderAccountingRecords
} from "../../../api/trim";
import { getOwnerByOutUserId } from "../../../api/pay";
export default {
  components: { Paginationcom },
  data() {
    return {
      searchMethod: "" /* 分账方式 0 人工 1 系统 */,
      searchStatus: "" /* 审核状态 -1 预设 (无) 0，审核中，1，审核通过，2，审核不通过 */,
      profitDataList: [],
      orderDetails: {},
      orderDetailsList: [
        { title: "业主", value: "" },
        { title: "管家", value: "" },
        { title: "小区", value: "" },
        { title: "位置", value: "" },
        { title: "定金", value: "" },
        { title: "价格", value: "" },
        { title: "状态", value: "" }
      ],
      imglist: [],
      money: {},
      checkVisible: false /* 提现申请 */,
      userRemain: null /* 用户剩余款项 */,
      remark: "",
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
    getDecorateAdditionsBaseInfo(this.$route.query.orderId).then(data => {
      if (data.data.status == 0) {
        this.orderDetails = data.data.data;
        this.orderDetailsList[0].value = `${this.orderDetails.ownerPhone}，${this.orderDetails.ownerName}`;
        this.orderDetailsList[1].value = `${this.orderDetails.accountNum}，${this.orderDetails.keeperName}`;
        this.orderDetailsList[2].value = `${this.orderDetails.communityName}，${this.orderDetails.houseNumber}，${
          this.orderDetails.roomNum
            ? this.orderDetails.roomNumDesc
            : "" + this.orderDetails.hallNum
            ? this.orderDetails.hallNumDesc
            : "" + this.orderDetails.toiletNum
            ? this.orderDetails.toiletNumDesc
            : ""
        }，${this.orderDetails.acreage + "㎡"}，${this.orderDetails.styleDesc}`;
        this.orderDetailsList[3].value = `${this.orderDetails.position}`;
        this.orderDetailsList[4].value = `<span style='color:red'>¥${(this.orderDetails.earnestMoney / 100).toFixed(
          2
        )}</span>`;
        this.orderDetailsList[5].value = this.orderDetails.decoratePrice
          ? `<span style='color:red'>¥${(this.orderDetails.decoratePrice / 1000000).toFixed(2)}万</span>`
          : null;
        switch (this.orderDetails.orderStatus) {
          case 1:
            this.orderDetailsList[6].value = `<span style="color:red">订单创建</span>`;
            break;
          case 2:
            this.orderDetailsList[6].value = `<span style="color:red">已下定</span>`;
            break;
          case 3:
            this.orderDetailsList[6].value = `<span style="color:red">已确定方案</span>`;
            break;
          case 4:
            this.orderDetailsList[6].value = `<span style="color:red">已配置流程</span>`;
            break;
          case 5:
            this.orderDetailsList[6].value = `<span style="color:red">已确定报价</span>`;
            break;
          case 6:
            this.orderDetailsList[6].value = `<span style="color:red">发起流程</span>`;
            break;
          case 7:
            this.orderDetailsList[6].value = `<span style="color:red">装修中</span>`;
            break;
          case 8:
            this.orderDetailsList[6].value = `<span style="color:red">装修完毕</span>`;
            break;
          case 9:
            this.orderDetailsList[6].value = `<span style="color:red">已确定签约</span>`;
            break;
          default:
            break;
        }
        if (this.orderDetails.endStatus == 1) {
          this.orderDetailsList[6].value = `<span style="color:red">装修终止</span>`;
        }
        getOwnerByOutUserId(this.orderDetails.outUserId).then(res => {
          if (res.status == 200) {
            this.userRemain = res.data;
          } else {
            this.$message.warning("查询用户剩余款项失败");
          }
        });
        this.imglist = this.orderDetails.houseImg.split(",");
      }
    });
  },
  methods: {
    /** 申请服务商分账 */
    handleProfit() {
      if (this.money.waitingNum == 0) {
        this.$message.warning("该装修订单已分账完毕！");
      } else {
        this.$router.push({ name: "applyProfit", query: { orderId: this.$route.query.orderId } });
      }
    },
    /** 审核意见 */
    handleCheckMark(row) {
      this.$alert(row.opinion, "审核意见", {
        confirmButtonText: "确定",
        showClose: false,
        center: true,
        customClass: "remark"
      });
    },
    /** 查看备注 */
    handleViewNote(row) {
      this.$alert(row.remark, "申请分账备注", {
        confirmButtonText: "确定",
        showClose: false,
        center: true,
        customClass: "remark"
      });
    },
    /** 申请业主剩余款项提现 */
    handleProfitOwner() {
      if (this.orderDetails.orderStatus == 8 || this.orderDetails.orderStatus == 10) {
        this.checkVisible = true;
      } else {
        this.$message.warning("申请用户剩余款项提现需要等到装修完成！");
      }
    },
    /** 取消申请业主提现 */
    handleClose() {
      this.checkVisible = false;
      this.remark = "";
    },
    /** 确认申请业主提现 */
    handleApply() {
      new Promise((resolve, reject) => {
        if (this.remark == "") {
          reject("请输入申请业主提现备注！");
        }
        if (this.remark.length > 200) {
          reject("申请业主提现备注不能超过200个字！");
        }
        resolve();
      })
        .then(() => {
          applyOwnerAccountDecorateOrderAccountingRecords({
            decorateOrderId: this.$route.query.orderId,
            serviceAccount: this.orderDetails.serviceAccount,
            accountPaid: this.userRemain,
            remark: this.remark,
            outUserId: this.orderDetails.outUserId // 项目经理和服务商的资金账号
          }).then(data => {
            if (data.data.status == 0) {
              this.checkVisible = false;
              this.remark = "";
              this.$message.success("申请用户提现成功");
              this.showAll();
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(rej => {
          this.$message.error(rej);
        });
    },
    showAll(val = {}) {
      getDecorateOrderAccountingRecordsPage({
        decorateOrderId: this.$route.query.orderId,
        id: this.$route.query.id,
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20,
        accountType: this.searchMethod == "" ? undefined : this.searchMethod,
        status: this.searchStatus === "" ? undefined : this.searchStatus
      }).then(data => {
        if (data.data.status == 0) {
          this.money = data.data.data.resultStatic;
          this.profitDataList = data.data.data.pageInfo.list;
          this.total = data.data.data.pageInfo.total;
          this.cPage = data.data.data.pageInfo.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
.remark {
  height: 200px;
  width: 400px;
  .el-message-box__content {
    height: 100px;
    text-align: left;
  }
}
#profitList {
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
      .orderDetailsDiv {
        display: flex;
        margin-bottom: 10px;
        .infoItem {
          margin-right: 30px;
          p.itemTitle {
            font-size: 16px;
            padding-left: 6px;
            position: relative;
          }
          p.itemTitle::before {
            display: block;
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 3px;
            background-color: red;
            content: "";
          }
          .infoinfoItem {
            // height: 35px;
            font-size: 16px;
            line-height: 35px;
            .leftInfo {
              height: 100%;
              width: 100px;
              float: left;
              text-align: right;
            }
            .infoContent {
              height: 35px;
              width: calc(~"100% - 120px");
              margin-left: 120px;
            }
          }
        }
        .imgDiv {
          img {
            margin-right: 10px;
            width: 150px;
            height: 150px;
          }
        }
      }
      .moneyDiv {
        margin-bottom: 15px;
      }
    }
  }
}
</style>