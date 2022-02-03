<template>
  <div id="trimPromanage">
    <!-- 项目经理列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">项目经理</span>
        <el-button @click="addTrimPromanage">添加项目经理</el-button>
      </div>
      <div class="content">
        <el-table :data="trimPromanageList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="projectManagerName" label="项目经理名" align="center"></el-table-column>
          <el-table-column prop="accountNum" label="账号" align="center"></el-table-column>
          <el-table-column prop="accountStatus" label="账户创建情况" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.accountStatus=='ENABLE'" style="color:red">已成功创建</span>
              <span v-else>创建失败</span>
            </template>
          </el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterTrimPromanage(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteTrimPromanage(scope.row)">删除</el-button>
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
import { getProjectManagerPage, deleteProjectManager } from "../../../api/trim";
export default {
  components: { Paginationcom },
  data() {
    return {
      trimPromanageList: [],
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加项目经理 */
    addTrimPromanage() {
      this.$router.push({ name: "editPromanage", params: { routerTitle: "添加项目经理", isAdd: true } });
    },
    /* 编辑项目经理 */
    alterTrimPromanage(row) {
      this.$router.push({ name: "editPromanage", params: { routerTitle: "修改项目经理" }, query: { id: row.id } });
    },
    deleteTrimPromanage(row) {
      this.$confirm("此操作将删除该“项目经理”，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteProjectManager(row.id).then(data => {
            if (data.data.status == 200) {
              this.$message.success("删除成功");
              this.showAll({ page: this.cPage });
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
      getProjectManagerPage(val.page ? val.page : 1, this.size).then(data => {
        if (data.data.status == 200) {
          this.trimPromanageList = data.data.content.list;
          this.total = data.data.content.total;
          this.cPage = data.data.content.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimPromanage {
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