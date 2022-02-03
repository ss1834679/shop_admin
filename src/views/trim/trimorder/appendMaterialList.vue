<template>
  <div id="appendMaterialList">
    <!-- 增项资料 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">增项资料</span>
        </div>
      </div>
      <div class="content">
        <el-table :data="materialList" border>
          <el-table-column prop="id" label="编号" align="center"></el-table-column>
          <el-table-column prop="title" label="标题" align="center"></el-table-column>
          <el-table-column prop="createTime" label="发布时间" align="center"></el-table-column>
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" @click="handleViewMaterial(scope.row)">查看</el-button>
                <el-button type="text" v-if="managerVisible" @click="handleDelete(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <Paginationcom :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{showAll({page:val})}" />
      </div>
    </el-card>
  </div>
</template>

<script>
import Paginationcom from "../../../components/paginationCom";
import { getDecorateAdditionsInfoPage, deleteDecorateAdditionsInfo } from "../../../api/trim";
import { mapGetters } from "vuex";
export default {
  components: { Paginationcom },
  data() {
    return {
      materialList: [],
      total: 0,
      size: 20,
      cPage: 1
    };
  },
  computed: {
    ...mapGetters({
      managerVisible: "onGetIsManager"
    })
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /** 查看增项资料 */
    handleViewMaterial(row) {
      this.$router.push({ name: "appendMaterialDetails", query: { id: row.id } });
    },
    handleDelete(row) {
      this.$confirm("此操作将删除该增项资料，是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteDecorateAdditionsInfo(row.id).then(data => {
            if (data.data.status == 0) {
              this.$message.success(data.data.data);
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
      getDecorateAdditionsInfoPage({
        additionsId: this.$route.query.id,
        pageNo: val.page ? val.page : this.cPage,
        pageSize: 20
      }).then(data => {
        if (data.data.status == 0) {
          this.materialList = data.data.data.list;
          this.total = data.data.data.total;
          this.cPage = data.data.data.pageNum;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#appendMaterialList {
  width: 100%;
  height: auto;
  .el-card {
    height: 100%;
    .el-card__header {
      padding: 0;
      .clearfix {
        width: calc(~"100% - 40px");
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
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
    }
  }
}
</style>