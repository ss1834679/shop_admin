<template>
  <div id="brand_day">
    <!-- 品牌日 列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">涂邦品牌日</span>
        <div class="btn">
          <el-button plain @click="addBrandDay" size="small">选择品牌</el-button>
        </div>
      </div>
      <div class="content">
        <div class="search">
          <div class="search_box">
            <span>筛选查询:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="品牌名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="brandDayList" border row-key="id" style="width: 100%">
          <el-table-column prop="id" label="编号" width="135"></el-table-column>
          <el-table-column prop="brandName" label="品牌名称"></el-table-column>
          <el-table-column prop="startTime" align="center" label="开始时间"></el-table-column>
          <el-table-column prop="endTime" align="center" label="结束时间"></el-table-column>
          <el-table-column label="是否上线" align="center" width="100">
            <template slot-scope="scope">
              <el-switch v-model="scope.row.isRecommend" active-color="#13ce66" inactive-color="#ff4949" @change="changeIsRecommend(scope.row.id)"></el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterBrandDay(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="viewBrandDayGood(scope.row)">查看单品</el-button>
                <el-button type="text" size="medium" @click="deleteBrandDay(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>

        <el-dialog :title="alter?'修改品牌活动':'选择品牌'" :visible.sync="brandVisible" @close="closeForm">
          <el-form label-width="120px" :model="addForm" ref="addForm">
            <el-form-item label="选择品牌" v-if="!alter" prop="brandId">
              <div class="search_box">
                <el-select v-model="added" filterable remote value-key="id" :remote-method="selectBrand" placeholder="请选择品牌(可搜索)" clearable>
                  <el-option v-for="item in brandList" :key="item.id" :label="item.brandName" :value="item"></el-option>
                </el-select>
              </div>
            </el-form-item>
            <el-form-item label="品牌名" v-else>{{addForm.brandDay.brandName}}</el-form-item>
            <el-form-item label="折扣" v-if="!alter">
              <el-input v-model="addForm.discount"></el-input>
            </el-form-item>
            <el-form-item label="开始时间">
              <el-date-picker v-model="addForm.brandDay.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间">
              <el-date-picker v-model="addForm.brandDay.endTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"></el-date-picker>
            </el-form-item>
            <el-form-item label="是否上线" v-if="!alter" required>
              <el-switch v-model="addForm.brandDay.isRecommend" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </el-form-item>
            <el-form-item label="添加所有商品" required v-if="!alter">
              <el-switch v-model="addForm.isAll" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
import { getBrandList } from "../../api/brand";
import {
  getBrandDay,
  alterBrandDayRecommend,
  deleteBrandDay,
  insertBrandDay,
  updateBrandDay
} from "../../api/indexRecommend";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      searchName: null /* 品牌日名称 */,
      brandDayList: [],
      brandVisible: false,
      cPage: 1,
      size: 20,
      total: 0,
      added: {},
      alter: false /* 是否修改品牌活动 时间 等  */,
      brandList: [] /* 品牌列表 */,
      addForm: {
        brandDay: {
          brandName: "" /* 品牌名称 */,
          brandId: "" /* 品牌id */,
          startTime: "" /* 开始时间 */,
          endTime: "" /* 结束时间 */,
          status: 1 /* 是否上线 1 上线 0 下线 */
        },
        discount: "" /* 折扣 */,
        isAll: 0 /* 是否添加所有商品 */
      }
    };
  },
  mounted() {
    this.showAll();
  },
  watch: {
    added: {
      handler() {
        if (this.added.id) {
          this.addForm.brandDay.brandId = this.added.id;
          this.addForm.brandDay.brandName = this.added.brandName;
        } else {
          this.addForm.brandDay.brandId = "";
          this.addForm.brandDay.brandName = "";
        }
      }
    }
  },
  methods: {
    addBrandDay() {
      this.brandVisible = true;
    },
    viewBrandDayGood(row) {
      this.$router.push({
        name: "addAGood",
        query: {
          brandDayId: row.id,
          startTime: row.startTime,
          endTime: row.endTime,
          brandName: row.brandName,
          brandId: row.brandId
        }
      });
    },
    /* 关闭添加品牌 */
    closeForm() {
      this.alter = false;
      this.brandVisible = false;
      this.addForm = {
        brandDay: {
          brandName: "" /* 品牌名称 */,
          brandId: "" /* 品牌id */,
          startTime: "" /* 开始时间 */,
          endTime: "" /* 结束时间 */,
          isRecommend: 1 /* 是否上线 1 上线 0 下线 */
        },
        discount: "" /* 折扣 */,
        isAll: 0 /* 是否添加所有商品 */
      };
      this.added = {};
    },
    /* 提交添加 */
    submitform() {
      if (this.addForm.isAll == true && this.addForm.discount == "") {
        this.$message.error("如果需要全部添加商品必须传折扣");
      } else {
        if (this.addForm.brandDay.brandId == "") {
          this.$message.error("请选择品牌活动的品牌");
        } else {
          if (this.alter) {
            updateBrandDay(this.addForm.brandDay).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "修改成功"
                });
                this.showAll();
                this.closeForm();
              } else {
                this.$message.error("修改失败");
              }
            });
          } else {
            insertBrandDay(this.addForm).then(data => {
              if (data.data.status == 200) {
                this.$message({
                  type: "success",
                  message: "添加成功"
                });
                this.showAll();
                this.closeForm();
              } else {
                this.$message.error("添加失败");
              }
            });
          }
        }
      }
    },
    /* 删除品牌日活动 */
    deleteBrandDay(row) {
      this.$confirm("此操作将删除该品牌日活动, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBrandDay(row.id).then(data => {
            if (data.data.status == 200) {
              this.selectByKwd();
              this.$message({
                type: "success",
                message: "删除成功"
              });
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 编辑品牌日 */
    alterBrandDay(rows) {
      this.alter = true;
      this.addForm.brandDay = JSON.parse(JSON.stringify(rows));
      this.brandVisible = true;
    },
    /* 设置上线下线 */
    changeIsRecommend(id) {
      alterBrandDayRecommend(id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            type: "success",
            message: "修改成功"
          });
        } else {
          this.$message.error("修改失败");
          this.selectByKwd();
        }
      });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchName != "") {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getBrandDay(Number.isInteger(val) ? val : 1, 20, this.searchName ? this.searchName : "").then(data => {
        if (data.data.status == 200) {
          this.setView(data);
          this.$message({
            type: "success",
            message: "查询成功"
          });
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getBrandDay(val ? val : 1, 20, "").then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
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
    /* 渲染表格 */
    setView(data) {
      this.brandDayList = data.data.content.result;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageIndex;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.searchState = "";
      this.showAll();
    }
  },
  components: { paginationCom }
};
</script>

<style lang="less">
#brand_day {
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
    }
  }
}
</style>
