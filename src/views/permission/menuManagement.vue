<template>
  <div id="category_idx">
    <!-- 菜单列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">菜单列表</span>
        <el-button @click="addCategory" size="small" plain>添加菜单</el-button>
      </div>
      <div class="content">
        <el-table :data="menuList" border row-key="id" style="width: 100%">
          <el-table-column prop="id" label="ID"></el-table-column>
          <el-table-column prop="title" align="center" label="菜单名称"></el-table-column>
          <el-table-column prop="sort" label="菜单排序" width="80"></el-table-column>
          <el-table-column label="菜单状态" align="center" width="80">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" @changeValue="changeStatus(scope.row.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="110" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterMenu(scope.row)">编辑</el-button>
                <!-- 一开始没有删除功能 -->
                <el-button type="text" size="medium" @click="deleteMenu(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import { getMenu, changeMenuStatus, deleteMenu } from "../../api/permission";
export default {
  data() {
    return {
      select: "不限",
      searchInput: "",
      menuList: []
      // form: {
      //   categoryId: "1230062257992368128" /* 菜单id */,
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
    addCategory() {
      this.$router.push({ name: "menuAdd" });
    },
    alterMenu(rows) {
      this.$router.push({ name: "menuAlter", query: { id: rows.id } });
    },
    changeStatus(id) {
      changeMenuStatus(id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          this.$message.error("修改失败");
          this.showAll();
        }
      });
    },
    showAll() {
      this.menuList = [];
      getMenu().then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    deleteMenu(rows) {
      this.$confirm("此操作将删除该菜单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteMenu(rows.id).then(data => {
            if (data.data.status == 200) {
              this.showAll();
              this.$message({
                message: "删除菜单成功",
                type: "success"
              });
            } else {
              this.$message.error("删除菜单失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    setView(data) {
      /* 获取菜单转化格式 */
      let initMenu = arr => {
        if (Array.isArray(arr)) {
          let arr1 = new Array(arr.length);
          arr.forEach((item, index) => {
            arr1[index] = item.sysMenu;
            arr1[index]["children"] = initMenu(item.menuModelList);
          });
          return arr1;
        } else {
          return null;
        }
      };
      this.menuList = initMenu(data.data.content);
      // console.log(this.menuList);
    }
  },
  components: { switchCom }
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
