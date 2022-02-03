<template>
  <div id="attrStyle">
    <!-- 风格列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">风格列表—{{this.attrStyleList.categoryName}}</span>
        <el-button @click="addAttrStyle()">添加风格</el-button>
      </div>
      <div class="content">
        <el-table :data="attrStyleList.bos" border style="width: 100%">
          <el-table-column prop="id" label="编号"></el-table-column>
          <el-table-column prop="name" label="风格名称"></el-table-column>
          <el-table-column prop="sort" label="排序"></el-table-column>
          <el-table-column prop="isShow" label="显示状态">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.isShow" activeText="显示" inactiveText="隐藏" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="170">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterAttrStyle(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteAttrStyle(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getGoodsStyleByCategoryId, setGoodsStyleShowStatus, deleteGoodsStyle } from "../../api/good";
import switchCom from "../../components/switch";
export default {
  components: { switchCom },
  data() {
    return {
      attrStyleList: {
        categoryName: "",
        categoryId: "",
        bos: []
      }
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加商品风格 */
    addAttrStyle() {
      this.$router.push({
        name: "editAttrStyle",
        query: { cateId: this.attrStyleList.categoryId, cateName: this.attrStyleList.categoryName }
      });
    },
    /* 编辑商品风格 */
    alterAttrStyle(row) {
      this.$router.push({
        name: "editAttrStyle",
        query: {
          id: row.id,
          cateId: this.attrStyleList.categoryId,
          cateName: this.attrStyleList.categoryName
        }
      });
    },
    deleteAttrStyle(row) {
      this.$confirm("此操作将删除该商品风格, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteGoodsStyle(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success("删除风格成功");
              this.showAll();
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 修改状态 */
    changeStatus(id, value) {
      setGoodsStyleShowStatus({ id: id, status: value }).then(data => {
        if (data.data.status == 0) {
          this.$message.success("修改状态成功");
        } else {
          this.$message.error(data.data.msg);
        }
      });
    },
    showAll() {
      getGoodsStyleByCategoryId(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.attrStyleList = data.data.data;
        } else {
          this.$message.error(data.data.msg);
        }
      });
    }
  }
};
</script>

<style lang='less'>
#attrStyle {
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