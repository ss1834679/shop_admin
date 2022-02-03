<template>
  <div id="add_agood">
    <!-- 品牌日商品 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">涂邦品牌日商品列表</span>
        <el-button plain @click="addAGOOD" size="small">选择单品</el-button>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <!-- <div class="search_box">
            <el-select
              v-model="searchBrandDayId"
              filterable
              remote
              value-key="id"
              @change="selectByKwd"
              :remote-method="selectBrandDay"
              placeholder="请选择品牌日(搜索)"
              clearable
            >
              <el-option v-for="item in brandDayList" :key="item.id" :label="item.brandName+item.startTime" :value="item.id"></el-option>
            </el-select>
          </div>-->
          <div class="search_box">
            <el-input placeholder="商品名字搜索" v-model="searchGoodName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <div class="search_box">
            <el-select v-model="searchStatus" @change="selectByKwd" placeholder="推荐状态" clearable>
              <el-option label="推荐中" :value="1"></el-option>
              <el-option label="未推荐" :value="0"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="brandGoodList" v-if="showTable" :expand-row-keys="expanded" border row-key="brandDayGoods.id" @expand-change="rowExpand">
          <el-table-column type="expand">
            <el-table :data="rowData">
              <el-table-column prop="id" label="编号"></el-table-column>
              <el-table-column prop="goodsItemName" label="sku名称"></el-table-column>
              <el-table-column prop="price" label="原价">
                <template slot-scope="scope">{{"¥"+(scope.row.price/100).toFixed(2)}}</template>
              </el-table-column>
              <el-table-column prop="discount" label="折扣"></el-table-column>
              <el-table-column prop="discountPrice" label="折后价">
                <template slot-scope="scope">{{"¥"+(scope.row.discountPrice/100).toFixed(2)}}</template>
              </el-table-column>
            </el-table>
          </el-table-column>
          <el-table-column prop="brandDayGoods.id" label="编号" width="135"></el-table-column>
          <el-table-column prop="goods.goodsTitle" label="商品名称"></el-table-column>
          <el-table-column prop="brandDayGoods.price" align="center" label="原价">
            <template slot-scope="scope">{{"¥"+(scope.row.brandDayGoods.price/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="brandDayGoods.discount" align="center" label="折扣"></el-table-column>
          <el-table-column prop="brandDayGoods.discountPrice" align="center" label="折后价">
            <template slot-scope="scope">{{"¥"+(scope.row.brandDayGoods.discountPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <!-- <el-table-column prop="sort" align="center" label="排序"></el-table-column> -->
          <el-table-column label="是否推荐" align="center">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.brandDayGoods.status" @changeBoolen="changeStatus(scope.row.brandDayGoods.id)"></switch-com>
              <!-- <el-switch v-model="scope.row.brandDayGoods.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch> -->
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterBrandDayGood(scope.row)">编辑</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>

        <el-dialog title="选择单品" :visible.sync="goodVisible" @close="closeForm">
          <el-form label-width="120px" :model="addForm" ref="addForm">
            <el-form-item label="品牌日">
              <!-- <div class="search_box">
                <el-select v-model="addedBrand" filterable remote value-key="id" :remote-method="selectBrandDay" placeholder="请选择品牌日(搜索)" clearable>
                  <el-option v-for="item in brandDayList" :key="item.id" :label="item.brandName+item.startTime" :value="item"></el-option>
                </el-select>
              </div>-->
              <span>{{this.$route.query.brandName}}——{{this.$route.query.startTime}}——{{this.$route.query.endTime}}</span>
            </el-form-item>
            <el-form-item label="选择商品" v-if="!alter">
              <div class="search_box">
                <el-select v-model="addedGood" filterable remote value-key="id" :remote-method="selectGood" placeholder="请选择商品(搜索)" clearable>
                  <el-option v-for="item in brandSeaGoodList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="商品名称" v-if="alter">
              <span>{{alterGoodsName}}</span>
            </el-form-item>
            <el-form-item label="折扣">
              <el-input v-model="addForm.brandDayGoods.discount" placeholder="最多一位小数“如：7.2” 下同"></el-input>
            </el-form-item>
            <el-form-item label="sku折扣">
              <el-table :data="addForm.brandDayItemModelList">
                <el-table-column prop="brandDayItem.goodsItemId" label="编号"></el-table-column>
                <el-table-column prop="brandDayItem.itemTitle" label="sku名称"></el-table-column>
                <el-table-column prop="brandDayItem.price" label="原价">
                  <template slot-scope="scope">{{"¥"+(scope.row.brandDayItem.price/100).toFixed(2)}}</template>
                </el-table-column>
                <el-table-column prop="brandDayItem.discount" label="折扣">
                  <template slot-scope="scope">
                    <el-input @blur="getDiscountPrice(scope.row)" placeholder="最多一位小数“如：7.2”" v-model="scope.row.brandDayItem.discount"></el-input>
                  </template>
                </el-table-column>
                <el-table-column prop="brandDayItem.discountPrice" label="折后价">
                  <template slot-scope="scope">
                    <span v-if="scope.row.brandDayItem.discountPrice">{{"¥"+(scope.row.brandDayItem.discountPrice/100).toFixed(2)}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="submitform()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  insertAGood,
  getBrandDay,
  getGoodsItem,
  getBrandDayGoodsList,
  getBrandDayGoodsItem,
  changeBrandDayGood,
  updateBrandDayGood
} from "../../api/indexRecommend";
import { getGoodsList } from "../../api/good";
import { getBrandList } from "../../api/brand";
import switchCom from "../../components/switch";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      // searchBrandDayId: "" /* 品牌日名称 */,
      brandDayId: "" /* 品牌日id */,
      searchGoodName: "" /* 品牌日中商品名称 */,
      searchStatus: "" /* 推荐状态 */,
      expanded: [] /* 已经展开的列 */,
      rowData: [] /* 展开行中的item信息 */,
      brandGoodList: [] /* 品牌日商品列表 */,
      goodVisible: false,
      showTable: true,
      alter: false,
      alterGoodsName: "" /* 修改的商品名称 */,
      cPage: 1,
      size: 20,
      total: 0,
      addedBrand: {},
      addedGood: {},
      brandDayList: [] /* 品牌日列表 */,
      brandList: [] /* 品牌列表 */,
      brandSeaGoodList: [] /* 品牌日的搜索的商品列表 */,
      goodItemList: [] /* 选择的商品的 item 列表以及数据 */,
      addForm: {
        brandDayGoods: {
          brandDayId: this.$route.query.brandDayId /* 品牌日活动ID */,
          discount: null /* 折扣 */,
          goodsId: "" /* 商品ID */
        },
        brandDayItemModelList: [
          // {
          //   brandDayItem: {
          //     discount: 7,
          //     goodsItemId: "1234765378576449536",
          //     status: 0
          //   }
          // }
        ]
      }
    };
  },
  mounted() {
    this.brandDayId = this.$route.query.brandDayId;
    this.showAll();
  },
  watch: {
    // addedBrand: {
    //   handler() {
    //     /* 表单的品牌日id = 选中的品牌日id */
    //     if (this.addedBrand.id) {
    //       this.addForm.brandDayGoods.brandDayId = this.addedBrand.id;
    //     } else {
    //       this.addForm.brandDayGoods.brandDayId = "";
    //     }
    //     /* 选中的品牌日改变 清空已选择的商品 以获取的商品列表 以获取的item列表 */
    //     this.addedGood = "";
    //     this.brandSeaGoodList = [];
    //     this.goodItemList = [];
    //   }
    // },
    addedGood: {
      handler() {
        if (this.addedGood != "") {
          /* 搜索这个商品id的 item 列表 */
          getGoodsItem(this.addedGood).then(data => {
            if (data.data.status == 200) {
              this.goodItemList = data.data.content;
              this.addForm.brandDayItemModelList = this.goodItemList.map(item => {
                let obj = {};
                let obj2 = {};
                obj2["goodsItemId"] = item.id;
                obj2["itemTitle"] = item.itemTitle;
                obj2["price"] = item.itemPrice;
                obj2["discount"] = null;
                obj2["discountPrice"] = null;
                obj["brandDayItem"] = obj2;
                return obj;
              });
            }
          });
        }
        this.addForm.brandDayGoods.goodsId = this.addedGood;
      }
    },
    "addForm.brandDayGoods.discount": {
      handler() {
        if (
          Number.parseFloat(this.addForm.brandDayGoods.discount) * 10 > 0 &&
          Number.parseFloat(this.addForm.brandDayGoods.discount) * 10 < 100
        ) {
          if (Array.isArray(this.addForm.brandDayItemModelList) && this.addForm.brandDayItemModelList.length > 0) {
            this.addForm.brandDayItemModelList.forEach(item => {
              item.brandDayItem.discount = Number.parseFloat(this.addForm.brandDayGoods.discount);
              this.getDiscountPrice(item);
            });
          }
        } else {
          this.addForm.brandDayGoods.discount = "";
        }
      },
      deep: true
    }
  },
  methods: {
    addAGOOD() {
      this.goodVisible = true;
    },
    /* 关闭添加单品 */
    closeForm() {
      this.goodVisible = false;
      this.addForm = {
        brandDayGoods: {
          brandDayId: this.$route.query.brandDayId /* 品牌日活动ID */,
          discount: null /* 折扣 */,
          goodsId: "" /* 商品ID */
        },
        brandDayItemModelList: []
      };
      this.addedBrand = {};
    },
    getDiscountPrice(row) {
      if (Number.parseFloat(row.brandDayItem.discount)) {
        if (
          Number.parseFloat(row.brandDayItem.discount) * 10 > 0 &&
          Number.parseFloat(row.brandDayItem.discount) * 10 < 100
        ) {
          row.brandDayItem.discountPrice =
            (Number.parseFloat(row.brandDayItem.discount) * 10 * row.brandDayItem.price) / 100;
        } else {
          row.brandDayItem.discount = null;
          row.brandDayItem.discountPrice = 0;
          this.$message.error("请填写0-10之间的一位小数");
        }
      }
    },
    rowExpand(row, expandedRows) {
      /* 获取每行的 item 信息 */
      if (expandedRows.length > 0) {
        getBrandDayGoodsItem(row.brandDayGoods.id).then(data => {
          if (data.data.status == 200) {
            if (Array.isArray(data.data.content) && data.data.content.length > 0) {
              data.data.content.forEach((item, index, arr) => {
                let obj = item.brandDayItem;
                obj["goodsItemName"] = item.goodsItem.itemTitle;
                this.rowData.splice(index, arr.length - index);
                this.$set(this.rowData, index, obj);
              });
            } else {
              this.rowData = [];
            }
          }
        });
        //如果展开行数大于1
        if (expandedRows.length > 1) {
          expandedRows.shift();
        }
        this.expanded = expandedRows.map(item => {
          return item.brandDayGoods.id;
        });
      }
    },
    /* 提交添加 */
    submitform() {
      if (this.alter) {
        updateBrandDayGood(this.addForm).then(data => {
          if (data.data.status == 200) {
            this.goodVisible = false;
            this.$message({
              type: "success",
              message: "修改成功"
            });
            this.showAll();
          } else {
            this.$message.error(data.data.msg);
          }
        });
      } else {
        insertAGood(this.addForm).then(data => {
          if (data.data.status == 200) {
            this.goodVisible = false;
            this.$message({
              type: "success",
              message: "添加成功"
            });
            this.showAll();
          } else {
            this.$message.error(data.data.msg);
          }
        });
      }
    },
    /* 编辑品牌日 */
    alterBrandDayGood(rows) {
      this.addForm = {
        brandDayGoods: {
          discount: rows.brandDayGoods.discount /* 折扣 */,
          id: rows.brandDayGoods.id
        },
        brandDayItemModelList: []
      };
      this.alterGoodsName = rows.goods.goodsTitle;
      this.alter = true;
      this.goodVisible = true;
      getBrandDayGoodsItem(rows.brandDayGoods.id).then(data => {
        if (data.data.status == 200) {
          if (Array.isArray(data.data.content) && data.data.content.length > 0) {
            this.addForm.brandDayItemModelList = data.data.content.map(item => {
              let obj = {};
              let obj2 = {};
              obj2 = item.brandDayItem;
              obj2["itemTitle"] = item.goodsItem.itemTitle;
              obj["brandDayItem"] = obj2;
              return obj;
            });
          }
        }
      });
    },
    /* 设置上线下线 */
    changeStatus(id) {
      changeBrandDayGood(id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            type: "success",
            message: "修改推荐成功"
          });
        } else {
          this.$message.error(data.data.msg);
          this.showAll();
          this.refreshTable();
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchGoodName != "" || this.searchStatus != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getBrandDayGoodsList({
        pageIndex: obj.page ? obj.page : 1,
        brandDayId: this.searchBrandDayId == "" ? null : this.searchBrandDayId,
        goodsName: this.searchGoodName == "" ? null : this.searchGoodName,
        status: this.searchStatus === "" ? null : this.searchStatus
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          this.$message({
            message: "已执行查询",
            type: "success"
          });
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getBrandDayGoodsList({ pageIndex: val ? val : 1, brandDayId: this.brandDayId }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 搜索品牌日列表 */
    selectBrandDay(val) {
      if (val != "") {
        getBrandDay(1, 30, val).then(data => {
          if (data.data.status == 200) {
            this.brandDayList = data.data.content.result;
          }
        });
      }
    },
    /* 搜索品牌 */
    selectBrand(val) {
      if (val != "") {
        getBrandList({
          pageNo: 1,
          brandName: val
        }).then(data => {
          if (data.data.status == 0) {
            this.brandList = data.data.data.list;
          }
        });
      }
    },
    /* 搜索品牌日里的商品 通过商品名搜索 */
    selectGood(val) {
      if (val != "") {
        getGoodsList({ goodsTitle: val, brandId: this.$route.query.brandId, pageNo: 1 }).then(data => {
          if (data.data.status == 0) {
            this.brandSeaGoodList = data.data.data.data.list;
          }
        });
      }
    },
    /* 渲染表格 */
    setView(data) {
      this.brandGoodList = data.data.content.result;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageIndex;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchStatus = "";
      this.searchBrandDayId = "";
      this.searchGoodName = "";
      this.showAll();
    },
    /* 刷新 */
    refreshTable() {
      this.showTable = false;
      this.$nextTick(() => {
        this.showTable = true;
      });
    }
  },
  components: { switchCom, paginationCom }
};
</script>

<style lang="less">
#add_agood {
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
      .el-dialog {
        width: 70%;
        height: 80%;
        overflow-y: scroll;
        margin-top: 11vh !important;
      }
    }
  }
}
</style>
