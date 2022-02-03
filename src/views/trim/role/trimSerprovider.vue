<template>
  <div id="trimSerprovider">
    <!-- 服务商列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">服务商</span>
        <el-button @click="addSerprovider">添加服务商</el-button>
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
            <span>角色：</span>
            <el-select v-model="searchRole" @change="showAll" placeholder="请选择角色" clearable>
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </div>
        </div>
        <el-table :data="serproviderList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="name" label="服务商名" align="center"></el-table-column>
          <el-table-column prop="account" label="账号" align="center"></el-table-column>
          <el-table-column prop="roleName" label="角色" align="center"></el-table-column>
          <el-table-column prop="accountStatus" label="账户创建情况" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accountStatus=='ENABLE'" style="color:red">已成功创建</span>
              <span v-else>创建失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="serviceProvidersSort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterSerprovider(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteSerprovider(scope.row)">删除</el-button>
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
import { getServiceProvidersPage, getServiceProvidersRoleSelect, deleteServiceProviders } from "../../../api/trim";
export default {
  components: { Paginationcom },
  data() {
    return {
      searchRole: "" /* 角色搜索 */,
      serproviderList: [] /* 服务商列表 */,
      roleList: [] /* 角色列表 */,
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
    getServiceProvidersRoleSelect().then(data => {
      if (data.data.status == 0) {
        this.roleList = data.data.data;
      }
    });
  },
  methods: {
    /* 添加服务商 */
    addSerprovider() {
      this.$router.push({ name: "editSerprovider", params: { routerTitle: "添加服务商", isAdd: true } });
    },
    /* 编辑服务商 */
    alterSerprovider(row) {
      this.$router.push({
        name: "editSerprovider",
        query: { id: row.id },
        params: { routerTitle: "修改服务商" }
      });
    },
    deleteSerprovider(row) {
      this.$confirm("此操作将删除该“服务商”，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteServiceProviders(row.id).then(data => {
            if (data.data.status == 0) {
              this.showAll();
              this.$message.success("删除成功");
            } else {
              this.$message.error(data.data.msg);
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    showAll(val = {}) {
      getServiceProvidersPage({
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20,
        roleId: this.searchRole == "" ? undefined : this.searchRole
      }).then(data => {
        if (data.data.status == 0) {
          this.serproviderList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimSerprovider {
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