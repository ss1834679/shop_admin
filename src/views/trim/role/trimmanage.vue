<template>
  <div id="trimmanage">
    <!-- 装修管家列表 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">装修管家</span>
        <el-button @click="addTrimManage">添加装修管家</el-button>
      </div>
      <div class="content">
        <el-table :data="trimManageList" border style="width: 100%">
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="houseKeeperName" label="管家名" align="center"></el-table-column>
          <el-table-column prop="accountNum" label="账号" align="center"></el-table-column>
          <el-table-column prop="sort" label="排序" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="120">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="alterTrimManage(scope.row)">编辑</el-button>
                <el-button type="text" @click="deleteTrimManage(scope.row)">删除</el-button>
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
import { getHouseKeeperPage, deleteHouseKeeper } from "../../../api/trim";
export default {
  components: { Paginationcom },
  data() {
    return {
      trimManageList: [],
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加装修管家 */
    addTrimManage() {
      this.$router.push({ name: "editTrimmanage", params: { isAdd: true } });
    },
    /* 编辑装修管家 */
    alterTrimManage(row) {
      this.$router.push({ name: "editTrimmanage", query: { id: row.id } });
    },
    deleteTrimManage(row) {
      this.$confirm("此操作将删除该“管家”，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteHouseKeeper(row.id).then(data => {
            if (data.data.status == 200) {
              this.showAll({ page: this.cPage });
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
      getHouseKeeperPage(val.page ? val.page : 1, this.size).then(data => {
        if (data.data.status == 200) {
          this.trimManageList = data.data.content.list;
          this.total = data.data.content.total;
          this.cPage = data.data.content.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#trimmanage {
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