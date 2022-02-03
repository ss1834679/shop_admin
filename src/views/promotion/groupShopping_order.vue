<template>
  <div id="groupShopping_order">
    <!-- 团单管理 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">拼团管理</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>团单号：</span>
            <el-input placeholder="请输入团单号" v-model="searchAssembleSn" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>商品名称：</span>
            <el-input placeholder="请输入商品名称" v-model="searchGoodsTitle" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div>
            <span>开团时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="status">
          <el-tabs v-model="status" type="card">
            <el-tab-pane :label="'全部('+number.allNum+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'拼团成功('+number.succeed+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'拼团中('+number.underway+')'" name="0"></el-tab-pane>
            <el-tab-pane :label="'拼团失败('+number.failure+')'" name="2"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="groupShopOrder" border style="width: 100%">
          <el-table-column prop="assembleSn" label="团单号"></el-table-column>
          <el-table-column prop="goodsId" align="center" label="商品ID"></el-table-column>
          <el-table-column prop="goodsTitle" label="商品名称" width="280"></el-table-column>
          <el-table-column label="状态" width="100" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.status==0">拼团中</span>
              <span v-if="scope.row.status==1">拼团成功</span>
              <span v-if="scope.row.status==2">拼团失败</span>
            </template>
          </el-table-column>
          <el-table-column label="已拼/总需" align="center">
            <template slot-scope="scope">{{scope.row.existPersonNum+" / "+scope.row.assemblePersonNum}}</template>
          </el-table-column>
          <el-table-column label="拼团类型" width="100" align="center">
            <span>普通团</span>
          </el-table-column>
          <el-table-column prop="startTime" label="开团时间"></el-table-column>
          <el-table-column prop="endTime" label="到期时间"></el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="viewGroupShopOrder(scope.row)">查看拼团详情</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getAssembleManagePage } from "../../api/promotion";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      status: "all" /* 大的筛选条件 */,
      searchAssembleSn: "" /* 团单号 */,
      searchGoodsTitle: "" /* 商品名称搜索 */,
      searchTime: [] /* 时间搜索 */,
      startTime: null,
      endTime: null,
      number: {
        allNum: 0 /* 全部 */,
        succeed: 0 /* 拼团成功 */,
        underway: 0 /* 拼团中 */,
        failure: 0 /* 拼团失败 */
      },
      checkList: [],
      groupShopOrder: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    searchTime: {
      /* 筛选分类改变 */
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
          this.selectByKwd();
        } else {
          this.startTime = null;
          this.endTime = null;
          this.selectByKwd();
        }
        /* 搜索 */
      }
    },
    status: {
      /* 改变大的筛选条件 */
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    this.showAll();
  },
  methods: {
    viewGroupShopOrder(rows) {
      this.$router.push({ name: "groupShopping_detail", query: { id: rows.id } });
    },
    /* 清空搜索 */
    clearSearch() {
      this.status = "all";
      this.searchAssembleSn = "";
      this.searchGoodsTitle = "";
      this.searchTime = [];
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchAssembleSn != "" ||
        this.status != undefined ||
        this.searchBrandId != "" ||
        this.categoryOne != ""
      ) {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val, type) {
      getAssembleManagePage({
        pageNo: Number.isInteger(val) ? val : 1,
        pageSize: 20,
        assembleSn: this.searchAssembleSn ? this.searchAssembleSn : null,
        goodsTitle: this.searchGoodsTitle ? this.searchGoodsTitle : null,
        startTime: this.startTime,
        endTime: this.endTime,
        status: this.status == "all" ? null : this.status
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.groupShopOrder = data.data.content.pageInfo.list;
      this.number = {
        allNum: data.data.content.allNum /* 全部 */,
        succeed: data.data.content.succeed /* 拼团成功 */,
        underway: data.data.content.underway /* 拼团中 */,
        failure: data.data.content.failure /* 拼团失败 */
      };
      this.total = data.data.content.pageInfo.total;
      this.cPage = data.data.content.pageInfo.pageNum;
      this.size = data.data.content.pageInfo.pageSize;
    },
    showAll(val) {
      getAssembleManagePage({ pageNo: val ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    }
  },
  components: { paginationCom }
};
</script>

<style lang='less'>
#groupShopping_order {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
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
