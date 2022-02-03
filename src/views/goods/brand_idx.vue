<template>
  <div id="brand_idx">
    <!-- 品牌列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">品牌列表</span>
      </div>
      <div class="content">
        <div class="tool">
          <div class="filtrate">
            <el-button icon="el-icon-plus" type="primary" @click="addNewBrand">新增</el-button>
          </div>
          <div class="search_box">
            <el-input placeholder="请输入品牌名查询" v-model="selectValue" @keyup.native.enter="selectByKwd" class="input-with-select">
              <el-button slot="append" icon="el-icon-search" @click="selectByKwd"></el-button>
            </el-input>
          </div>
        </div>
        <el-table :data="brandList" border row-key="id" style="width: 100%">
          <el-table-column prop="id" label="ID" width="130"></el-table-column>
          <el-table-column prop="brandName" label="品牌名称"></el-table-column>
          <el-table-column prop="first" label="品牌首字母"></el-table-column>
          <el-table-column prop="brandDesc" label="简介"></el-table-column>
          <!-- 品牌logo -->
          <el-table-column prop="brandLogo" align="center" label="品牌LOGO" width="160">
            <template slot-scope="scope" v-if="scope.row.brandLogo">
              <Thumbnail :image="scope.row.brandLogo" />
            </template>
          </el-table-column>
          <el-table-column label="品牌状态" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.brandStatus" type="success">显示</el-tag>
              <el-tag v-else type="danger">隐藏</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="115">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterBrand(scope.row)">编辑</el-button>
                <!-- 一开始没有删除功能 -->
                <el-button type="text" size="medium" @click="deleteBrand(scope.row)">删除</el-button>
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
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getBrandList, deleteBrand } from "../../api/brand";
import Thumbnail from "../../components/thumbnail";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      select: "不限",
      selectValue: "" /* 关键字搜索 */,
      brandList: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页页数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addNewBrand() {
      this.$router.push({ name: "brand_add" });
    },
    alterBrand(rows) {
      this.$router.push({ name: "brand_alter", query: { id: rows.id } });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.selectValue != "") {
        //执行查询中的分页
        this.selectByKwd(val);
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(val) {
      getBrandList({
        pageNo: Number.isInteger(val) ? val : 1,
        brandName: this.selectValue
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
    /* 反复调用显示全部 */
    showAll(val) {
      getBrandList({ pageNo: Number.isInteger(val) ? val : 1 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.brandList = data.data.data.list;
      this.total = data.data.data.total;
      this.cPage = data.data.data.pageNum;
      this.size = data.data.data.pageSize;
    },
    /* 删除品牌 */
    deleteBrand(rows) {
      this.$confirm("此操作将删除该品牌, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBrand({ id: rows.id }).then(data => {
            if (data.data.status == 0) {
              this.showAll();
              this.$message({
                message: "删除品牌成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "删除品牌失败",
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
    /* 状态的启用和禁用 */
    handleIsDelete(obj) {
      if (obj.type == "up") {
        obj.row.isDelete = 0;
        /* 调用接口 */
      }
      if (obj.type == "down") {
        obj.row.isDelete = 1;
        /* 调用接口 */
      }
    }
  },
  components: { paginationCom, Thumbnail }
};
</script>

<style lang='less'>
#brand_idx {
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
      .tool {
        //table上的一栏按钮
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;

        .filtrate {
          display: flex;
          align-items: center;
          width: auto;
        }
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
