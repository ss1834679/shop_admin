<template>
  <div id="return_goods">
    <!-- 退货列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">退货申请</span>
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
            <span>收货人：</span>
            <el-input placeholder="收货人姓名/手机号码" v-model="searchName" @keyup.native.enter="selectByKwd" class="input-with-select"></el-input>
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
          <el-tabs v-model="status" type="card">
            <el-tab-pane :label="'全部申请('+afterSaleByStatusCountList.allNum+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'待处理('+afterSaleByStatusCountList.pendingNum+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'退货中('+afterSaleByStatusCountList.returningNum+')'" name="2"></el-tab-pane>
            <el-tab-pane :label="'已完成('+afterSaleByStatusCountList.completeNum+')'" name="3"></el-tab-pane>
            <el-tab-pane :label="'已拒绝('+afterSaleByStatusCountList.refuseNum+')'" name="4"></el-tab-pane>
          </el-tabs>
        </div>

        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <!-- <el-button disabled size="mini">导出订单</el-button> -->
            </div>
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
          <el-table-column prop="contactName" label="联系人" width="130"></el-table-column>
          <el-table-column align="center" label="申请状态" width="115" prop="status">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">商家已拒绝</span>
              <span v-if="scope.row.status == '1'">待商家同意</span>
              <span v-if="scope.row.status == '2'">商家已同意</span>
              <span v-if="scope.row.status == '4'">商家已拒绝</span>
              <span v-if="scope.row.status == '3'">商家已收货</span>
              <span v-if="scope.row.status == '6'">已完成</span>
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
          <!-- 分页 -->
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAfterSaleList, afterSaleByStatusCount, deleteOrder } from "../../api/order";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      disabled: true,
      afterSaleList: [],
      select: "不限",
      searchSn: "" /* 订单id 搜索 */,
      searchName: "" /* 收货人/电话 搜索 */,
      searchTime: [],
      startTime: "" /* 订单日期 搜索 */,
      endTime: "",
      status: "all" /* 当前状态 */,
      closeVisible4: false,
      userId: "1237352685870350337",
      afterSaleByStatusCountList: {
        /* 各个状态的数量 */
        completeNum: "",
        pendingNum: "",
        refuseNum: "",
        returningNum: "",
        allNum: ""
      },
      noteform: {
        text: "" /* 操作备注 */
      },
      batchOptions: [{ label: "批量删除", value: "delete" }],
      value1: "",
      batchValue: "",
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      value: "",
      statuses: [],
      batchArr: []
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
      }
    }
  },
  mounted() {
    afterSaleByStatusCount(this.userId).then(data => {
      this.afterSaleByStatusCountList = data.data.data;
    });
    if (this.$route.query.status != undefined) {
      this.status = this.$route.query.status == undefined ? " " : this.$route.query.status;
    } else {
      this.showAll();
    }
  },
  methods: {
    // 确认
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
    advancedClick() {},
    // 重置
    restClick() {
      this.cocatValue = "";
      this.cocatValue1 = "";
    },
    addNewOrder() {},
    viewDetails(rows) {
      this.$router.push({ name: "return_Goods_Details", query: { id: rows.id } });
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
      if (this.searchName !== "" || this.startTime !== "" || this.endTime !== "" || this.status !== undefined) {
        // 执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}) {
      getAfterSaleList({
        pageSize: 20,
        pageNo: Number.isInteger(val.apge) ? val.page : 1,
        sn: this.searchSn == "" ? null : this.searchSn,
        contact: this.searchName == "" ? null : this.searchName,
        endTime: this.endTime,
        userId: this.userId,
        startTime: this.startTime,
        statuss: this.status === "all" ? null : new Array(this.status)
      }).then(data => {
        if (data.status == 200) {
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
      getAfterSaleList({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20,
        userId: this.userId
      }).then(data => {
        if (data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.afterSaleList = data.data.data.list;
      if (data.data.data.list) {
        this.total = data.data.data.total;
        this.cPage = data.data.data.pageNum;
        this.size = data.data.data.pageSize;
      } else {
        this.total = 0;
        this.cPage = 1;
        this.size = 20;
      }
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchSn = null;
      this.searchName = null;
      this.searchTime = [];
      this.endTime = null;
      this.startTime = null;
      this.status = "all";
      this.showAll();
    }
  }
};
</script>

<style lang="less">
#return_goods {
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  width: 100%;
  height: auto;
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
