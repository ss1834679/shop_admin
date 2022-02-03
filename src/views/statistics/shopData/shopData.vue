<template>
  <div id="shopData">
    <!-- 店铺数据展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">店铺数据</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="showAll()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>店铺名称：</span>
            <el-input placeholder="店铺名称" v-model="searchName" @keydown.native.enter="showAll"></el-input>
          </div>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <el-dropdown @command="handleExport">
                <el-button size="small">
                  数据导出
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="all">全部数据</el-dropdown-item>
                  <el-dropdown-item command="search" :disabled="isSearch">筛选数据</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
            <div class="box-r">
              <el-dropdown @command="(val)=>{searchSort=val}">
                <el-button size="small">
                  排序方式
                  <i class="el-icon-arrow-down el-icon--right"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="2">按订单量</el-dropdown-item>
                  <el-dropdown-item command="1">按成交额</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <el-table :data="shopDataLsit" border style="width: 100%">
          <el-table-column label="编号" width="80px" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="id" label="供应商ID"></el-table-column>
          <el-table-column prop="supplierName" label="店铺名称" width="180"></el-table-column>
          <el-table-column align="center" prop="accessNumber" label="访问数"></el-table-column>
          <el-table-column align="center" prop="accessUserNumber" label="访问用户数"></el-table-column>
          <el-table-column align="center" prop="purchasedUser" label="下单用户数"></el-table-column>
          <el-table-column align="center" prop="orderNumRank" label="订单量排名"></el-table-column>
          <el-table-column align="center" prop="orderNum" label="订单总量"></el-table-column>
          <el-table-column align="center" prop="orderProportion" label="订单占比">
            <template slot-scope="scope">{{scope.row.orderProportion}}%</template>
          </el-table-column>
          <el-table-column align="center" prop="tradingVolumeRank" label="成交额排名"></el-table-column>
          <el-table-column align="center" prop="tradingVolume" label="成交总额">
            <template slot-scope="scope">{{"¥"+scope.row.tradingVolume}}</template>
          </el-table-column>
          <el-table-column align="center" prop="tradingVolumeProportion" label="成交额占比">
            <template slot-scope="scope">{{scope.row.tradingVolumeProportion}}%</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="getView(scope.row)">查看详情</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com
            :total="total"
            :size.sync="size"
            :cPage="cPage"
            :isChangeSize="true"
            @changeSizes="showAll"
            @getJump="(val)=>{showAll({ page: val })}"
          ></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getShopStatisticsList, exportShopExcel } from "../../../api/statistics";
import paginationCom from "../../../components/paginationCom";
export default {
  components: { paginationCom },
  data() {
    return {
      searchName: "" /* 店铺名称 */,
      searchSort: null /* 搜索排序 */,
      disabled: true,
      shopDataLsit: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  computed: {
    isSearch() {
      let boolean = true;
      if (this.searchName != "" || this.searchSort != null) {
        boolean = false;
      }
      return boolean;
    }
  },
  watch: {
    searchSort: {
      handler() {
        this.showAll();
      }
    }
  },
  methods: {
    handleExport(key) {
      if (key == "all") {
        exportShopExcel({}).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}店铺数据导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      } else if (key == "search") {
        exportShopExcel({
          sort: this.searchSort ? Number.parseInt(this.searchSort) : null,
          supplierName: this.searchName == "" ? null : this.searchName
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}店铺数据导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
    },
    getView(rows) {
      this.$router.push({ name: "shopDataView", query: { id: rows.id } });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.searchSort = null;
      this.showAll();
    },
    /* 渲染表格 */
    setView(data) {
      this.shopDataLsit = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(obj = {}) {
      getShopStatisticsList({
        pageNum: obj.page ? obj.page : 1,
        pageSize: this.size,
        sort: this.searchSort ? Number.parseInt(this.searchSort) : null,
        supplierName: this.searchName == "" ? null : this.searchName
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#shopData {
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