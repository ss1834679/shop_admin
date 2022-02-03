<template>
  <div id="order_idx">
    <!-- 登录日志页 -->
    <el-card class="box-card" shadow="never">
  <div slot="header" class="clearfix">
        <span class="title">登录日志</span>
        <div>
           <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <!-- 筛选 -->
      <div class="content">
        <!--数据列表  -->
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
        </div>
        <!-- 表格标题 -->
        <el-table :data="findLandingLogList" border row-key="id" style="width: 100%">
        <el-table-column prop="loginTime" label="时间" ></el-table-column>
          <el-table-column  label="Ip"  prop="loginIp" ></el-table-column>
           
          <el-table-column prop="loginAddress" label="地区" ></el-table-column>
           <el-table-column align="center" label="登录方式" width="150" prop="browseClient"></el-table-column>
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
import {
   findLandingLog,
 } from "../../api/user";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      batchArr:[],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */,  
      userId:'',
      findLandingLogList:[],
    }
  },
  watch: {
  },
  mounted() {
    // console.log(this.$route.query.id)
    this.showAll();
  },
  methods: {  
    /* 分页点击 */
    handleCurrentChange(val) {
       this.selectByKwd(val);
        this.showAll(val);
    },
    /* 搜索分页 */
    selectByKwd(val) {
      findLandingLog({
       pageSize:20,
      pageNo: Number.isInteger(val) ? val : 1,
      }).then(data => {
        console.log(data);
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
    
      this.userId='111'
      findLandingLog({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize:20,
        userId:this.userId,
      }).then(data => {
        console.log(data);
        if (data.data.status == 0) {
      this.setView(data);
      // loading.close()
        }
      });
    },
    /* 更改筛选条件 */
    changeStatus() {},
    /* 渲染表格 */
    setView(data) {
       this.findLandingLogList=data.data.data.list;
      console.log(this.orderList)
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
  }
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
        display: flex;
        margin-left: 20px;
        justify-content: space-between;
        align-items: center;
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
        justify-content: flex-end;
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
