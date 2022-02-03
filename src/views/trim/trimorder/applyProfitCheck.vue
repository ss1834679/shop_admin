<template>
  <div id="applyProfitCheck">
    <!-- 分账审核 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">分账审核</span>
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
            <span>审核状态：</span>
            <el-select v-model="searchStatus" @change="showAll" placeholder="请选择审核状态" clearable>
              <el-option label="审核中" :value="0"></el-option>
              <el-option label="审核通过" :value="1"></el-option>
              <el-option label="审核不通过" :value="2"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="applyProfitList" border style="width: 100%">
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
          <el-table-column prop="submitOperator" label="操作人" align="center"></el-table-column>
          <el-table-column prop="accountOperator" label="审核人" align="center"></el-table-column>
          <el-table-column prop="updateTime" label="最后一次操作时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="300">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" v-if="scope.row.status==0" @click="checkTrimOrder(scope.row)">审核</el-button>
                <el-button type="text" v-if="scope.row.status==2" @click="viewCheckOpinion(scope.row)">审核意见</el-button>
                <el-button type="text" @click="viewTrimOrder(scope.row)">查看装修订单</el-button>
                <el-button type="text" v-if="scope.row.remark" @click="viewRemark(scope.row)">查看备注</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <PaginationCom :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
        <el-dialog :visible.sync="checkVisible" :show-close="false" center width="400px">
          <p>{{`${checkRow.roleName}：${checkRow.name}，${checkRow.mobile}`}}</p>
          <p>
            分账：
            <span style="color:red">￥{{(checkRow.accountPaid/100).toFixed(2)}}</span>
          </p>
          <el-input type="textarea" v-model="checkForm.opinion" placeholder="如果审核不通过，请输入审核意见"></el-input>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCheck({type:'cancel'})">审核不通过</el-button>
            <el-button type="primary" @click="handleCheck({type:'confirm'})">审核通过</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import PaginationCom from "../../../components/paginationCom";
import { getDecorateOrderAccountingRecordsPage, checkAccountDecorateOrderAccountingRecords } from "../../../api/trim";
export default {
  components: { PaginationCom },
  data() {
    return {
      searchStatus: "" /* 审核状态 */,
      applyProfitList: [],
      checkRow: {},
      checkForm: {
        status: null /* 审核是否通过 1为通过 -1为未通过 */,
        opinion: "" /* 未通过的备注 */
      } /* 审核表单 */,
      checkVisible: false,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /** 查看订单 */
    viewTrimOrder(row) {
      let routeUrl = this.$router.resolve({
        name: "trimOrderDetail",
        params: { routerTitle: "查看装修订单" },
        query: { id: row.decorateOrderId, type: "newtag" }
      });
      window.open(routeUrl.href, "_blank");
    },
    viewRemark(row) {
      this.$alert(row.remark, "申请分账备注", {
        confirmButtonText: "确定",
        showClose: false,
        center: true,
        customClass: "remark"
      });
    },
    viewCheckOpinion(row) {
      this.$alert(row.opinion, "审核意见", {
        confirmButtonText: "确定",
        showClose: false,
        center: true,
        customClass: "remark"
      });
    },
    checkTrimOrder(row) {
      this.checkRow = JSON.parse(JSON.stringify(row));
      this.checkVisible = true;
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        if (this.checkForm.opinion == "") {
          this.$message.error("请填写未通过理由！");
        } else {
          this.checkForm.status = 2;
          this.verify();
        }
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.opinion == "") {
          this.checkForm.opinion = "审核通过";
        } else {
          this.checkForm.status = 1;
          this.verify();
        }
      }
    },
    verify() {
      this.checkForm["decorateOrderId"] = this.checkRow.decorateOrderId;
      this.checkForm["id"] = this.checkRow.id;
	  this.checkForm["type"] = this.checkRow.type;
      checkAccountDecorateOrderAccountingRecords(this.checkForm).then(data => {
        if (data.data.status == 0) {
          this.$message.success("审核成功");
          if (this.checkForm.status == 1) {
            window.open(data.data.data, "_blank");
          }
          this.showAll();
        } else {
          this.$message.error("审核失败");
        }
        this.checkVisible = false;
        this.checkForm = {
          status: null,
          opinion: ""
        };
      });
    },
    showAll(val = {}) {
      getDecorateOrderAccountingRecordsPage({
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20,
        status: this.searchStatus === "" ? undefined : this.searchStatus
      }).then(data => {
        if (data.data.status == 0) {
          this.applyProfitList = data.data.data.pageInfo.list;
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
#applyProfitCheck {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
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
    }
  }
}
</style>