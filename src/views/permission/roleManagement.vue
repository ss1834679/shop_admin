<template>
  <div id="roleManagement">
    <!-- 部门下的角色展示 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">角色管理</span>
        <el-button plain size="small" @click="addRole">添加角色</el-button>
      </div>
      <div class="content">
        <el-table :data="roleList" border style="width: 100%">
          <el-table-column prop="id" align="center" label="ID"></el-table-column>
          <el-table-column prop="name" align="center" label="角色名称"></el-table-column>
          <el-table-column align="center" label="所属部门">{{this.$route.query.branchName}}</el-table-column>
          <el-table-column prop="createTime" align="center" label="添加时间"></el-table-column>
          <el-table-column prop="updateTime" align="center" label="修改时间"></el-table-column>
          <el-table-column prop="status" align="center" label="是否启用">
            <template slot-scope="scope">
              <switch-com :boolen="scope.row.status" @changeValue="changeStatus(scope.row.id)"></switch-com>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" width="180">
            <template slot-scope="scope">
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="setPermission(scope.row)">权限设置</el-button>
                <el-button type="text" size="medium" @click="alterName(scope.row)">编辑</el-button>
              </el-button-group>
              <el-button-group class="alterDel">
                <el-button type="text" size="medium" @click="setMenu(scope.row)">菜单设置</el-button>
                <el-button type="text" size="medium" @click="deleteRole(scope.row)">删除</el-button>
              </el-button-group>
            </template>
          </el-table-column>
        </el-table>
        <el-dialog :title="'修改角色名称'" :visible.sync="roleVisible" @close="closeForm">
          <el-form label-width="80px" :model="alterForm" ref="alterForm" :rules="formRules">
            <el-form-item label="角色名称" required prop="name">
              <el-input v-model="alterForm.name"></el-input>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="closeForm">取 消</el-button>
            <el-button type="primary" @click="submitAlter('alterForm')">确 定</el-button>
          </div>
        </el-dialog>
      </div>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import { getRoleByBranch, updateRole, updateRoleStatus, deleteRole } from "../../api/permission";
export default {
  data() {
    return {
      selectValue: "" /* 姓名 */,
      searchDepartId: "" /* 品牌搜索id */,
      roleList: [
        // {
        //   id: "11233",
        //   name: "qweic" /* 角色名字 */,
        //   branchName: "平台部" /* 所属部门 从页面上获取 */,
        //   createTime: "2020-01-22 12:12:12" /* 添加时间 */,
        //   updateTime: "2020-01-22 12:12:12" /* 修改时间 */,
        //   status: 0 /* 是否启用 */
        // }
      ],
      departmentList: [] /* 获取的品牌列表 */,
      roleVisible: false /* 编辑角色名称 可视 */,
      alterForm: {
        name: "" /* 角色名称 */,
        id: "" /* 角色id */
      },
      formRules: { name: { required: true, message: "请输入部门名称", trigger: "blur" } }
    };
  },
  mounted() {
    this.showAll();
  },
  methods: {
    /* 是否启用 */
    changeStatus(id) {
      /* 改变状态 并重新请求 */
      updateRoleStatus(id)
        .then(data => {
          if (data.data.status == 200) {
            this.showAll();
            this.$message({
              message: "修改成功",
              type: "success"
            });
          } else {
            this.$message({
              message: "修改失败",
              type: "error"
            });
          }
        })
        .catch(error => {
          this.$message({
            message: `遇到意料之外的错误，联系管理员${error}`,
            type: "error"
          });
        });
    },
    /* 添加角色 */
    addRole() {
      this.$router.push({ name: "roleAdd", query: { branchId: this.$route.query.id } });
    },
    /* 权限设置 */
    setPermission(row) {
      this.$router.push({ name: "roleSetPermission", query: { id: row.id } });
    },
    /* 设置菜单 */
    setMenu(row) {
      this.$router.push({ name: "roleSetMenu", query: { id: row.id } });
    },
    /* 修改名称 */
    alterName(row) {
      this.alterForm = {
        name: row.name,
        id: row.id
      };
      this.roleVisible = true;
    },
    /* 取消修改 */
    closeForm() {
      this.roleVisible = false;
      this.alterForm = {
        name: "",
        id: ""
      };
    },
    /* 提交修改名称 */
    submitAlter(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateRole(this.alterForm)
            .then(data => {
              if (data.data.status == 200) {
                this.showAll();
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error"
                });
              }
              this.roleVisible = false;
            })
            .catch(error => {
              this.roleVisible = false;
              this.$message({
                message: `遇到意料之外的错误，联系管理员${error}`,
                type: "error"
              });
            });
        } else {
          return false;
        }
      });
    },
    /* 删除角色 */
    deleteRole(row) {
      /* 调用接口 */
      this.$confirm("此操作将删除该角色, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteRole(row.id)
            .then(data => {
              if (data.data.status == 200) {
                this.showAll();
                this.$message({
                  message: "删除角色成功",
                  type: "success"
                });
              } else {
                this.$message({
                  message: "删除角色失败",
                  type: "error"
                });
              }
            })
            .catch(error => {
              this.$message({
                message: `${error}`,
                type: "error"
              });
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    showAll() {
      getRoleByBranch(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.roleList = data.data.content;
        }
      });
    }
  },
  components: { switchCom }
};
</script>

<style lang='less'>
#roleManagement {
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
    }
  }
}
</style>
