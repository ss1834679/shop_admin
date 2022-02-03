<template>
  <div id="order_idx">
    <!-- 到货提醒展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">到货提醒</span>
      </div>

      <!-- 筛选 -->
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span class="s-size">请输入:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="订单编号" v-model="searchOrderSn" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="stateValue" placeholder="请选择提醒状态">
              <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value"  @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="请选择日期"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>

        <!-- 选择状态 -->
        <div class="status">
          <el-tabs v-model="status" type="card" @tab-click="changeStatus">
            <el-tab-pane :label="'全部订单(' + number.all + ')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'已取消(' + number.cancal + ')'" name="0"></el-tab-pane>
            <el-tab-pane :label="'待付款(' + number.beforePay + ')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'待发货(' + number.beforeSend + ')'" name="2"></el-tab-pane>
            <el-tab-pane :label="'待收货(' + number.beforeReceive + ')'" name="3"></el-tab-pane>
            <el-tab-pane :label="'已完成(' + number.success + ')'" name="4"></el-tab-pane>
          </el-tabs>
        </div>
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
           
          </div>
        </div>
        <!-- 表格标题 -->
        <el-table :data="orderList" border row-key="id" height="200" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="order_sn" label="编号" ></el-table-column>
          <el-table-column prop="oid" label="用户名"></el-table-column>
          <el-table-column prop="user_id" label="邮箱地址"></el-table-column>
          <el-table-column prop="user_id" label="商品名称"></el-table-column>
          <el-table-column prop="create_time" label="设置时间"></el-table-column>         
          <el-table-column align="center" label="订单状态" width="105">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.order_status == '0'" effect="dark" type="danger">已取消</el-tag>
              <el-tag v-if="scope.row.order_status == '1'" effect="dark" type="info">待付款</el-tag>
              <el-tag v-if="scope.row.order_status == '2'" effect="dark" type="warning">待发货</el-tag>
              <el-tag v-if="scope.row.order_status == '3'" effect="dark">待收货</el-tag>
              <el-tag v-if="scope.row.order_status == '4'" effect="dark" type="success">已完成</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="105">
             <el-button type="text" size="medium">删除订单</el-button>   
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <div>
            <el-select v-model="batchValue" placeholder="批量操作">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-button @click="batchOperation">确认</el-button>
          </div>
          <!-- 分页 -->
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
          <!-- <el-pagination
            @current-change="handleCurrentChange"
            background
            :current-page="cPage"
            :page-size="size"
            layout="total,prev, pager, next"
            :total="total"
          ></el-pagination>-->
        </div>
      </div>
      <!-- 关闭订单弹窗框 -->
      <el-dialog title="关闭订单" :visible.sync="closeVisible">
        <el-form label-width="80px">
          <el-form-item label="操作备注">
            <el-input type="textarea" v-model="noteform.text"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="nodeVisible = false">取 消</el-button>
          <el-button type="primary" @click="closeOrder({ type: 'close' })">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import { getOrderList } from "../../api/order";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      form: {
        name: "",
        region: "",
        region1: "",
        region2: "",
        region3: "",
        region4: "",
        num: ""
      },
      select: "不限",
      searchOrderSn: null /* 订单id 搜索 */,
      searchNumber: null /* 收货人/电话 搜索 */,
      searchDate: null /* 订单日期 搜索 */,
      addressId: "" /* 去用户中心查的收货人信息 中间变量 */,
      status: "all" /* 当前状态 大的筛选条件 */,
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
          order_item_id: "33333333" /* 详情订单id */,
          order_status: "3" /* 订单状态  0已取消 1待付款 2待发货 3待收货 4已完成 */,
          create_time: "2020-02-06T02:53:30.000+0000" /* 订单创建时间 */,
          real_Amount: "10" /* 订单金额(分) */,
          user_id: "666" /* 通过userId查到的用户名 */,
          pay_type: "1" /* 支付类型 1微信 2支付宝 3银联 */,
          source_type: "a" /* 订单来源 1web 2app 3微信公众号 4微信小程序 5 H5手机页面 */,
          oid: "1212982575862247425" /* 总订单id */,
          order_sn: "333333" /* 订单编号 */
        },
        {
          order_item_id: "22222222",
          order_status: "0",
          create_time: "2020-02-06T02:52:37.000+0000",
          real_Amount: "100",
          user_id: "666",
          pay_type: "",
          source_type: "1",
          oid: "1211613708678115329",
          order_sn: "21212"
        },
        {
          order_item_id: "11111111",
          order_status: "2",
          create_time: "2020-02-06T02:51:36.000+0000",
          real_Amount: "100",
          user_id: "666",
          pay_type: "",
          source_type: "1",
          oid: "1211587525429198849",
          order_sn: "12121"
        },
        {
          order_item_id: "1217296029620174849",
          order_status: "1",
          create_time: "2020-01-15T04:02:44.000+0000",
          real_Amount: "44694910",
          user_id: "999",
          pay_type: "",
          source_type: "2",
          oid: "1217296029762781185",
          order_sn: "157906096387099912144361049047162"
        },
        {
          order_item_id: "1217293204949327873",
          order_status: "3",
          create_time: "2020-01-15T03:51:03.000+0000",
          real_Amount: "44694910",
          user_id: "666",
          pay_type: "1",
          source_type: "a",
          oid: "1212982575862247425",
          order_sn: "15790602626888881214436104904716289"
        },
        {
          order_item_id: "1217292128019832834",
          order_status: "4",
          create_time: "2020-01-15T03:47:14.000+0000",
          real_Amount: "44694910",
          user_id: "2",
          pay_type: "",
          source_type: "2",
          oid: "1215184680547090433",
          order_sn: "15790600336289991214436104904716289"
        },
        {
          order_item_id: "1215476748150464514",
          order_status: "3",
          create_time: "2020-01-10T03:33:34.000+0000",
          real_Amount: "41870030",
          user_id: "666",
          pay_type: "1",
          source_type: "a",
          oid: "1212982575862247425",
          order_sn: "722221214436105768742915"
        },
        {
          order_item_id: "1215473421664739329",
          order_status: "4",
          create_time: "2020-01-10T03:20:20.000+0000",
          real_Amount: "16662600",
          user_id: "2",
          pay_type: "",
          source_type: "2",
          oid: "1215184680547090433",
          order_sn: "368881214436104984408066"
        },
        {
          order_item_id: "1215471414631505922",
          order_status: "4",
          create_time: "2020-01-10T03:12:22.000+0000",
          real_Amount: "71928200",
          user_id: "666",
          pay_type: "",
          source_type: "1",
          oid: "1211611983028203521",
          order_sn: "1721214436104896327682"
        },
        {
          order_item_id: "1215467475764813826",
          order_status: "4",
          create_time: "2020-01-10T02:55:53.000+0000",
          real_Amount: "-2116396592",
          user_id: "2",
          pay_type: "",
          source_type: "2",
          oid: "1215184680547090433",
          order_sn: "6221214436104896327682"
        }
      ],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      options: [
        {
          value: "选项1",
          label: "黄金糕"
        },
        {
          value: "选项2",
          label: "双皮奶"
        },
        {
          value: "选项3",
          label: "蚵仔煎"
        },
        {
          value: "选项4",
          label: "龙须面"
        },
        {
          value: "选项5",
          label: "北京烤鸭"
        }
      ],
       stateOptions: [
        {
          value: "选项1",
          label: "已到货"
        },
        {
          value: "选项2",
          label: "未到货"
        }
      ],
      stateValue:'',
      value1: "",
      value: "",
      cocatValue1: "",
      cocatValue: "",
      batchValue:''
    };
  },
  watch: {
    status: {
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    getOrderList().then(data => {
      console.log(data);
    });
    this.showAll();
  },
  methods: {
    // 跳转到订单详情页
    viewOrder(rows) {
      this.$router.push({ name: "order_view", query: { id: rows.order_sn } });
    },
    // 弹框的关闭按钮
    closeOrder(obj1) {
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      } else if (obj1.type == "close") {
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
      if (this.searchOrderSn != "" || this.searchDate != "" || this.addressId != "" || this.status != "all") {
        // 执行查询中的分页
        this.selectByKwd(val);
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    // 关闭订单
    batchOperation() {},
    /* 搜索分页 */
    selectByKwd(val) {
      console.log(this.searchOrderSn);
      console.log(this.searchNumber);
      console.log(this.searchDate);
      console.log(this.status);
      console.log(val);
      getOrderList({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20,
        queryFields: {
          orderSn: this.searchOrderSn == "" ? null : this.searchOrderSn,
          createTime: this.searchDate == "" ? null : this.searchDate,
          congigneeOrMobile: this.searchNumber == "" ? null : this.searchNumber,
          status: this.status == "all" ? null : this.status
        }
      }).then(data => {
        console.log(data);
      });
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
      // getOrderList().then(data => {
      //   console.log(data);
      //   if (data.data.status == 0) {
      // this.setView(data);
      // loading.close()
      //   }
      // });
    },
    /* 更改筛选条件 */
    changeStatus() {},
    /* 渲染表格 */
    setView(data) {
      console.log(data, 999);
      this.orderList = data.data.list;
      this.total = data.data.total;
      this.cPage = data.data.pageNo;
      this.size = data.data.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchOrderSn = "";
      this.searchDate = "";
      this.searchNumber = "";
      this.addressId = "";
      this.status = "all";
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
  }
};
</script>

<style lang="less">
#order_idx {
  width: 100%;
  height: auto;
   .clearfix{
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
      .s-size {
        font-size: 13px;
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
