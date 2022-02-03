<template>
  <div id="department">
    <!-- 属性列表展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">部门管理</span>
        <el-button plain size="small" @click="addDepartment">添加部门</el-button>
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
            <el-select v-model="searchCompanyId" @change="selectByKwd" filterable placeholder="请选择公司（可搜索）" clearable>
              <el-option v-for="item in companyList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <el-button type="text" @click="clearSearch">清空搜索</el-button>
        </div>
        <el-table :data="departmentList" border style="width: 100%">
          <el-table-column prop="companyId" label="隶属于" align="center">
            <template slot-scope="scope">
              <span v-if="scope.row.companyId">{{scope.row.companyId}}</span>
              <span v-else>暂无公司</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="部门名称" align="center"></el-table-column>
          <el-table-column prop="branchDesc" label="职能描述" align="center"></el-table-column>
          <el-table-column prop="userNum" label="成员数量" align="center"></el-table-column>
          <el-table-column prop="createTime" label="添加时间" align="center"></el-table-column>
          <el-table-column prop="status" label="是否启用" align="center">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" @changeValue="(value)=>{changeStatus(scope.row.id,value)}"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="roleManagement(scope.row)">管理角色</el-button>
                <el-button type="text" size="medium" @click="alterDepart(scope.row)">编辑</el-button>
                <el-button type="text" size="medium" @click="deleteDepart(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <div class="batchOperation">
          <pagination-com :total="total" :size="size" :cPage="cPage" @getJump="(val)=>{handleCurrentChange(val)}"></pagination-com>
        </div>
      </div>
      <el-dialog :title="alter?'修改部门':'添加部门'" :visible.sync="departVisible" @close="closeForm">
        <el-form label-width="80px" :model="alterForm" ref="alterForm">
          <el-form-item label="部门名称">
            <el-input v-model="alterForm.name"></el-input>
          </el-form-item>
          <el-form-item label="职能描述">
            <el-input type="textarea" v-model="alterForm.branchDesc"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeForm">取 消</el-button>
          <el-button type="primary" @click="submitAlter()">确 定</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import paginationCom from "../../components/paginationCom";
import { insertBranch, getBranchPage, updateBranch, deleteBranch, getCompanyAll } from "../../api/permission";
export default {
  data() {
    return {
      departmentList: [],
      // formRules: {
      //   name: { required: true, message: "请输入部门名称", trigger: "blur" },
      //   branchDesc: { required: true, message: "请输入部门职能描述", trigger: "blur" }
      // },
      alterForm: {
        companyId: "1243456383387967488",
        name: "",
        branchDesc: ""
      },
      companyList: [] /* 公司的列表 */,
      searchCompanyId: "" /* 搜索公司的id */,
      total: 0,
      size: 20,
      cPage: 1,
      departVisible: false,
      alter: false
    };
  },
  mounted() {
    this.showAll();
    getCompanyAll().then(data => {
      if (data.data.status == 200) {
        this.companyList = data.data.content;
      }
    });
  },
  methods: {
    alterDepart(rows) {
      this.alterForm = JSON.parse(JSON.stringify(rows));
      this.alter = true;
      this.departVisible = true;
    },
    roleManagement(row) {
      /* 跳转到这个部门的角色管理 必须带有部门的id */
      this.$router.push({ name: "roleManagement", query: { id: row.id, branchName: row.name } });
    },
    closeForm() {
      this.departVisible = false;
      this.alter = false;
      this.alterForm = {
        companyId: "1243456383387967488",
        name: "",
        branchDesc: ""
      };
    },
    addDepartment() {
      this.departVisible = true;
    },
    submitAlter() {
      /* 调接口 */
      if (this.alter) {
        updateBranch(this.alterForm).then(data => {
          if (data.data.status == 200) {
            this.showAll();
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message.error("修改失败");
          }
        });
      } else {
        insertBranch(this.alterForm).then(data => {
          if (data.data.status == 200) {
            this.showAll();
            this.$message({
              message: "添加成功",
              type: "success"
            });
          } else {
            this.$message.error("添加失败");
          }
        });
      }
      this.departVisible = false;
      // this.alterForm = {};
    },
    changeStatus(id, value) {
      /* 改变状态 并重新请求 */
      updateBranch({ id: id, status: value }).then(data => {
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
    /* 分页点击 */
    handleCurrentChange(val) {
      if (this.searchCompanyId != "") {
        //执行查询中的分页
        this.selectByKwd({ page: val });
      } else {
        //执行全部中的分页
        this.showAll(val);
      }
    },
    selectByKwd(obj) {
      getBranchPage({
        pageIndex: obj.page ? obj.page : 1,
        filter: { companyId: this.searchCompanyId == "" ? null : this.searchCompanyId }
      }).then(data => {
        if (data.data.status == 200) {
          this.departmentList = data.data.content.result;
        }
      });
    },
    showAll(val) {
      this.departmentList = [];
      getBranchPage({ pageIndex: val ? val : 1 }).then(data => {
        if (data.data.status == 200) {
          this.departmentList = data.data.content.result;
        }
      });
    },
    clearSearch() {
      this.searchCompanyId = "";
      this.showAll();
    },
    deleteDepart(rows) {
      this.$confirm("此操作将删除该部门, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteBranch(rows.id).then(data => {
            if (data.data.status == 200) {
              this.showAll();
              this.$message({
                message: "删除部门成功",
                type: "success"
              });
            } else {
              this.$message.error("删除部门失败");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: { switchCom, paginationCom }
};
</script>

<style lang='less'>
#department {
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
      .el-table__body-wrapper {
        min-height: 600px;
      }
    }
  }
}
</style>
