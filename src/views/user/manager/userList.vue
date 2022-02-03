<template>
  <div id="userList">
    <!-- 用户列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">用户列表</span>
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
            <span>用户昵称：</span>
            <el-input placeholder="请输入用户昵称" v-model="searchNick" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>联系电话：</span>
            <el-input placeholder="联系电话" v-model="searchPhone" @keydown.native.enter="showAll"></el-input>
          </div>
          <div class="search_box">
            <span>订单数量：</span>
            <el-input-number placeholder="最少" :controls="false" :min="0" v-model="searchOrderMin"></el-input-number>-
            <el-input-number placeholder="最多" :controls="false" :max="1000000" v-model="searchOrderMax"></el-input-number>
          </div>
          <div class="search_box">
            <span>消费金额：</span>
            <el-input-number v-model="searchPriceMin" :precision="2" placeholder="最低" :controls="false" :min="0"></el-input-number>-
            <el-input-number v-model="searchPriceMax" :precision="2" placeholder="最高" :controls="false" :min="0"></el-input-number>
          </div>
          <div class="search_box">
            <span>注册时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
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
                  <el-dropdown-item command="1">按消费额</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </div>
          </div>
        </div>
        <el-table :data="goodsDataLsit" border style="width: 100%">
          <el-table-column label="编号" width="80px" align="center">
            <template slot-scope="scope">{{total-(cPage-1)*size-scope.$index}}</template>
          </el-table-column>
          <el-table-column prop="id" label="用户ID"></el-table-column>
          <el-table-column prop="avatar" align="center" label="用户头像" width="80">
            <template slot-scope="scope" v-if="scope.row.avatar">
              <Thumbnail :image="scope.row.avatar" />
            </template>
          </el-table-column>
          <el-table-column align="center" prop="title" label="用户" width="180">
            <template slot-scope="scope">
              <p>{{scope.row.nickname}}</p>
              <span>{{scope.row.phone}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="source" label="来源">
            <template slot-scope="scope">
              <span v-if="scope.row.source==1">小程序</span>
              <span v-if="scope.row.source==2">安卓</span>
              <span v-if="scope.row.source==3">ios</span>
              <span v-if="scope.row.source==4">PC端</span>
              <span v-if="scope.row.source==5">其他</span>
            </template>
          </el-table-column>
          <el-table-column prop="gender" label="性别">
            <template slot-scope="scope">
              <span v-if="scope.row.gender==1">男</span>
              <span v-if="scope.row.gender==2">女</span>
              <span v-if="scope.row.gender==3">保密</span>
            </template>
          </el-table-column>
          <el-table-column prop="birthday" label="生日"></el-table-column>
          <el-table-column prop="createTime" label="注册时间"></el-table-column>
          <el-table-column prop="orderNumber" label="订单量排名"></el-table-column>
          <el-table-column prop="paidCount" label="订单数量"></el-table-column>
          <el-table-column prop="serialNumber" label="消费额排名"></el-table-column>
          <el-table-column prop="paidSum" label="消费金额">
            <template slot-scope="scope">{{"¥"+scope.row.paidSum}}</template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="getMore(scope.row)">更多</el-button>
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
import { getUserStatisticsList, exportUserExcel } from "../../../api/user";
import Thumbnail from "../../../components/thumbnail";
import paginationCom from "../../../components/paginationCom";
export default {
  components: { paginationCom, Thumbnail },
  data() {
    return {
      searchNick: "" /* 用户昵称 */,
      searchPhone: "" /* 联系电话 */,
      searchOrderMin: undefined /* 订单数量最少 */,
      searchOrderMax: undefined /* 订单数量最多 */,
      searchPriceMin: undefined /* 消费金额最低 */,
      searchPriceMax: undefined /* 消费金额最高 */,
      searchTime: [],
      startTime: undefined /* 注册时间 */,
      endTime: undefined /* 注册时间 */,
      searchSort: null /* 搜索排序 1 订单量 2 消费额 */,
      disabled: true,
      goodsDataLsit: [],
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
      if (
        this.searchNick != "" ||
        this.searchPhone != "" ||
        this.searchSort != null ||
        this.searchOrderMin != undefined ||
        this.searchOrderMax != undefined ||
        this.searchPriceMin != undefined ||
        this.searchPriceMax != undefined ||
        this.startTime
      ) {
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
    },
    searchTime: {
      handler() {
        if (this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = undefined;
          this.endTime = undefined;
        }
      }
    }
  },
  methods: {
    handleExport(key) {
      if (key == "all") {
        exportUserExcel({}).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}用户数据导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      } else if (key == "search") {
        exportUserExcel({
          nickname: this.searchNick == "" ? undefined : this.searchNick,
          phone: this.searchPhone == "" ? undefined : this.searchPhone,
          endNum: this.searchOrderMax,
          startNum: this.searchOrderMin,
          endPrice: this.searchPriceMax,
          startPrice: this.searchPriceMin,
          startTime: this.startTime,
          endTime: this.endTime,
          sort: this.searchSort == null ? "1" : this.searchSort
        }).then(data => {
          const BLOB = data.data;
          const fileReader = new FileReader();
          fileReader.readAsDataURL(BLOB);
          fileReader.onload = event => {
            let a = document.createElement("a");
            let date = new Date().toLocaleDateString();
            a.download = `${date}用户数据导出.xls`;
            a.href = event.target.result;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          };
        });
      }
    },
    getMore(rows) {
      this.$router.push({ name: "userDetails", query: { row: JSON.stringify(rows) } });
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchSort = null;
      this.searchNick = "";
      this.searchPhone = "";
      this.searchOrderMin = undefined;
      this.searchOrderMax = undefined;
      this.searchPriceMin = undefined;
      this.searchPriceMax = undefined;
      this.searchTime = [];
      this.startTime = undefined;
      this.endTime = undefined;
      this.showAll();
    },
    /* 渲染表格 */
    setView(data) {
      this.goodsDataLsit = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    showAll(obj = {}) {
      getUserStatisticsList({
        pageNum: obj.page ? obj.page : 1,
        pageSize: this.size,
        nickname: this.searchNick == "" ? undefined : this.searchNick,
        phone: this.searchPhone == "" ? undefined : this.searchPhone,
        endNum: this.searchOrderMax,
        startNum: this.searchOrderMin,
        endPrice: this.searchPriceMax,
        startPrice: this.searchPriceMin,
        startTime: this.startTime,
        endTime: this.endTime,
        sort: this.searchSort == null ? "1" : this.searchSort
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
#userList {
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
      .search {
        .search_box {
          .el-input-number {
            width: 110px;
          }
        }
      }
    }
  }
}
</style>