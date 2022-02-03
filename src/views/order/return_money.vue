<template>
  <div id="return_goods">
    <!-- 退款列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">退款申请</span>
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
            <span>服务编号：</span>
            <el-input placeholder="服务编号" v-model="searchSn" @keyup.native.enter="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <span>申请时间：</span>
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
        <div class="status">
          <el-tabs v-model="status" type="card" @tab-click="changeStatus">
            <el-tab-pane :label="'全部申请('+afterSaleRefundByMoneyStatusCount.allNum+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'待处理('+afterSaleRefundByMoneyStatusCount.pendingNum+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'已处理('+afterSaleRefundByMoneyStatusCount.processedNum+')'" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
        </div>
        <!-- 表格标题 -->
        <el-table :data="afterSaleList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="sn" label="服务单号">
            <!-- <template slot-scope="scope">{{scope.row.orderItem.id}}</template> -->
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间"></el-table-column>
          <el-table-column prop="userAccount" label="用户账号"></el-table-column>
          <el-table-column prop="refundAmount" label="退款金额" width="120">
            <template slot-scope="scope">{{ '¥' + (scope.row.refundAmount / 100).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column align="center" label="申请状态" width="115" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '1'">待处理</span>
              <span v-if="scope.row.status == '2'">已处理</span>
            </template>
          </el-table-column>
          <el-table-column prop="handlingTime" label="处理时间"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="viewDetails (scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option v-for="item in batchOptions" :key="item.value" :label="item.label" :value="item.value" :disabled="disabled"></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getRefundPage, afterSaleRefundByMoneyStatusCount, deleteOrder } from "../../api/order";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      disabled: true,
      batchValue: "",
      select: "不限",
      closeVisible4: false,
      searchSn: "" /* 订单id 搜索 */,
      searchName: "" /* 收货人/电话 搜索 */,
      startTime: "" /* 订单日期 搜索 */,
      endTime: "",
      searchTime: [],
      status: "all" /* 当前状态 */,
      afterSaleRefundByMoneyStatusCount: {
        /* 各个状态的数量 */
        pendingNum: "",
        processedNum: "",
        allNum: ""
      },
      noteform: {
        text: "" /* 操作备注 */
      },
      afterSaleList: [],
      batchArr: [],
      batchOptions: [{ label: "批量删除", value: "delete" }],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    status: {
      /* 改变大的筛选条件 */
      handler() {
        this.selectByKwd();
      }
    },
    searchTime: {
      handler() {
        if (this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = null;
          this.endTime = null;
        }
        this.selectByKwd();
      }
    }
  },
  mounted() {
    afterSaleRefundByMoneyStatusCount().then(data => {
      this.afterSaleRefundByMoneyStatusCount = data.data.data;
    });
    if (this.$route.query.status != undefined) {
      this.status = this.$route.query.status == undefined ? "all" : this.$route.query.status;
    } else {
      this.showAll();
    }
  },
  methods: {
    batchOperation() {
      if (this.batchValue == "delete") {
        /* 批量删除 */
        this.$confirm("此操作将删除这些订单, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            /* 调接口 */
            deleteOrder(this.batchArr).then(data => {
              if (data.status == 200) {
                this.$message({
                  message: "批量删除订单成功",
                  type: "success"
                });
                this.showAll();
              } else {
                this.$message.error("批量删除订单失败");
              }
            });
          })
          .catch(() => {
            this.$message("已取消删除");
          });
      }
    },
    viewDetails(rows) {
      this.$router.push({ name: "return_Money_Details", query: { id: rows.id } });
    },
    closeOrder(obj) {
      if (obj.type == "open") {
        this.noteform = { text: "", info: obj.obj };
        this.closeVisible = true;
      }
    },
    getSelection(val) {
      this.batchArr = [];
      val.forEach(item => {
        if (item.status == "0") {
          this.batchArr.push(item.id);
          this.disabled = false;
        } else {
          this.disabled = true;
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.status !== undefined) {
        // 执行查询中的分页
        this.selectByKwd(val);
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getRefundPage({
        pageSize: 20,
        pageNo: Number.isInteger(val) ? val : 1,
        sn: this.searchSn == "" ? null : this.searchSn,
        statuss: this.status === "all" ? null : new Array(this.status),
        startTime: this.startTime,
        endTime: this.endTime
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          this.$message({
            message: "已执行查询",
            type: "success"
          });
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getRefundPage({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 更改筛选条件 */
    changeStatus() {},
    /* 渲染表格 */
    setView(data) {
      this.afterSaleList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchSn = null;
      this.searchName = null;
      this.searchTime = [];
      this.endTime = null;
      this.startTime = null;
      this.status = "all";
      // this.showAll();
    }
  }
};
</script>

<style lang="less">
#return_goods {
  width: 100%;
  height: auto;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-image__inner {
    //有缩略图的加这个样式
    width: auto !important;
  }
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
    .el-table__header .el-table-column--selection .cell .el-checkbox:after {
      content: "全选";
      margin-left: 5px;
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      /* 筛选按钮 */
      .status {
        .el-tabs {
          .el-tabs__header {
            margin: 0;
            border-bottom: none;
            .el-tabs__nav-wrap {
              margin-bottom: 0;
              .el-tabs__nav {
                border-radius: 0px;
              }
              .el-tabs__item.is-active {
                color: white;
                background-color: #1abc9c;
              }
              .el-tabs__item:hover {
                color: #1abc9c;
              }
              .el-tabs__item.is-active:hover {
                color: white;
              }
            }
          }
        }
      }
      .search {
        /* 几个查询一起 */
        display: flex;
        justify-content: flex-start;
        margin-bottom: 15px;
        div.search_box {
          margin-right: 6px;
          span {
            line-height: 40px;
          }
        }
      }
      .el-button-group.alterDel,
      .el-button-group.setup {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }
      .batchOperation {
        margin-top: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .el-pagination {
          padding: 0;
          // margin-top: 20px;
        }
        .el-select {
          width: 120px;
          margin-right: 15px;
        }
      }
    }
  }
}
</style>
