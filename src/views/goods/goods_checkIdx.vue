<template>
  <div id="goods_checkIdx">
    <!-- 商品列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">商品审核</span>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入名称" v-model="searchInput" @keydown.native.enter="selectByKwd" @blur="selectByKwd"></el-input>
          </div>
          <div class="search_box">
            <el-cascader
              ref="categoryList"
              placeholder="请选择分类"
              v-model="searchCateId"
              :props="props"
              :options="categoryList"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </div>
          <div class="search_box">
            <el-select v-model="searchBrandId" @change="selectByKwd" filterable placeholder="请选择品牌(可搜索)" clearable>
              <!-- 后台获取 -->
              <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item.id"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="goodsList" border style="width: 100%" @selection-change="getSelection">
          <el-table-column type="selection" align="center" width="70"></el-table-column>
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
          <el-table-column prop="goodsWeight" label="排序"></el-table-column>
          <el-table-column prop="goodsStatus" align="center" label="商品状态">
            <template slot-scope="scope">
              <span v-if="scope.row.goodsStatus==2">未审核</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="155">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="viewGood(scope.row)">查看</el-button>
                <el-button type="text" @click="checkGood(scope.row)">审核</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        <el-dialog title="商品审核" :visible.sync="checkVisible">
          <el-form ref="checkform" label-width="80px">
            <el-form-item label="商品名称:">
              <span>{{checkName}}</span>
            </el-form-item>
            <el-form-item label="商品审核:">
              <el-radio-group v-model="checkForm.status">
                <el-radio :label="1">审核通过</el-radio>
                <el-radio :label="-1">审核不通过</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="反馈详情:">
              <el-input type="textarea" v-model="checkForm.message"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="handleCheck({type:'cancel'})">取 消</el-button>
            <el-button type="primary" @click="handleCheck({type:'confirm'})">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList, verifyGood } from "../../api/good";
import { getCategory } from "../../api/category";
import { getBrandList } from "../../api/brand";
import Thumbnail from "../../components/thumbnail";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      searchInput: "" /* 名称 / 货号 */,
      searchBrandId: "" /* 品牌搜索id */,
      searchCateId: [] /* 分类搜索id */,
      categoryOne: "",
      categoryTwo: "",
      categoryThree: "",
      goodsList: [],
      brandList: [] /* 获取的品牌列表 */,
      categoryList: [] /* 获取的分类列表 */,
      checkForm: {
        ids: "" /* 审核的id */,
        status: null /* 审核是否通过 1为通过 -1为未通过 */,
        message: "" /* 未通过的备注 */
      } /* 审核表单 */,
      checkName: "" /* 审核的商品名称 */,
      checkVisible: false,
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
    }
  },
  mounted() {
    this.showAll();
    /* 初始化品牌搜索列表 */
    getBrandList({ pageNo: 1, pageSize: 300 }).then(data => {
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
    /**
     * 查看商品
     */
    viewGood(rows) {
      let routeUrl = this.$router.resolve({ name: "goods_check_view", query: { id: rows.id, type: "newtag" } });
      window.open(routeUrl.href, "_blank");
    },
    checkGood(row) {
      this.checkName = row.goodsTitle;
      this.checkForm.ids = row.id;
      this.checkVisible = true;
    },
    handleCheck(obj) {
      if (obj.type == "cancel") {
        this.checkForm = {
          ids: "",
          status: null,
          message: ""
        };
        this.checkVisible = false;
      } else if (obj.type == "confirm") {
        /* 接口 */
        if (this.checkForm.status == 1) {
          if (this.checkForm.message == "") {
            this.checkForm.message = "审核通过";
          }
          this.verify();
        } else if (this.checkForm.status == "-1") {
          if (this.checkForm.message == "") {
            this.$message.error("请填写未通过理由！");
          } else {
            this.verify();
          }
        }
      }
    },
    verify() {
      verifyGood(this.checkForm).then(data => {
        if (data.data.status == 0) {
          this.selectByKwd();
          this.$message({
            message: "审核成功",
            type: "success"
          });
        } else {
          this.$message.error("审核失败");
        }
        this.checkVisible = false;
        this.checkForm = {
          ids: "",
          status: null,
          message: ""
        };
      });
    },
    /* 批量操作 */
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
    /* 清空搜索 */
    clearSearch() {
      this.categoryOne = "";
      this.categoryTwo = "";
      this.categoryThree = "";
      this.searchBrandId = "";
      this.searchInput = "";
      this.selectByKwd();
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchInput != "" || this.searchBrandId != "" || this.categoryOne != "") {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getGoodsList({
        pageNo: Number.isInteger(val) ? val : 1,
        categoryOne: this.categoryOne == "" ? null : this.categoryOne,
        categoryTwo: this.categoryTwo == "" ? null : this.categoryTwo,
        categoryThree: this.categoryThree == "" ? null : this.categoryThree,
        brandId: this.searchBrandId == "" ? null : this.searchBrandId,
        goodsTitle: this.searchInput == "" ? null : this.searchInput,
        goodsStatus: 2
      }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
          this.$message({
            message: "已执行查询",
            type: "success"
          });
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.goodsList = data.data.data.data.list;
      this.total = data.data.data.data.total;
      this.cPage = data.data.data.data.pageNum;
      this.size = data.data.data.data.pageSize;
    },
    /*  */
    showAll(val) {
      getGoodsList({ pageNo: Number.isInteger(val) ? val : 1, goodsStatus: 2 })
        .then(data => {
          if (data.data.status == 0) {
            this.setView(data);
          }
        })
        .catch(error => {
          this.$message({
            type: "error",
            message: `${error}`,
            center: true
          });
        });
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang='less'>
#goods_checkIdx {
  width: 100%;
  height: auto;

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
    }
  }
}
</style>
