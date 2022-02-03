<template>
  <div id="attribute_optional">
    <!-- 参数列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">参数列表</span>
        <el-button plain size="small" @click="addAttr">添加</el-button>
      </div>
      <div class="content">
        <el-table :data="specParamList" border row-key="specParamId" style="width: 100%">
          <el-table-column prop="specParamId" label="编号" width="130" align="center"></el-table-column>
          <el-table-column prop="specParamName" label="属性名称" align="center"></el-table-column>
          <el-table-column prop="level" label="级别" align="center">{{categoryName}}</el-table-column>
          <el-table-column label="可选值列表" align="center">
            <template slot-scope="scope">{{scope.row.specOptionalValue.join(',')}}</template>
          </el-table-column>
          <el-table-column label="操作" width="150" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterAttr(scope.row)">编辑</el-button>
                <el-button type="text" size="medium">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      specParamList: [],
      params: {},
      categoryId: "",
      categoryName: ""
    };
  },
  mounted() {
    this.categoryId = this.$route.query.id;
    this.categoryName = this.$route.query.categoryName;
    this.showAll();
  },
  methods: {
    addAttr() {
      this.$router.push({ name: "optional_add" });
    },
    alterAttr(rows) {
      this.$router.push({ name: "optional_alter", params: { data: rows, id: this.categoryId, name: this.categoryName } });
    },
    showAll() {
      //   const loading = this.$loading({
      //     lock: true,
      //     text: "Loading",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.7)"
      //   });
      // getCategoryParams(this.categoryId)
      //   .then(data => {
      //     if (data.data.status == 0) {
      //       this.setView(data);
      //       console.log(data);
      //       //   loading.close();
      //     }
      //   })
        
    },
    // deleteCategory(rows) {
    //   this.$confirm("此操作将删除该分类, 是否继续?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       deleteCategory({ id: rows.id }).then(data => {
    //         if (data.data.status == 0) {
    //           this.index = 1;
    //           this.parentName = [];
    //           this.showAll();
    //           this.$message({
    //             message: "删除分类成功",
    //             type: "success"
    //           });
    //         } else {
    //           this.$message({
    //             message: "删除分类失败",
    //             type: "error"
    //           });
    //         }
    //       });
    //     })
    //     .catch(() => {
    //       this.$message({
    //         type: "info",
    //         message: "已取消删除"
    //       });
    //     });
    // },
    setView(data) {
      this.specParamList = data.data.data.specOptionalVOs[0].specParamVOs;
      this.params = data.data.data;
    }
  },
  components: {}
};
</script>

<style lang='less'>
#attribute_optional {
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
      .el-table__body-wrapper {
        min-height: 600px;
      }
    }
  }
}
</style>
