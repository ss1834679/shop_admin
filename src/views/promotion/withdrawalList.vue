<template>
  <div id="withdrawal">
    <!-- 提现列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">提现列表</span>
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
            <span>用户账号：</span>
            <el-input placeholder="请输入用户账号" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <!-- <div class="search_box">
            <span>昵称：</span>
            <el-input placeholder="请输入昵称" v-model="searchSettlementStatus" @keydown.native.enter="selectByKwd"></el-input>
          </div>-->
          <div class="search_box">
            <span>审核状态：</span>
            <el-select v-model="searchSettlementStatus" @change="selectByKwd">
              <el-option label="全部" value="all"></el-option>
              <el-option label="待审核" :value="0"></el-option>
              <el-option label="已打款" :value="1"></el-option>
              <el-option label="已拒绝" :value="-1"></el-option>
              <el-option label="打款失败" :value="2"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>申请时间：</span>
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
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
        </div>
        <el-table :data="withdrawalList" border style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="nickname" label="用户昵称"></el-table-column>
          <el-table-column prop="phone" label="用户账号"></el-table-column>
          <el-table-column prop="alipayCode" label="支付宝账号"></el-table-column>
          <el-table-column prop="realName" label="真实姓名"></el-table-column>
          <el-table-column prop="saleNum" align="center" label="申请提现金额、手续费、到账金额">
            <template slot-scope="scope">
              <span style="display:block">{{"¥"+(scope.row.extractPrice/100).toFixed(2)}}</span>
              <span style="display:block">{{"¥"+(scope.row.process/100).toFixed(2)}}</span>
              <span style="display:block">{{"¥"+(scope.row.account/100).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间"></el-table-column>
          <el-table-column prop="status" align="center" label="状态">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.status==-1">已拒绝</span>
                <span v-if="scope.row.status==0">待审核</span>
                <span v-if="scope.row.status==1">已打款</span>
                <span v-if="scope.row.status==2">打款失败</span>
              </div>
              <el-button v-if="scope.row.status==2" type="text" @click="getReason(scope.row)">失败原因</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="170">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" v-if="scope.row.status==0" @click="checkWithDrawal(scope.row)">审核</el-button>
                <el-button type="text" v-else @click="viewCheckList(scope.row)">审核日志</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
    <el-dialog title="信息" :visible.sync="reasonVisible" @close="reason=''" width="400px">
      <div class="withDrawalDetails">
        <span>失败原因：{{reason}}</span>
      </div>
    </el-dialog>
    <el-dialog title="审核详情" :visible.sync="checkListVisible" @close="closeCheckList">
      <el-table :data="checkList" border style="width: 100%">
        <el-table-column prop="updateTime" align="center" label="审核时间"></el-table-column>
        <el-table-column prop="operator" align="center" label="审核人员"></el-table-column>
        <el-table-column prop="status" align="center" label="审核结果">
          <template slot-scope="scope">
            <span v-if="scope.row.status==1">审核通过</span>
            <span v-if="scope.row.status==-1">已拒绝</span>
          </template>
        </el-table-column>
        <el-table-column prop="mark" align="center" label="反馈详情"></el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="商品审核" :visible.sync="checkVisible" @close="closeCheck">
      <el-form ref="checkform" label-width="80px">
        <div class="withDrawalDetails">
          <span>提现人：{{checkitem.realName}}</span>
          <span>提现金额：{{"¥"+(checkitem.extractPrice/100).toFixed(2)}}</span>
          <span>手续费：{{"¥"+(checkitem.process/100).toFixed(2)}}</span>
          <span>到账金额：{{"¥"+(checkitem.account/100).toFixed(2)}}</span>
        </div>
        <el-form-item label="提现审核:">
          <el-radio-group v-model="checkForm.status">
            <el-radio :label="1">审核通过</el-radio>
            <!-- <el-radio :label="-1">审核不通过</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item label="反馈详情:">
          <el-input type="textarea" v-model="checkForm.mark"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCheck({type:'cancel'})">取 消</el-button>
        <el-button type="primary" @click="handleCheck({type:'confirm'})">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getExtractList, updateExtractAudit, getExtractAuditDetail, getExtractFailMsg } from "../../api/distribuManage";
import paginationCom from "../../components/paginationCom";
export default {
  components: { paginationCom },
  data() {
    return {
      searchInput: "" /* 团长昵称 */,
      searchSettlementStatus: "" /* 昵称 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      withdrawalList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      checkListVisible: false,
      checkVisible: false,
      checkList: [],
      checkitem: {},
      reason: "",
      reasonVisible: false,
      checkForm: {
        mark: "",
        status: 1
      }
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime) {
          this.endTime = this.searchTime[1];
          this.startTime = this.searchTime[0];
        } else {
          this.endTime = null;
          this.startTime = null;
        }
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 审核 */
    checkWithDrawal(rows) {
      this.checkitem = rows;
      this.checkVisible = true;
    },
    /* 审核日志 */
    viewCheckList(rows) {
      getExtractAuditDetail(rows.id).then(data => {
        if (data.data.status == 0) {
          this.checkList.push(data.data.data);
          this.checkListVisible = true;
        }
      });
    },
    getReason(row) {
      getExtractFailMsg(row.id).then(data => {
        if (data.data.status == 0) {
          this.reason = data.data.content;
          this.reasonVisible = true;
        }
      });
    },
    closeCheckList() {
      this.checkList = [];
    },
    closeCheck() {
      this.checkForm = {
        mark: "",
        status: -1
      };
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkitem = {};
        this.checkVisible = false;
      } else {
        new Promise((resolve, reject) => {
          if (this.checkitem.id == "" || this.checkitem.id == null) {
            reject("提交失败");
          }
          if (this.checkForm.status == null || this.checkForm.status == "") {
            reject("请选择是否审核");
          } else if (this.checkForm.status == 1 && this.checkForm.mark == "") {
            this.checkForm.mark = "通过审核";
            resolve();
          } else if (this.checkForm.status == -1 && this.checkForm.mark == "") {
            reject("请填写拒绝原因");
          }
          resolve();
        })
          .then(() => {
            updateExtractAudit({
              id: this.checkitem.id,
              mark: this.checkForm.mark,
              status: this.checkForm.status
            }).then(data => {
              if (data.data.status == 0) {
                this.checkVisible = false;
                this.$message({ type: "success", message: "审核成功" });
              }
            });
          })
          .catch(res => {
            this.$message.warning(res);
          });
      }
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchInput = "";
      this.searchSettlementStatus = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.selectByKwd();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchSettlementStatus != "" || this.startTime != null) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}, type) {
      getExtractList({
        pageIndex: val.page ? val.page : 1,
        pageSize: 20,
        endTime: this.endTime,
        startTime: this.startTime,
        status: this.searchSettlementStatus == "all" ? null : this.searchSettlementStatus,
        phone: this.searchInput == "" ? null : this.searchInput
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.withdrawalList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(val) {
      getExtractList({ pageIndex: val ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#withdrawal {
  width: 100%;
  height: auto;
  .withDrawalDetails {
    width: calc(~"100%-50px");
    padding: 0 25px;
    height: 50px;
    line-height: 1;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-evenly;
  }
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