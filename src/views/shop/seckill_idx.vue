<template>
  <div id="seckill_idx">
    <!-- 秒杀列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">秒杀活动列表</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="活动名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="seckillList" border row-key="id" height="200" style="width: 100%">
          <el-table-column prop="id" label="ID" align="center" width="80"></el-table-column>
          <el-table-column prop="seckillName" label="活动标题"></el-table-column>
          <!-- 秒杀logo -->

          <el-table-column prop="seckillStart" label="开始时间"></el-table-column>
          <el-table-column prop="seckillEnd" label="结束时间"></el-table-column>
          <el-table-column prop="seckillPrice" label="秒杀价格(元)">
            <template slot-scope="scope">{{"¥"+(scope.row.seckillPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="185">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterSeckill(scope.row)">设置商品</el-button>
                <el-button type="text" size="medium" @click="alterSeckill(scope.row)">编辑</el-button>
                <!-- 一开始没有删除功能 -->
                <el-button type="text" size="medium" disabled>删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
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
// import { getSeckillList } from "../../api/seckill";
export default {
  data() {
    return {
      searchName: "",
      cPage: 1,
      total: 0,
      seckillList: [
        {
          id: "1",
          goodsItemId: "123144536" /* 所属SKU商品ID */,
          seckillStart: "2013-12-12" /* 秒杀开始时间 */,
          seckillEnd: "2013-12-12" /* 秒杀结束时间 */,
          seckillNum: 12 /* 秒杀商品数量 */,
          seckillPrice: 3000 /* 秒杀商品价格到分 */,
          seckillImage: "1231sfws3" /* 秒杀展示图 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "2",
          goodsItemId: "123144536" /* 所属SKU商品ID */,
          seckillStart: "2013-12-12" /* 秒杀开始时间 */,
          seckillEnd: "2013-12-12" /* 秒杀结束时间 */,
          seckillNum: 12 /* 秒杀商品数量 */,
          seckillPrice: 3000 /* 秒杀商品价格到分 */,
          seckillImage: "1231sfws3" /* 秒杀展示图 */,
          isDelete: 0 /* 是否删除 */
        },
        {
          id: "3",
          goodsItemId: "123144536" /* 所属SKU商品ID */,
          seckillStart: "2013-12-12" /* 秒杀开始时间 */,
          seckillEnd: "2013-12-12" /* 秒杀结束时间 */,
          seckillNum: 12 /* 秒杀商品数量 */,
          seckillPrice: 3000 /* 秒杀商品价格到分 */,
          seckillImage: "1231sfws3" /* 秒杀展示图 */,
          isDelete: 0 /* 是否删除 */
        }
      ],
      base: "" /* 图片链接开头 */
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
  },
  methods: {
    addNewSeckill() {
      this.$router.push({ name: "seckill_add" });
      console.log("新增");
    },
    alterSeckill(rows) {
      this.$router.push({ name: "seckill_alter", query: { id: rows.id } });
      console.log("修改");
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      console.log(val);
      //   if (this.searchName != "") {
      //     //执行查询中的分页
      //     this.selectByKwd(val);
      //   } else {
      //     //执行全部中的分页
      //     this.showAll(val);
      //   }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      console.log(val);
      //   getSeckillList({
      //     pageNo: Number.isInteger(val) ? val : 1,
      //     brandName: this.searchName
      //   }).then(data => {
      //     if (data.data.status == 0) {
      //       console.log(data);
      //       this.setView(data);
      //       this.$message({
      //         message: "已执行查询",
      //         type: "success"
      //       });
      //     }
      //   });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      console.log(val);
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      //   getSeckillList({ pageNo: Number.isInteger(val) ? val : 1 }).then(data => {
      //     console.log(data);
      //     if (data.data.status == 0) {
      //       this.setView(data);
      //       // loading.close()
      //     }
      //   });
    },
    /* 渲染表格 */
    setView(data) {
      this.seckillList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
    },
    clearSearch() {
      this.searchName = null;
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

<style lang='less'>
#seckill_idx {
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
      .alterDel {
        width: 100%;
        display: flex;
        justify-content: space-around;
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
