<template>
  <div id="tb_seckill">
    <!-- 涂邦快抢 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">涂邦快抢</span>
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
            <span class="s-size">请输入:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="商品名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <el-button plain @click="addTbSeckill" size="small">添加商品</el-button>
            </div>
          </div>
        </div>
        <el-table :data="tbSeckillList" border row-key="id" style="width: 100%">
          <el-table-column prop="fastBuy.id" label="编号" width="135"></el-table-column>
          <el-table-column prop="fastBuy.name" label="快抢名称"></el-table-column>
          <el-table-column prop="goodsItem.itemTitle" label="快抢商品SKU名称"></el-table-column>
          <el-table-column prop="fastBuy.startTime" align="center" label="开始时间"></el-table-column>
          <el-table-column prop="fastBuy.endTime" align="center" label="结束时间"></el-table-column>
          <el-table-column prop="fastBuy.discountPrice" align="center" label="抢购价">
            <template v-if="scope.row.fastBuy" slot-scope="scope">{{"¥"+(scope.row.fastBuy.discountPrice/100).toFixed(2)}}</template>
          </el-table-column>
          <el-table-column prop="fastBuy.stock" align="center" label="剩余"></el-table-column>
          <el-table-column align="center" label="是否自动上线">
            <template slot-scope="scope">
              <el-switch
                v-if="scope.row.fastBuy"
                v-model="scope.row.fastBuy.isAutoUp"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="changeIsAutoUp(scope.row.fastBuy.id)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterFastBuy(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteFastBuy(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>

        <el-dialog :title="alter?'修改快抢商品':'添加快抢商品'" :visible.sync="fastVisible" @close="closeForm">
          <el-form label-width="120px" :rules="addFormRules" :model="addForm" ref="addForm">
            <el-form-item label="快抢标题" prop="name">
              <el-input v-model="addForm.name"></el-input>
            </el-form-item>
            <el-form-item label="选择sku" v-if="!alter" prop="goodsItemId">
              <div class="searchBar">
                <div class="search_box">
                  <el-select v-model="searchGood" filterable remote value-key="id" :remote-method="selectGood" placeholder="请选择商品(搜索)">
                    <el-option v-for="item in searchGoodList" :key="item.id" :label="item.goodsTitle" :value="item.id"></el-option>
                  </el-select>
                </div>
                <div class="search_box">
                  <el-select v-model="addForm.goodsItemId" placeholder="请选择商品sku" value-key="id" clearable>
                    <el-option v-for="item in goodsItemList" :key="item.id" :label="item.itemTitle" :value="item.id"></el-option>
                  </el-select>
                </div>
              </div>
            </el-form-item>
            <el-form-item label="快抢价格" prop="discountPrice">
              <precision-input :num="addForm.discountPrice" :text="'元'" :type="'price'" @getNum="(value)=>{this.addForm.discountPrice=value}"></precision-input>
            </el-form-item>
            <el-form-item label="快抢库存" prop="stock">
              <el-input v-model.number="addForm.stock"></el-input>
            </el-form-item>
            <el-form-item label="快抢开始时间" prop="startTime">
              <el-date-picker v-model="addForm.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="快抢结束时间" prop="endTime">
              <el-date-picker v-model="addForm.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否自动上线">
              <switch-com :boolen="addForm.isAutoUp" @changeValue="(value)=>{this.addForm.isAutoUp=value}"></switch-com>
            </el-form-item>
            <el-form-item label="快抢大图" prop="image">
              <upload-img
                v-if="showImg"
                @getimgArr="(imgarr)=>{this.addForm.image = imgarr}"
                :imgArr="this.addForm.image"
                :limit="1"
                :notMultiple="true"
              ></upload-img>
            </el-form-item>
            <el-form-item label="快抢小图" prop="head">
              <upload-img
                v-if="showImg"
                @getimgArr="(imgarr)=>{this.addForm.head = imgarr}"
                :imgArr="this.addForm.head"
                :limit="1"
                :notMultiple="true"
              ></upload-img>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="submitform('addForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsList } from "../../api/good";
