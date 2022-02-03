<template>
  <div id="order_idx">
    <!-- 确定收货页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">确认收货</span>
      </div>

      <!-- 筛选 -->
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <el-button size="mini" @click="confirmClick">一键确认收货</el-button>
            </div>
          </div>
        </div>
        <!-- 表格标题 -->
        <el-table :data="orderList" border row-key="id" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column label="订单编号" prop="orderSn"></el-table-column>
          <el-table-column prop="createTime" label="提交时间"></el-table-column>
          <el-table-column prop="userAccount" label="用户账号"></el-table-column>
          <el-table-column prop="recipient" label="收货人" width="100"></el-table-column>
          <el-table-column prop="amoutPaid" label="订单金额" width="135">
            <template slot-scope="scope">
              <span>{{ "¥" + (scope.row.amoutPaid / 100).toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单状态" width="90" prop="orderStatus">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.orderStatus== '0'" effect="dark" type="danger">已取消</el-tag>
              <el-tag v-if="scope.row.orderStatus == '1'" effect="dark" type="info">待付款</el-tag>
              <el-tag v-if="scope.row.orderStatus == '2'" effect="dark" type="warning">待发货</el-tag>
              <el-tag v-if="scope.row.orderStatus == '3'" effect="dark">待收货</el-tag>
              <el-tag v-if="scope.row.orderStatus == '4'" effect="dark" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="automaticReceivingTime" label="自动确认收货时间" width="90"></el-table-column>
          <el-table-column prop="timeOfReceipt" label="订单应收货时间"></el-table-column>
          <el-table-column label="操作" align="center" width="150" prop="sourceType">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewOrder(scope.row)">查看订单</el-button>
                <!-- 确认收货 -->
                <el-button type="text" size="medium" @click="confirmClick(scope.row)">确认收货</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <!-- 分页 -->
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getOrderList, confirmReceipt } from "../../api/order";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      orderList: [],
      searchOrderSn: null /* 订单id 搜索 */,
      searchNumber: null /* 收货人/电话 搜索 */,
      searchDate: null /* 订单日期 搜索 */,
      status: "3" /* 确认收货状态 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 跳转到订单详情页
    viewOrder(rows) {
      this.$router.push({ name: "order_view", query: { id: rows.orderId } });
    },
    // 批量操作
    getSelection(val) {
      this.batchArr = [];
      val.forEach(item => {
        this.batchArr.push(item.orderId);
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchOrderSn !== "" ||
        this.searchDate !== "" ||
        this.searchNumber !== "" ||
        this.status !== undefined
      ) {
        // 执行查询中的分页
        this.selectByKwd(val);
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    // 确认收货
    confirmClick(row) {
      if (row.orderId) {
        confirmReceipt([row.orderId]).then(data => {
          if (data.status == 200) {
            this.$message({
              message: "收货成功",
              type: "success"
            });
            this.setView(data);
          } else {
            this.$message.error("收货失败");
          }
        });
      } else {
        if (this.batchArr.length > 0) {
          confirmReceipt(this.batchArr).then(data => {
            if (data.status == 200) {
              this.$message({
                message: "收货成功",
                type: "success"
              });
              this.setView(data);
            } else {
              this.$message.error("收货失败");
            }
          });
        } else {
          this.$message.error("请选择订单");
        }
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getOrderList({
        pageSize: 20,
        pageNo: Number.isInteger(val) ? val : 1,
        orderStatus: this.status,
        orderSn: this.searchOrderSn == "" ? null : this.searchOrderSn,
        receive: this.searchNumber == "" ? null : this.searchNumber,
        endTime: this.searchDate == "" ? null : this.searchDate,
        startTime: this.searchDate == "" ? null : this.searchDate
      }).then(data => {
        this.setView(data);
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getOrderList({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20,
        orderStatus: this.status
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.orderList = data.data.data.list;
      this.total = data.data.data.total || 0;
      this.cPage = data.data.data.pageNum || 1;
      this.size = data.data.data.pageSize || 20;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchOrderSn = "";
      this.searchDate = "";
      this.searchNumber = "";
      this.addressId = "";
      this.status = "all";
      // this.showAll()
    }
  }
};
</script>

<style lang="less">
#order_idx {
  width: 100%;
  height: auto;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
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

    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      /* 筛选按钮 */
      .s-size {
        font-size: 13px;
      }
    }
  }
}
</style>
