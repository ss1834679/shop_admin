<template>
  <div id="designerCompanyLevel_idx">
    <!-- 设计公司等级 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">设计公司等级</span>
      </div>
      <!--数据列表  -->
      <div class="se-content">
        <div>
          <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
          <span>数据列表</span>
        </div>
        <el-button plain size="small" @click="addCompanyLevel()">+添加等级</el-button>
      </div>
      <!-- 表格标题 -->
      <el-table :data="companyLevelList" border row-key="id" style="width: 100%">
        <el-table-column prop="id" label="ID"></el-table-column>
        <el-table-column prop="name" label="等级名称"></el-table-column>
        <el-table-column prop="deposit" label="保证金">
          <template slot-scope="scope">
            <div>{{"¥" + (scope.row.deposit / 100).toFixed(2)}}</div>
          </template>
        </el-table-column>
        <el-table-column prop="designerMaxNumber" label="允许关联设计师数量"></el-table-column>
        <el-table-column prop="feeRatio" label="服务费比例">
          <template slot-scope="scope">
            <div>{{scope.row.feeRatio}}%</div>
          </template>
        </el-table-column>
        <el-table-column prop="designerCompanyNumber" label="设计公司数量"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="editCompanyLevel(scope.row)">编辑</el-button>
            <el-button type="text" @click="deleteCompanyLevel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="batchOperation">
        <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCompanyLevel, deleteCompanyLevel } from "../../api/designer";
import paginationCom from "../../components/paginationCom";
export default {
  components: {
    paginationCom
  },
  data() {
    return {
      companyLevelList: [],
      dataLists: [],
      total: 0 /* 分页总数 */,
      cPage: 1 /* 当前页码 */,
      size: 20 /* 每页个数 */
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 添加等级 */
    addCompanyLevel() {
      this.$router.push({ name: "designCompanyLevel_add", query: { type: "1" } });
    },
    // 修改等级
    editCompanyLevel(rows) {
      this.$router.push({ name: "designCompanyLevel_add", query: { id: rows.id, type: "2" } });
    },
    // 删除
    deleteCompanyLevel(rows) {
      this.dataLists.push(rows.id);
      this.$confirm("确定要删除这条设计师公司等级吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCompanyLevel(this.dataLists).then(data => {
            if (data.data.status == 200) {
              this.$message({ message: "删除成功", type: "success" });
              this.showAll();
            } else {
              this.$message({
                message: data.data.msg,
                type: "error"
              });
            }
            this.dataLists = [];
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      // 执行全部中的分页
      this.showAll(val);
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getCompanyLevel(Number.isInteger(val) ? val : 1, {
        pageSize: 20
      }).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.companyLevelList = data.data.content.list;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pages;
      this.size = data.data.content.size;
    }
  }
};
</script>

<style lang="less">
#designerCompanyLevel_idx {
  width: 100%;
  height: auto;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
    }
  }
}
</style>
