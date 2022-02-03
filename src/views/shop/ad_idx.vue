<template>
  <div id="return_goods">
    <!-- 轮播图 (广告) 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">广告列表</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="广告名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchPosition" placeholder="广告位置">
              <el-option label="APP首页轮播" value="APP首页轮播"></el-option>
              <el-option label="PC端首页轮播" value="PC端首页轮播"></el-option>
              <el-option label="PC端分类广告" value="PC端分类广告"></el-option>
            </el-select>
          </div>
          <!-- 到期时间 -->
          <!-- <div class="search_box">
            <el-date-picker v-model="searchDate" type="date" @change="selectByKwd" value-format="yyyy-MM-dd" placeholder="申请时间"></el-date-picker>
          </div>-->
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="adList" border row-key="id" height="200" style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
          <el-table-column prop="sn" label="编号" width="135">
            <!-- <template slot-scope="scope">{{scope.row.orderItem.id}}</template> -->
          </el-table-column>
          <el-table-column prop="adName" label="广告名称"></el-table-column>
          <el-table-column align="center" label="广告位置" width="135">
            <template slot-scope="scope">
              <span v-if="scope.row.position == 'APP首页轮播'">APP首页轮播</span>
              <span v-if="scope.row.position == 'PC端首页轮播'">PC端首页轮播</span>
              <span v-if="scope.row.position == 'PC端分类广告'">PC端分类广告</span>
            </template>
          </el-table-column>
          <el-table-column prop="img" align="center" label="广告图片" width="160">
            <template slot-scope="scope" v-if="scope.row.img">
              <el-image :src="base+scope.row.img" style=" height: 40px" :preview-src-list="(base+scope.row.img).split(',')"></el-image>
            </template>
          </el-table-column>
          <el-table-column label="时间">
            <template slot-scope="scope">
              <div>
                <span>{{"开始时间："+scope.row.startTime}}</span>
              </div>
              <div>
                <span>{{"结束时间："+scope.row.endTime}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="上线/下线" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isOnline" @change="changeIsOnline($event,scope.row)" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="clickTimes" label="点击次数"></el-table-column>
          <el-table-column prop="orderTimes" label="生成订单"></el-table-column>
          <el-table-column label="操作" align="center" width="100">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterAd(scope.row)">编辑</el-button>
                <!-- 一开始没有删除功能 -->
                <el-button type="text" size="medium" disabled>删除</el-button>
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
    </el-card>
  </div>
</template>

<script>
// import { getOrderList } from "../../api/order";
export default {
  data() {
    return {
      base: "",
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchName: null /* 服务单id 搜索 */,
      searchPosition: null /* 广告位置 搜索 */,
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
      adList: [
        {
          sn: "1217292128019832834" /* 服务单号 id */,
          adName: "ggm" /* 广告名 */,
          position: "APP首页轮播" /* 广告位置 */,
          img: "5e12ecf9a1a09a0baeb14607" /* 广告图片 */,
          startTime: "2020-01-06 15:11:12" /* 开始时间 */,
          endTime: "2020-01-06 15:11:12" /* 结束时间 */,
          isOnline: true /* 上线 / 下线 */,
          clickTimes: 1234 /* 点击次数 */,
          orderTimes: 23 /* 生成订单 */
        }
      ],
      total: 100 /* 分页总数 */,
      cPage: 1 /* 当前页码 */
    };
  },
  watch: {
    searchPosition: {
      handler() {
        this.selectByKwd();
      }
    }
  },
  mounted() {
    this.base = this.$store.state.base_url;
    // this.showAll();
  },
  methods: {
    addNewOrder() {},
    alterAd(rows) {
      this.$router.push({ name: "ad_alter", query: { id: rows.sn } });
    },
    changeIsOnline(value,rows) {
      console.log(value);
      console.log(rows);
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
      console.log(this.searchName);
      console.log(this.searchPosition);
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
      this.searchName = null;
      this.searchPosition = null;
      this.searchDate = null;
      console.log(this.searchName);
      console.log(this.searchPosition);
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
      .alterDel {
        width: 100%;
        display: flex;
        justify-content: space-around;
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
