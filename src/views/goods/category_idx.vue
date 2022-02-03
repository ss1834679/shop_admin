<template>
  <div id="category_idx">
    <!-- 分类列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">分类列表</span>
        <el-button @click="addCategory" size="small" plain>添加分类</el-button>
      </div>
      <div class="content">
        <div class="tool">
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>
              <el-button type="text" @click="breadClick(-1)">一级分类列表</el-button>
            </el-breadcrumb-item>
            <el-breadcrumb-item v-for="(item,i) in parentName" :key="item.id">
              <el-button type="text" @click="breadClick(i,item.id)">{{item.name}}</el-button>
            </el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <el-table :data="categoryList" border row-key="id" style="width: 100%">
          <el-table-column prop="id" label="ID" width="130"></el-table-column>
          <el-table-column prop="categoryName" label="分类名称"></el-table-column>
          <el-table-column prop="categoryIcon" align="center" label="分类图片" width="160">
            <template slot-scope="scope" v-if="scope.row.categoryIcon">
              <Thumbnail :image="scope.row.categoryIcon" />
            </template>
          </el-table-column>
          <el-table-column v-if="index==1" label="导航栏" align="center" width="80">
            <template slot-scope="scope">
              <switch-cate :boolen="inIndex.includes(scope.row.id)" @changeIndex="changeIndex(scope.row)"></switch-cate>
            </template>
          </el-table-column>
          <el-table-column prop="categorySort" label="分类排序" width="80"></el-table-column>
          <el-table-column prop="categoryStatus" label="分类状态" align="center" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.categoryStatus" type="success">显示</el-tag>
              <el-tag v-else type="danger">隐藏</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="设置" width="146" align="center">
            <template slot-scope="scope">
              <el-button-group class="setup">
                <el-button type="text" size="medium" :disabled="index==3" @click="addCategory(scope.row)">新增下级</el-button>
                <el-button type="text" size="medium" :disabled="index==3" @click="showSub(scope.row)">查看下级</el-button>
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterCategory(scope.row)">编辑</el-button>
                <!-- 一开始没有删除功能 -->
                <el-button type="text" size="medium" @click="deleteCategory(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategoryByPar, deleteCategory, getIndexCategory, changeIndexCategory } from "../../api/category";
import switchCate from "../../components/switchCate";
import Thumbnail from "../../components/thumbnail";
export default {
  data() {
    return {
      select: "不限",
      searchInput: "",
      categoryList: [],
      index: 1 /* 判断是第几级 */,
      parentName: [] /* 面包屑的名字 */,
      inIndex: [],
      showTable: true
      // form: {
      //   categoryId: "1230062257992368128" /* 分类id */,
      //   specParamId: "1230062257992368129" /* id */,
      //   specGroupId: null,
      //   specParamName: "大小",
      //   specOptionalValue: null /* optional值 集合 修改参数时有为数组 否则为null */,
      //   specCurrencyValue: ["高", "长"] /* currency值 集合 修改属性时有为数组 否则为null */,
      //   isDisplay: 1 /* 是否展示 1 展示 0 不展示 */,
      //   isSearch: 1 /* 是否搜索 1 搜索 0 不搜索 */
      // }
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addCategory(rows) {
      if (rows.id) {
        this.$router.push({
          name: "category_add",
          query: {
            parentId: rows.id,
            parentName: rows.categoryName,
            level: this.index
          }
        });
      } else {
        this.$router.push({ name: "category_add" });
      }
    },
    alterCategory(rows) {
      this.$router.push({ name: "category_alter", query: { id: rows.id } });
    },
    showSub(rows) {
      /* 请求下级数据渲染表格 */
      this.index++;
      this.parentName.push({
        id: rows.id,
        name: rows.categoryName
      });
      this.showAll(rows.id);
    },
    breadClick(i, id) {
      /* 点击面包屑 */
      this.parentName = this.parentName.slice(0, i + 1);
      this.index = i + 2;
      this.showAll(id);
    },
    showAll(id) {
      this.categoryList = [];
      /* 获取分类列表 */
      getCategoryByPar({ parentId: id, pageNo: 1, pageSize: 40 }).then(data => {
        if (data.data.status == 0) {
          this.setView(data);
        }
      });
      /* 获取分类是否在首页 */
      getIndexCategory().then(data => {
        if (data.data.status == 200) {
          this.inIndex = data.data.content;
        }
      });
    },
    changeIndex(row) {
      /* 上架或者下架 */
      changeIndexCategory(row.id, row.categorySort).then(data => {
        if (data.data.status == 200) {
          /* 获取分类是否在首页 */
          getIndexCategory().then(data => {
            if (data.data.status == 200) {
              this.inIndex = data.data.content;
            }
          });
        }
      });
    },
    deleteCategory(rows) {
      this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCategory({ id: rows.id }).then(data => {
            if (data.data.status == 0) {
              this.index = 1;
              this.parentName = [];
              this.showAll();
              this.$message({
                message: "删除分类成功",
                type: "success"
              });
            } else {
              this.$message({
                message: "删除分类失败",
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
    setView(data) {
      this.categoryList = data.data.data.list;
    }
  },
  components: { switchCate, Thumbnail }
};
</script>

<style lang='less'>
#category_idx {
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
      .tool {
        //table上的一栏按钮
        display: flex;
        justify-content: space-between;
        margin-bottom: 15px;
        .el-breadcrumb {
          background-color: transparent;
          padding: 0;
        }
      }
      .el-table__body-wrapper {
        min-height: 600px;
      }
    }
  }
}
</style>
