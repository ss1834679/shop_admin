<template>
  <div id="proprietor">
    <!-- 业主列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">业主</span>
        <el-button @click="addProprietor">添加业主</el-button>
      </div>
      <div class="content">
        <el-table :data="proprietorList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="name" label="业主名" align="center"></el-table-column>
          <el-table-column prop="account" label="账号" align="center"></el-table-column>
          <el-table-column prop="userAccount" label="虚户账号" align="center"></el-table-column>
          <el-table-column prop="accountStatus" label="账户创建情况" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accountStatus=='ENABLE'" style="color:red">已成功创建</span>
              <span v-else>创建失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="ownerSort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterProprietor(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteProprietor(scope.row)">删除</el-button>
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
import { getOwnerPage, deleteOwner } from "../../../api/trim";
export default {
  components: { Paginationcom },
  data() {
    return {
      proprietorList: [],
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加业主 */
    addProprietor() {
      this.$router.push({ name: "editproprietor", params: { routerTitle: "添加业主", isAdd: true } });
    },
    /* 编辑业主 */
    alterProprietor(row) {
      this.$router.push({ name: "editproprietor", params: { routerTitle: "修改业主" }, query: { id: row.id } });
    },
    deleteProprietor(row) {
      this.$confirm("此操作将删除该“业主”，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteOwner(row.id).then(data => {
            if (data.data.status == 200) {
              this.$message.success("删除成功");
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
    showAll(val = {}) {
      getOwnerPage({ pageNo: val.page ? val.page : this.cPage, pageSize: this.size }).then(data => {
        if (data.data.status == 0) {
          this.proprietorList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#proprietor {
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