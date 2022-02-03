<template>
  <div id="return_goods">
    <!-- 退款列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">退款申请</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="服务单号" v-model="searchId" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="申请时间"></el-date-picker>
          </div>
          <div class="search_box">
            <el-select v-model="searchStatus" placeholder="处理状态">
              <el-option label="待处理" :value="4"></el-option>
              <el-option label="已完成" :value="6"></el-option>
              <el-option label="已拒绝" :value="0"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="status">
          <el-tabs v-model="status" type="card" @tab-click="changeStatus">
            <el-tab-pane :label="'全部申请('+number.all+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'待处理('+number.cancal+')'" name="4"></el-tab-pane>
            <el-tab-pane :label="'已处理('+number.beforeReceive+')'" name="6"></el-tab-pane>
            <el-tab-pane :label="'已拒绝('+number.beforeReceive+')'" name="0"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="afterSaleList" border row-key="id" height="200" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="sn" label="服务单号" width="135">
            <!-- <template slot-scope="scope">{{scope.row.orderItem.id}}</template> -->
          </el-table-column>
          <el-table-column prop="createTime" label="申请时间"></el-table-column>
          <el-table-column prop="userName" label="用户账号"></el-table-column>
          <el-table-column prop="totalMoney" label="退款金额" width="100">
            <template slot-scope="scope">{{ '¥' + (scope.row.totalMoney / 100).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column align="center" label="申请状态" width="135">
            <template slot-scope="scope">
              <span v-if="scope.row.status == '0'">已拒绝</span>
              <span v-if="scope.row.status == '4'">待处理</span>
              <span v-if="scope.row.status == '6'">已处理</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button type="text" size="medium" @click="viewDetails(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <!-- <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>-->
          <el-pagination
            @current-change="handleCurrentChange"
            background
            :current-page="cPage"
            :page-size="20"
            layout="prev, pager, next"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { getOrderList } from "../../api/order";
export default {
  data() {
    return {
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchId: null /* 服务单id 搜索 */,
      searchDate: null /* 申请日期 搜索 */,
      searchStatus: null /* 处理状态 搜索 */,
      status: "all" /* 当前状态 */,
      number: {
        /* 各个状态的数量 要改 */
        all: 0,
        cancal: 0,
        beforePay: 0,
        beforeSend: 0,
        beforeReceive: 0,
        success: 0
      },
      afterSaleList: [
        {
          sn: "1217292128019832834" /* 服务单号 id */,
          createTime: "2020-01-06 15:11:12" /* 申请时间 */,
          handleTime: "2020-01-06 15:11:12" /* 处理时间 */,
          userName: "用户名1" /* 通过userId查到的用户名 */,
          totalMoney: 21296 /* 退款金额(分) */,
          contactName: "按理说大" /* 联系人 */,
          /* 申请状态  0:商家已拒绝 1:待商家同意 2:商家已同意 3:商家已收货 4:退款中(退款) 5:已发货(换货) 6:已完成 7:客户已取消 */
          status: "4"
        }
      ],
      total: 100 /* 分页总数 */,
      cPage: 1 /* 当前页码 */
    };
  },
  watch: {
    searchStatus: {
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    // this.showAll();
  },
  methods: {
    addNewOrder() {},
    viewDetails(rows) {
      this.$router.push({ name: "return_Money_Details", query: { id: rows.sn } });
    },
    getSelection(val) {
      this.selectedList = ""; /* 先置空 */
      /* 批量操作id拼接 */
      val.forEach((item, index, arr) => {
        if (index == arr.length - 1) {
          this.selectedList = this.selectedList + item.id;
        } else {
          this.selectedList = this.selectedList + item.id + ",";
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      console.log(val);
      if (this.selectValue != "") {
        //执行查询中的分页
        // this.selectByKwd(val);
      } else {
        //执行全部中的分页
        // this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      console.log(this.searchId);
      console.log(this.searchStatus);
      console.log(this.searchDate);
      console.log(val, 999);
      // getBrand({
      //   pageNo: Number.isInteger(val) ? val : 1,
      //   brandName: this.selectValue
      // }).then(data => {
      //   if (data.data.status == 0) {
      //     console.log(data);
      //     this.setView(data);
      //     this.$message({
      //       message: "已执行查询",
      //       type: "success"
      //     });
      //   }
      // });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      console.log(val);
      //   getOrderList().then(data => {
      // console.log(data);
      // if (data.data.status == 0) {
      // this.setView(data);
      // loading.close()
      //     }
      //   });
    },
    /* 更改筛选条件 */
    changeStatus() {},
    /* 渲染表格 */
    setView(data) {
      console.log(data, 999);
      this.brandList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchId = null;
      this.searchStatus = null;
      this.searchDate = null;
      console.log(this.searchId);
      console.log(this.searchStatus);
      console.log(this.searchDate);
      // this.showAll()
    }
  },
  components: {}
};
</script>

<style lang="less">
#return_goods {
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
