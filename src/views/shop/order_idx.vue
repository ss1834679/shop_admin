<template>
  <div id="order_idx">
    <!-- 订单列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">订单列表</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="订单编号/商品货号" v-model="searchId" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-input placeholder="收货人姓名/手机号码" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请选择日期"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="status">
          <el-tabs v-model="status" type="card" @tab-click="changeStatus">
            <el-tab-pane :label="'全部订单('+number.all+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'已取消('+number.cancal+')'" name="0"></el-tab-pane>
            <el-tab-pane :label="'待付款('+number.beforePay+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'待发货('+number.beforeSend+')'" name="2"></el-tab-pane>
            <el-tab-pane :label="'待收货('+number.beforeReceive+')'" name="3"></el-tab-pane>
            <el-tab-pane :label="'已完成('+number.success+')'" name="4"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="orderList" border row-key="id" height="200" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="id" label="订单编号" width="135">
            <!-- <template slot-scope="scope">{{scope.row.orderItem.id}}</template> -->
          </el-table-column>
          <el-table-column prop="createTime" label="提交时间"></el-table-column>
          <el-table-column prop="userName" label="用户名"></el-table-column>
          <el-table-column prop="totalMoney" label="订单金额" width="100">
            <template slot-scope="scope">{{ '¥' + (scope.row.totalMoney / 100).toFixed(2) }}</template>
          </el-table-column>
          <el-table-column prop="payType" align="center" label="支付方式" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.payType == '1'" type="success">微信</el-tag>
              <el-tag v-if="scope.row.payType == '2'">支付宝</el-tag>
              <el-tag v-if="scope.row.payType == '3'" type="warning">银联</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="sourceType" align="center" label="订单来源" width="105">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.sourceType == '1'" effect="dark" type="info">WEB</el-tag>
              <el-tag v-if="scope.row.sourceType == '2'">APP</el-tag>
              <el-tag v-if="scope.row.sourceType == '3'" type="warning">微信公众号</el-tag>
              <el-tag v-if="scope.row.sourceType == '4'" type="success">微信小程序</el-tag>
              <el-tag v-if="scope.row.sourceType == '5'" style="color:white" color="#657180">H5手机页</el-tag>
            </template>
          </el-table-column>
          <el-table-column align="center" label="订单状态" width="105">
            <!-- <template slot-scope="scope">
              <el-tag v-if="scope.row.orders.orderStatus == '0'" effect="dark" type="danger">已取消</el-tag>
              <el-tag v-if="scope.row.orders.orderStatus == '1'" effect="dark" type="info">待付款</el-tag>
              <el-tag v-if="scope.row.orders.orderStatus == '2'" effect="dark" type="warning">待发货</el-tag>
              <el-tag v-if="scope.row.orders.orderStatus == '3'" effect="dark">待收货</el-tag>
              <el-tag v-if="scope.row.orders.orderStatus == '4'" effect="dark" type="success">已完成</el-tag>
            </template>-->
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="viewOrder(scope.row)">查看订单</el-button>
                <!-- 每一个阶段 不同的操作 已取消 -->
                <el-button v-if="scope.row.orderStatus == '0'" type="text" size="medium">删除订单</el-button>
                <!-- 待付款 -->
                <el-button v-if="scope.row.orderStatus == '1'" type="text" size="medium" @click="closeOrder({type:'open',obj:scope.row})">关闭订单</el-button>
                <!-- 待发货 -->
                <el-button v-if="scope.row.orderStatus == '2'" type="text" size="medium">订单发货</el-button>
                <!-- 待收货 -->
                <el-button v-if="scope.row.orderStatus == '3'" type="text" size="medium">订单跟踪</el-button>
                <!-- 已完成 -->
                <el-button v-if="scope.row.orderStatus == '4'" type="text" size="medium">订单跟踪</el-button>
              </el-button-group>
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
      <el-dialog title="关闭订单" :visible.sync="closeVisible">
        <el-form label-width="80px">
          <el-form-item label="操作备注">
            <el-input type="textarea" v-model="noteform.text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="closeOrder({type:'close'})">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrderList } from "../../api/order";
export default {
  data() {
    return {
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchId: null /* 订单id 搜索 */,
      searchName: null /* 收货人/电话 搜索 */,
      searchDate: null /* 订单日期 搜索 */,
      status: "all" /* 当前状态 */,
      closeVisible: false /* 关闭订单弹窗 */,
      number: {
        /* 各个状态的数量 */
        all: 0,
        cancal: 0,
        beforePay: 0,
        beforeSend: 0,
        beforeReceive: 0,
        success: 0
      },
      noteform: {
        text: "" /* 操作备注 */
      },
      orderList: [
        {
          id: "1217292128019832834" /* 订单编号 id */,
          createTime: "2020-01-06 15:11:12" /* 订单创建时间 */,
          userName: "用户名1" /* 通过userId查到的用户名 */,
          totalMoney: 21296 /* 订单金额(分) */,
          payType: "2" /* 支付类型 1微信 2支付宝 3银联 */,
          /* 订单来源 1web 2app 3微信公众号 4微信小程序 5 H5手机页面 */
          sourceType: "4",
          /* 订单状态  0已取消 1待付款 2待发货 3待收货 4已完成 */
          orderStatus: "1"
        }
      ],
      total: null /* 分页总数 */,
      cPage: 1 /* 当前页码 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addNewOrder() {
      // this.$router.push({ name: "order_add" });
      // this.$prompt("请输入新分类名", "修改分类", {
      //   confirmButtonText: "确定",
      //   cancelButtonText: "取消"
      // })
      //   .then(({ value }) => {
      //     updateCate({ categoryId: row._id, categoryName: value }).then(() => {
      //       this.showAll(this.parentId);
      //     });
      //   })
      //   .catch(() => {});
    },
    viewOrder(rows) {
      this.$router.push({ name: "order_view", query: { id: rows.id } });
    },
    closeOrder(obj) {
      if (obj.type == "open") {
        this.noteform = { text: "", info: obj.obj };
        this.closeVisible = true;
      } else if (obj.type == "close") {
        console.log(this.noteform);
      }
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
      console.log(this.searchName);
      console.log(this.searchDate);
      console.log(val);
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
      getOrderList().then(data => {
        console.log(data);
        if (data.data.status == 0) {
          // this.setView(data);
          // loading.close()
        }
      });
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
      this.searchName = null;
      this.searchDate = null;
      console.log(this.searchId);
      console.log(this.searchName);
      console.log(this.searchDate);
      // this.showAll()
    },
    /* 状态的启用和禁用 */
    handleIsDelete(obj) {
      if (obj.type == "up") {
        obj.row.isDelete = 0;
        console.log("启用成功");
        /* 调用接口 */
      }
      if (obj.type == "down") {
        obj.row.isDelete = 1;
        console.log("禁用成功");
        /* 调用接口 */
      }
    }
  },
  components: {}
};
</script>

<style lang="less">
#order_idx {
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
