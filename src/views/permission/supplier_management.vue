<template>
  <div id="supplier_management">
    <!-- 本级的供应商管理 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">供应商管理</span>
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
            <span class="s-size">请输入:</span>
          </div>
          <div class="search_box">
            <el-input placeholder="公司名称" v-model="searchName" @keyup.native.enter="selectByKwd" @blur="selectByKwd" class="input-with-select"></el-input>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <div class="se-content">
          <div>
            <i class="el-icon-s-unfold" style="font-size:18px;margin-right:5px"></i>
            <span>数据列表</span>
          </div>
          <div class="se-right">
            <div class="box-r">
              <el-button plain @click="addSupplier" size="small">添加供应商</el-button>
            </div>
          </div>
        </div>
        <el-table :data="supplierList" border row-key="id" style="width: 100%">
          <el-table-column prop="sysCompany.name" label="公司名称" width="135"></el-table-column>
          <el-table-column prop="supplier.supplierName" label="店铺名称"></el-table-column>
          <el-table-column prop="sysCompany.branchNum" label="部门数量"></el-table-column>
          <el-table-column prop="sysCompany.createTime" align="center" label="添加时间"></el-table-column>
          <!-- <el-table-column prop="sysCompany.status" align="center" label="是否启用">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.sysCompany.status" @changeValue="changeStatus(scope.row.sysCompany.id)"></switch-com>
            </template>
          </el-table-column> -->
          <el-table-column label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="alterSupplier(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" disabled @click="deleteSupplier(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
        <el-dialog title="修改公司" :visible.sync="companyVisible" @close="closeForm">
          <el-form label-width="80px" :model="alterForm" ref="alterForm">
            <el-form-item label="公司名称">
              <el-input v-model="alterForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="submitAlter()">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getCompanyList, deleteCompany, updateCompany } from "../../api/permission";
import paginationCom from "../../components/paginationCom";
export default {
  data() {
    return {
      searchName: "" /* 公司名称 */,
      supplierList: [],
      cPage: 1,
      size: 20,
      total: 0,
      companyVisible: false,
      alterForm: {}
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    addSupplier() {
      this.$router.push({ name: "per_supplier_add" });
    },
    /* 删除供应商 */
    deleteSupplier(row) {
      this.$confirm("此操作将删除该供应商, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteCompany(row.sysCompany.id).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功"
              });
              this.showAll();
            } else {
              this.$message.error("删除失败");
            }
          });
        })
        .catch(() => {
          this.$message("已取消删除");
        });
    },
    /* 编辑供应商 */
    alterSupplier(row) {
      this.alterForm = JSON.parse(JSON.stringify(row.sysCompany));
      this.companyVisible = true;
    },
    submitAlter() {
      updateCompany(this.alterForm).then(data => {
        if (data.data.status == 200) {
          this.companyVisible = false;
          this.showAll();
          this.$message({
            type: "success",
            message: "修改成功"
          });
        }
      });
    },
    closeForm() {
      this.alterForm = {};
      this.companyVisible = false;
    },
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchName != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    /* 搜索分页 */
    selectByKwd(obj) {
      getCompanyList(obj.page ? obj.page : 1, 20, this.searchName == "" ? null : this.searchName).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 反复调用显示全部 */
    showAll(val) {
      getCompanyList(val ? val : 1, 20).then(data => {
        if (data.data.status == 200) {
          this.setView(data);
        }
      });
    },
    /* 渲染表格 */
    setView(data) {
      this.supplierList = data.data.content.result;
      this.total = data.data.content.total;
      this.cPage = data.data.content.pageIndex;
      this.size = data.data.content.pageSize;
    },
    /* 清空搜索 */
    clearSearch() {
      this.searchName = "";
      this.showAll();
    }
  },
  components: { paginationCom }
};
</script>

<style lang="less">
#supplier_management {
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
