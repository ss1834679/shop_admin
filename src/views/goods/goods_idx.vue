<template>
  <div id="goods_idx">
    <!-- 商品列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">商品列表</span>
        <el-button @click="addNewGoods" size="small" plain>添加商品</el-button>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <i class="el-icon-search" style="font-size:18px;margin-right:5px"></i>
            <span>筛选查询:</span>
          </div>
          <div>
            <el-button type="text" @click="clearSearch">清空搜索</el-button>
            <el-button size="small" @click="selectByKwd()">查询结果</el-button>
          </div>
        </div>
        <div class="search">
          <div class="search_box">
            <span>商品名称：</span>
            <el-input placeholder="请输入名称" v-model="searchInput" @keydown.native.enter="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <span>商品分类：</span>
            <el-cascader ref="categoryList" v-model="searchCateId" :props="props" :options="categoryList" :show-all-levels="false" clearable></el-cascader>
          </div>
          <div class="search_box">
            <span>所属品牌：</span>
            <el-select v-model="searchBrandId" @change="selectByKwd" filterable placeholder="请选择品牌(可搜索)" clearable>
              <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_box">
            <span>添加时间：</span>
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </div>
          <div class="search_box">
            <span>价格筛选：</span>
            <precision-input :num="startPrice" placeholder="元" :type="'price'" @getNum="(value)=>{this.startPrice=value}"></precision-input>-
            <precision-input :num="endPrice" placeholder="元" :type="'price'" @getNum="(value)=>{this.endPrice=value}"></precision-input>
          </div>
          <div class="search_box">
            <span>是否分销：</span>
            <el-select v-model="searchIsRetailStore" @change="selectByKwd">
              <el-option label="全部" value="all"></el-option>
              <el-option label="是" :value="1"></el-option>
              <el-option label="否" :value="0"></el-option>
            </el-select>
          </div>
        </div>
        <div class="status">
          <el-tabs v-model="status" type="card">
            <el-tab-pane :label="'全部商品('+number.totalNum+')'" name="all"></el-tab-pane>
            <el-tab-pane :label="'已上架('+number.upNum+')'" name="1"></el-tab-pane>
            <el-tab-pane :label="'未上架('+number.lowerNum+')'" name="0"></el-tab-pane>
            <el-tab-pane :label="'待审核('+number.waitNum+')'" name="2"></el-tab-pane>
            <el-tab-pane :label="'未通过('+number.disNum+')'" name="-1"></el-tab-pane>
          </el-tabs>
        </div>
        <el-table :data="goodsList" border style="width: 100%">
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="goodsImage" align="center" label="商品图片" width="80">
            <template slot-scope="scope" v-if="scope.row.goodsImage">
              <Thumbnail :image="scope.row.goodsImage" />
            </template>
          </el-table-column>
          <el-table-column prop="goodsTitle" label="名称" width="280"></el-table-column>
          <el-table-column label="价格(元)" width="100">
            <template slot-scope="scope">{{"¥"+(scope.row.goodsPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="saleNum" label="销量"></el-table-column>
          <el-table-column prop="goodsWeight" label="权重"></el-table-column>
          <el-table-column prop="isRetailStore" label="是否分销" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.isRetailStore">是</span>
              <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="审核状态">
            <template slot-scope="scope">
              <div>
                <span v-if="scope.row.goodsStatus==2">待审核</span>
                <span v-if="scope.row.goodsStatus==-1">未通过</span>
                <span v-if="scope.row.goodsStatus==0">已下架</span>
                <span v-if="scope.row.goodsStatus==1">已审核</span>
              </div>
              <el-button type="text" @click="checkDetails(scope.row)">审核详情</el-button>
            </template>
          </el-table-column>
          <el-table-column align="center" label="上架状态" v-if="showSwitch" width="110">
            <template slot-scope="scope">
              <switch-com
                :boolen="scope.row.goodsStatus"
                activeText="上架中"
                inactiveText="下架中"
                type="good"
                @changeBoolen="handleChangeStatus($event,scope.row.id)"
              ></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="viewGood(scope.row)">查看</el-button>
                <el-button type="text" @click="alterGoods(scope.row)">编辑</el-button>
              </el-button-group>
              <el-button-group class="alterDel">
                <el-button type="text" @click="deleteGoods(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        <el-dialog title="审核详情" :visible.sync="checkVisible" @close="closeCheck">
          <el-table :data="checkList" border style="width: 100%">
            <el-table-column prop="createTime" align="center" label="审核时间"></el-table-column>
            <el-table-column prop="operator" align="center" label="审核人员"></el-table-column>
            <el-table-column prop="resultType" align="center" label="审核结果">
              <template slot-scope="scope">
                <span v-if="scope.row.resultType==1">审核通过</span>
                <span v-if="scope.row.resultType==0">未通过</span>
              </template>
            </el-table-column>
            <el-table-column prop="message" align="center" label="反馈详情"></el-table-column>
          </el-table>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, getVerify, deleteGoods, updateGoodDown, updateGoodUp } from "../../api/good";
import { getCategory } from "../../api/category";
import { getBrandList } from "../../api/brand";
import paginationCom from "../../components/paginationCom";
import Thumbnail from "../../components/thumbnail";
import switchCom from "../../components/switch";
import precisionInput from "../../components/precisionInput";
export default {
  data() {
    return {
      status: "all" /* 大的筛选条件 */,
      searchInput: "" /* 名称 / 货号 */,
      searchBrandId: "" /* 品牌搜索id */,
      searchCateId: [] /* 分类搜索id */,
      searchIsRetailStore: "all" /* 是否分销搜索 */,
      searchTime: [],
      startTime: null,
      endTime: null,
      startPrice: undefined,
      endPrice: undefined,
      showSwitch: true,
      checkVisible: false,
      categoryOne: "",
      categoryTwo: "",
      categoryThree: "",
      number: {
        totalNum: 0 /* 全部 */,
        upNum: 0 /* 已上架 */,
        lowerNum: 0 /* 未上架 */,
        waitNum: 0 /* 待审核 */,
        disNum: 0 /* 未通过 */
      },
      checkList: [],
      goodsList: [],
      brandList: [] /* 获取的品牌列表 */,
      categoryList: [] /* 获取的分类列表 */,
      props: {
        value: "id",
        label: "categoryName",
        checkStrictly: true /* 子父不关联 */,
        children: "childList"
      } /* 级联选择配置 */,
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  watch: {
    searchCateId: {
      /* 筛选分类改变 */
      handler() {
        this.categoryOne = this.searchCateId[0] == undefined ? "" : this.searchCateId[0];
        this.categoryTwo = this.searchCateId[1] == undefined ? "" : this.searchCateId[1];
        this.categoryThree = this.searchCateId[2] == undefined ? "" : this.searchCateId[2];
        this.selectByKwd();
      }
    },
    status: {
      /* 改变大的筛选条件 */
      handler() {
        this.selectByKwd();
      }
    },
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.startTime = this.searchTime[0];
          this.endTime = this.searchTime[1];
        } else {
          this.startTime = null;
          this.endTime = null;
        }
      }
    }
  },
  mounted() {
    if (this.$route.query.status != undefined) {
      this.status = this.$route.query.status == undefined ? "all" : this.$route.query.status;
    } else {
      this.showAll();
    }
    /* 初始化品牌搜索列表 */
    getBrandList({ pageNo: 1, pageSize: 9999 }).then(data => {
      if (data.data.status == 0) {
        this.brandList = data.data.data.list;
      }
    });
    /* 初始化级联列表 */
    getCategory().then(data => {
      if (data.data.status == 0) {
        this.categoryList = data.data.data;
      }
    });
  },
  methods: {
    addNewGoods() {
      this.$router.push({ name: "goods_add" });
    },
    alterGoods(rows) {
      this.$router.push({ name: "goods_alter", query: { id: rows.id } });
    },
    viewGood(rows) {
      let routeUrl = this.$router.resolve({ name: "goods_view", query: { id: rows.id, type: "newtag" } });
      window.open(routeUrl.href, "_blank");
    },
    /* 打开审核详情 */
    checkDetails(row) {
      /* 获取审核信息 */
      getVerify({ id: row.id }).then(data => {
        this.checkList = data.data.data;
      });
      this.checkVisible = true;
    },
    /* 关闭审核详情 */
    closeCheck() {
      this.checkList = [];
    },
    /* 删除商品 */
    deleteGoods(rows) {
      this.$confirm("此操作将删除该商品, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGoods({ idStr: rows.id }).then(data => {
            if (data.data.status == 0) {
              this.selectByKwd(this.cPage, "delete");
              this.$message({
                message: "删除商品成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "删除商品失败",
                type: "error"
              });
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    /* 清空搜索 */
    clearSearch() {
      this.categoryOne = "";
      this.categoryTwo = "";
      this.categoryThree = "";
      this.searchBrandId = "";
      this.status = "all";
      this.searchInput = "";
      this.searchTime = [];
      this.startTime = null;
      this.endTime = null;
      this.startPrice = undefined;
      this.endPrice = undefined;
      this.searchIsRetailStore = "all";
      this.selectByKwd();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (
        this.searchInput != "" ||
        this.status != "all" ||
        this.searchBrandId != "" ||
        this.categoryOne != "" ||
        this.startTime != null ||
        this.startPrice != undefined
      ) {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val = {}, type) {
      if (this.startPrice == "" || this.startPrice == undefined) {
        this.startPrice = 0;
      }
      getGoodsList({
        pageNo: val.page ? val.page : 1,
        categoryOne: this.categoryOne == "" ? null : this.categoryOne,
        categoryTwo: this.categoryTwo == "" ? null : this.categoryTwo,
        categoryThree: this.categoryThree == "" ? null : this.categoryThree,
        brandId: this.searchBrandId == "" ? null : this.searchBrandId,
        goodsStatus: this.status == "all" ? null : Number(this.status),
        goodsTitle: this.searchInput == "" ? null : this.searchInput,
        startTime: this.startTime,
        endTime: this.endTime,
        startPrice: this.startPrice && this.endPrice ? this.startPrice : null,
        endPrice: this.startPrice && this.endPrice ? this.endPrice : null,
        isRetailStore: this.searchIsRetailStore == "all" ? null : this.searchIsRetailStore
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          !type && this.$message({ message: "已执行查询", type: "success" });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.goodsList = data.data.data.data.list;
      this.number = data.data.data.goodsNum;
      this.total = data.data.data.data.total;
      this.cPage = data.data.data.data.pageNum;
      this.size = data.data.data.data.pageSize;
      this.refreshTable();
    },
    /* 刷新 */
    refreshTable() {
      this.showSwitch = false;
      this.$nextTick(() => {
        this.showSwitch = true;
      });
    },
    showAll(val) {
      getGoodsList({ pageNo: Number.isInteger(val) ? val : 1 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 上下架 */
    handleChangeStatus(event, id) {
      if (event) {
        updateGoodUp(id).then(data => {
          if (data.data.status == 200) {
            this.$message({ type: "success", message: "上架成功" });
          } else {
            this.$message.error("上架失败");
            this.selectByKwd("", "update");
          }
        });
      } else {
        updateGoodDown(id).then(data => {
          if (data.data.status == 200) {
            this.$message({ type: "success", message: "下架成功" });
          } else {
            this.$message.error("下架失败");
            this.selectByKwd("", "update");
          }
        });
      }
    }
  },
  components: { paginationCom, switchCom, precisionInput, Thumbnail }
};
</script>

<style lang='less'>
#goods_idx {
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
