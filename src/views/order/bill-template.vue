<template>
  <div id="bill-template">
    <!-- 快递单模板页 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">快递单模板</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <div class="se-right">
          <div class="box-r">
            <el-button size="mini" @click="addTemplate({type:'open'})">添加模板</el-button>
          </div>
        </div>
      </div>
      <!-- 表格标题 -->
      <el-table :data="afterSaleList" border row-key="id"  style="width: 100%" @selection-change="getSelection">
        <el-table-column type="selection" align="center" width="70"></el-table-column>
        <el-table-column prop="sn" label="单据编号"></el-table-column>
        <el-table-column prop="userNum" label="单据名称"></el-table-column>
        <el-table-column align="center" label="是否启用" width="115">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.valueSwitch" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope>
            <el-button type="text" size="medium" @click="addTemplate">编辑</el-button>
            <el-button type="text" size="medium" @click="addTemplate">添加相似快递单</el-button>
            <!-- 每一个阶段 不同的操作 已取消 -->
            <el-button type="text" size="medium" @click="deleteClick">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <div>  
          <el-select v-model="batchValue" placeholder="批量操作">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
          <el-button @click="batchOperation">确认</el-button>
        </div>
        <!-- 分页 -->
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
// import { getOrderList } from "../../api/order";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      select: "不限",
      searchId: null /* 订单id 搜索 */,
      searchName: null /* 收货人/电话 搜索 */,
      searchDate: null /* 订单日期 搜索 */,
      status: "all" /* 当前状态 */,
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
      afterSaleList: [
        {
          sn: "1217292128019832834" /* 服务单号 id */,
          userNum: "1217292128019832834" /* 服务单号 id */,
          createTime: "2020-01-06 15:11:12" /* 申请时间 */,
          createTime2: "2020-01-06 15:11:12" /* 申请时间 */,
          handleTime: "2020-01-06 15:11:12" /* 处理时间 */,
          userName: "用户名1" /* 通过userId查到的用户名 */,
          totalMoney: 21296 /* 退款金额(分) */,
          contactName: "按理说大" /* 联系人 */,
          /* 申请状态  0:商家已拒绝 1:待商家同意 2:商家已同意 3:商家已收货 4:退款中(退款) 5:已发货(换货) 6:已完成 7:客户已取消 */
          status: "1",
          valueSwitch:true
        },
        {
          sn: "1217292128019832834" /* 服务单号 id */,
          userNum: "1217292128019832834" /* 服务单号 id */,
          createTime: "2020-01-06 15:11:12" /* 申请时间 */,
          createTime2: "2020-01-06 15:11:12" /* 申请时间 */,
          handleTime: "2020-01-06 15:11:12" /* 处理时间 */,
          userName: "用户名1" /* 通过userId查到的用户名 */,
          totalMoney: 21296 /* 退款金额(分) */,
          contactName: "按理说大" /* 联系人 */,
          /* 申请状态  0:商家已拒绝 1:待商家同意 2:商家已同意 3:商家已收货 4:退款中(退款) 5:已发货(换货) 6:已完成 7:客户已取消 */
          status: "1",
          valueSwitch:true
        },
        {
          sn: "1217292128019832834" /* 服务单号 id */,
          userNum: "1217292128019832834" /* 服务单号 id */,
          createTime: "2020-01-06 15:11:12" /* 申请时间 */,
          createTime2: "2020-01-06 15:11:12" /* 申请时间 */,
          handleTime: "2020-01-06 15:11:12" /* 处理时间 */,
          userName: "用户名1" /* 通过userId查到的用户名 */,
          totalMoney: 21296 /* 退款金额(分) */,
          contactName: "按理说大" /* 联系人 */,
          /* 申请状态  0:商家已拒绝 1:待商家同意 2:商家已同意 3:商家已收货 4:退款中(退款) 5:已发货(换货) 6:已完成 7:客户已取消 */
          status: "1",
          valueSwitch:true
        }
      ],
      batchValue: "",
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
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,
      value: "",
      valueSwitch: true
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    // 删除
    deleteClick() {},
    // 确认
    batchOperation() {},
    // 编辑按钮，打开编辑框
    viewOrder(obj1) {
      if (obj1.type == "open") {
        this.noteform = { text: "", info: obj1.obj1 };
        this.closeVisible = true;
      }
    },
    // 添加模板
    addTemplate(rows) {
      this.$router.push({ name: "add-template", query: { id: rows.order_sn } });
    },
    closeOrder(obj) {
      if (obj.type == "open") {
        this.noteform = { text: "", info: obj.obj };
        this.closeVisible = true;
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
      if (this.searchOrderSn != "" || this.searchDate != "" || this.addressId != "" || this.status != "all") {
        // 执行查询中的分页
        this.selectByKwd(val);
      } else {
        // 执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
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
  }
};
</script>

<style lang="less">
#bill-template{
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
