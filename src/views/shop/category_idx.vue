<template>
  <div id="category_idx">
    <!-- 分类列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">分类列表</span>
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
          <div class="filtrate">
            <el-button icon="el-icon-plus" type="primary" @click="addCategory">新增分类</el-button>
          </div>
        </div>
        <el-table :data="categoryList" border row-key="id" height="200" :tree-props="{children: 'childList'}" style="width: 100%">
          <el-table-column prop="id" label="ID" width="130"></el-table-column>
          <el-table-column prop="categoryName" label="分类名称"></el-table-column>
          <el-table-column prop="categoryIcon" align="center" label="分类图片" width="160">
            <template slot-scope="scope" v-if="scope.row.categoryIcon">
              <el-image :src="base+scope.row.categoryIcon" style=" height: 40px" :preview-src-list="(base+scope.row.categoryIcon).split(',')"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="categorySort" label="分类排序" width="80"></el-table-column>
          <el-table-column prop="categoryStatus" label="分类状态" width="80">
            <template slot-scope="scope">
              <el-tag v-if="scope.row.categoryStatus" type="success">启用</el-tag>
              <el-tag v-else type="danger">禁用</el-tag>
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
                <el-button type="text" size="medium" disabled>删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategoryByPar } from "../../api/category";
export default {
  data() {
    return {
      select: "不限",
      maringLeft: { marginLeft: "10px" },
      searchInput: "",
      categoryList: [],
      index: 1 /* 判断是第几级 */,
      parentName: [] /* 面包屑的名字 */,
      base:""
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
    this.showAll();
  },
  methods: {
    addCategory(rows) {
      if (rows) {
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
      console.log(rows);
      // this.$router.push({ name: "category_alter", query: { id: rows.id } });
      this.$router.push({ name: "category_alter", query: { id: "1224621690495959040" } });
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
      // const loading = this.$loading({
      //   lock: true,
      //   text: "Loading",
      //   spinner: "el-icon-loading",
      //   background: "rgba(0, 0, 0, 0.7)"
      // });
      getCategoryByPar({ parentId: id, pageNo: 1, pageSize: 40 }).then(data => {
        console.log(data);
        if (data.data.status == 0) {
          this.setView(data);
          // loading.close();
        }
      });
    },
    setView(data) {
      this.categoryList = data.data.data.list;
    }
  },
  components: {}
};
</script>

<style lang='less'>
#category_idx {
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
      .el-button-group.alterDel,
      .el-button-group.setup {
        width: 100%;
        display: flex;
        justify-content: space-evenly;
      }
      .el-pagination {
        padding: 0;
        margin-top: 20px;
      }
    }
  }
}
</style>