import {
  getGoodsItem,
  getFastBuyList,
  insertFastBuy,
  updateFastBuy,
  deleteFastBuy,
  updateFastBuyUp
} from "../../api/indexRecommend";
import switchCom from "../../components/switch";
import uploadImg from "../../components/uploadImg";
import precisionInput from "../../components/precisionInput";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      // batchArr: [] /* id 数组 */,
      // batchValue: "" /* 批量操作的类型 */,
      searchName: "" /* 商品名称 */,
      tbSeckillList: [],
      searchGood: "" /* 搜索商品的id */,
      searchGoodList: [] /* 搜索商品的列表 */,
      goodsItemList: [] /* 通过商品id获取的item列表 */,
      selectItem: {} /* 选择的item */,
      showTableData: [] /* 展示的表格数据 */,
      fastVisible: false,
      cPage: 1,
      size: 20,
      total: 0,
      alter: false /* 是否修改快抢 */,
      showImg: true,
      addFormRules: {
        name: [{ required: true, message: "请填写快抢名称" }],
        startTime: [{ required: true, message: "请选择开始时间" }],
        endTime: [{ required: true, message: "请选择结束时间" }],
        discountPrice: [{ required: true, message: "请填写快抢价格" }],
        stock: [{ required: true, message: "请填写快抢数量" }],
        goodsItemId: [{ required: true, message: "请选择参与快抢的sku" }],
        image: [{ required: true, message: "请上传快抢大图" }],
        head: [{ required: true, message: "请上传快抢小图" }]
      },
      addForm: {
        name: "" /* 快抢名称 */,
        startTime: "" /* 快抢开始时间 */,
        endTime: "" /* 快抢结束时间 */,
        discountPrice: null /* 快抢价格 */,
        stock: null /* 剩余 */,
        isAutoUp: 1 /* 是否自动上线 */,
        goodsItemId: "" /* 商品 sku id */,
        image: "" /* 快抢大图 */,
        head: "" /* 快抢小图 */
      }
    };
  },
  mounted() {
    this.showAll();
  },
  watch: {
    searchGood: {
      handler() {
        if (this.searchGood != "") {
          getGoodsItem(this.searchGood).then(data => {
            if (data.data.status == 200) {
              this.goodsItemList = data.data.content;
            }
          });
        }
      }
    }
  },
  methods: {
    addTbSeckill() {
      this.fastVisible = true;
    },
    /* 关闭添加品牌 */
    closeForm() {
      this.alter = false;
      this.fastVisible = false;
      this.addForm = {
        name: "" /* 快抢名称 */,
        startTime: "" /* 快抢开始时间 */,
        endTime: "" /* 快抢结束时间 */,
        discountPrice: null /* 快抢价格 */,
        stock: null /* 剩余 */,
        isAutoUp: true /* 是否自动上线 */,
        goodsItemId: "" /* 商品 sku id */,
        image: "" /* 快抢大图 */,
        head: "" /* 快抢小图 */
      };
      this.refreshImg();
    },
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    /* 提交 */
    submitform(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.alter) {
            updateFastBuy(this.addForm).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.fastVisible = false;
                this.showAll();
              } else {
                this.$message.error("修改失败");
              }
            });
          } else {
            insertFastBuy(this.addForm).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.fastVisible = false;
                this.showAll();
              } else {
                this.$message.error("添加失败");
              }
            });
          }
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    /* 删除快抢活动 */
    deleteFastBuy(row) {
      this.$confirm("此操作将删除该快抢活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteFastBuy(row.fastBuy.id).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.showAll();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 编辑快抢 */
    alterFastBuy(rows) {
      this.alter = true;
      this.addForm = JSON.parse(JSON.stringify(rows.fastBuy));
      this.fastVisible = true;
    },
    /* 设置上线下线 */
    changeIsAutoUp(id) {
      updateFastBuyUp(id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            type: "success",
            message: "修改自动上架成功"
          });
        } else {
          this.$message.error("修改自动上架失败");
          this.showAll();
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchName != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getFastBuyList({
        pageIndex: obj.page ? obj.page : 1,
        pageSize: 20,
        name: this.searchName == "" ? null : this.searchName
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getFastBuyList({ pageIndex: val ? val : 1, pageSize: 20 }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 通过商品名搜索 */
    selectGood(val) {
      if (val != "") {
        getGoodsList({ goodsTitle: val, pageNo: 1 }).then(data => {
          if (data.data.status == 0) {
            this.searchGoodList = data.data.data.data.list;
          }
        });
      }
    },
    /* 渲染表格 */
    setView(data) {
      this.tbSeckillList = data.data.content.result;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageIndex;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.showAll();
    }
  },
  components: { switchCom, uploadImg, paginationCom, precisionInput }
};
</script>

<style lang="less">
#tb_seckill {
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
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
  }
  .el-dialog {
    width: 70%;
    height: 80%;
    overflow-y: scroll;
    margin-top: 11vh !important;
  }
}
</style>
