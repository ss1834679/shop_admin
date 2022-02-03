<template>
  <div id="goods_attribute">
    <!-- 商品类型展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">商品类型</span>
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
          <el-table-column prop="id" label="编号" width="130" align="center"></el-table-column>
          <el-table-column prop="categoryName" label="商品分类" align="center"></el-table-column>
          <el-table-column prop="level" label="级别" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.level==1">一级</span>
              <span v-if="scope.row.level==2">二级</span>
              <span v-if="scope.row.level==3">三级</span>
            </template>
          </el-table-column>
          <el-table-column prop="paramNum" label="属性数量" align="center"></el-table-column>
          <el-table-column label="设置" width="170" align="center">
            <template slot-scope="scope">
              <el-button-group class="setup">
                <el-button type="text" size="medium" @click="propertyList({id:scope.row.id,categoryName:scope.row.categoryName,type:'currency'})">属性列表</el-button>
                <el-button type="text" size="medium" v-if="scope.row.level==1" @click="goStyleList(scope.row.id)">风格列表</el-button>
                <!-- <el-button type="text" size="medium" @click="propertyList({id:scope.row.id,categoryName:scope.row.categoryName,type:'optional'})">参数列表</el-button> -->
              </el-button-group>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" :disabled="index==3" @click="showSub(scope.row)">下级</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCategoryByLevel } from "../../api/category";
export default {
  data() {
    return {
      categoryList: [],
      index: 1 /* 判断是第几级 */,
      parentName: [] /* 面包屑的名字 */
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
    goStyleList(id) {
      this.$router.push({ name: "attrStyleList", query: { id: id } });
    },
    alterCategory(rows) {
      this.$router.push({ name: "category_alter", query: { id: rows.id } });
    },
    propertyList(obj) {
      if (obj.type == "currency") {
        this.$router.push({ name: "attribute_currency", query: { id: obj.id, categoryName: obj.categoryName } });
      }
      // if (obj.type == "optional") {
      //   this.$router.push({ name: "attribute_optional", query: { id: obj.id, categoryName: obj.categoryName } });
      // }
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
      getCategoryByLevel(id || 1).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    setView(data) {
      this.categoryList = data.data.content;
    }
  },
  components: {}
};
</script>

<style lang='less'>
#goods_attribute {
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
