<template>
  <div id="trimSerproviderRole">
    <!-- 服务商角色列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">服务商角色</span>
        <el-button @click="addSerproviderRole">添加服务商角色</el-button>
      </div>
      <div class="content">
        <el-table :data="serproviderRoleList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="roleName" label="角色名" align="center"></el-table-column>
          <el-table-column prop="roleSort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterSerproviderRole(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteSerproviderRole(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size.sync="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import {
  getServiceProvidersRolePage,
  checkIsRelevServiceProvidersRoleBefDelete,
  deleteServiceProvidersRole
} from "../../../api/trim";
export default {
  components: { Paginationcom },
  data() {
    return {
      serproviderRoleList: [],
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加服务商角色 */
    addSerproviderRole() {
      this.$router.push({ name: "editSerproviderRole", params: { routerTitle: "添加服务商角色", isAdd: true } });
    },
    /* 编辑服务商角色 */
    alterSerproviderRole(row) {
      this.$router.push({
        name: "editSerproviderRole",
        query: { id: row.id }
      });
    },
    deleteSerproviderRole(row) {
      checkIsRelevServiceProvidersRoleBefDelete(row.id).then(data => {
        if (data.data.data) {
          this.$message.warning("该角色已设置账号，不可删除！");
        } else {
          this.$confirm("此操作将删除该角色，是否继续?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              deleteServiceProvidersRole(row.id).then(res => {
                if (res.data.status == 0) {
                  this.showAll();
                  this.$message.success("删除成功");
                } else {
                  this.$message.error(res.data.msg);
                }
              });
            })
            .catch(() => {
              this.$message("已取消删除");
            });
        }
      });
    },
    showAll(val = {}) {
      getServiceProvidersRolePage({ pageNo: val.page ? val.page : this.cPage, pageSize: this.size }).then(data => {
        if (data.data.status == 0) {
          this.serproviderRoleList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimSerproviderRole {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
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