<template>
  <div id="operationLog">
    <!-- 商品列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">操作日志</span>
        <div class="clearDate">
          <span>清除日志:</span>
          <el-date-picker v-model="clearDate" type="date" value-format="yyyy-MM-dd" placeholder="选择清除的日期"></el-date-picker>
          <el-button plain size="small" @click="clearLog">确定</el-button>
        </div>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入操作人员" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" value-format="yyyy-MM-dd" @change="selectByKwd" placeholder="过期时间"></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="operationList" border style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="sn" label="编号"></el-table-column>
          <el-table-column prop="operator" label="操作者"></el-table-column>
          <el-table-column prop="operatDate" label="操作日期"></el-table-column>
          <el-table-column prop="ip" label="IP地址"></el-table-column>
          <el-table-column prop="content" label="操作记录" align="center" width="600"></el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      searchInput: "" /* 名称 */,
      searchDate: "" /* 操作日期 */,
      clearDate: "" /* 清除时间 */,
      operationList: [
        { sn: "bianhao", operator: "admin", operatDate: "2017-07-07 16:58:11", ip: "220.231.210.22", content: "记录" },
        { sn: "bianhao", operator: "admin", operatDate: "2017-07-07 16:58:11", ip: "220.231.210.22", content: "记录" }
      ],
      selectedList: "",
      total: 100 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 清空搜索 */
    clearSearch() {
      this.searchDate = "";
      this.searchInput = "";
      this.selectByKwd();
    },
    /* 清除日志 */
    clearLog() {
      console.log(this.clearDate);
    },
    /* 批量操作 */
    getSelection(val) {
      this.selectedList = ""; /* 先置空 */
      /* 批量操作id拼接 */
      val.forEach((item, index, arr) => {
        if (index == arr.length - 1) {
          this.selectedList = this.selectedList + item.sn;
        } else {
          this.selectedList = this.selectedList + item.sn + ",";
        }
      });
      console.log(this.selectedList);
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchDate != "") {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      console.log(val, 222);
      console.log(this.searchInput);
      console.log(this.searchDate);
    },
    /* 渲染表格 */
    // setView(data) {
    //   this.operationList = data.data.data.data.list;
    //   this.number = data.data.data.goodsNum;
    //   this.total = data.data.data.data.total;
    //   this.cPage = data.data.data.data.pageNum;
    //   this.size = data.data.data.data.pageSize;
    // },
    /*  */
    showAll() {
      console.log("showAll");
    }
  },
  components: { paginationCom }
};
</script>

<style lang='less'>
#operationLog {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
        .clearDate {
          display: flex;
          align-items: center;
          span {
            margin-right: 10px;
          }
          .el-button {
            margin-left: 10px;
          }
        }
      }
    }
    
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
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
          .input-with-select {
            .el-input--suffix {
              .el-input__inner {
                width: 80px;
              }
            }
          }
        }
        .addGood {
          margin-left: 30px;
        }
      }
      .el-button-group.alterDel {
        .el-button--text {
          padding-top: 5px;
          padding-bottom: 5px;
        }
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
