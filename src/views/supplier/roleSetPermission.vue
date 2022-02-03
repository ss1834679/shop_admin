<template>
  <div id="roleSetPermissionSup">
    <!-- 角色权限的分配 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">分配角色权限</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="roleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="角色名称" required prop="name">{{roleForm.name}}</el-form-item>
          <el-form-item label="分配权限" class="editOptional" required>
            <permission-table :nowPermission="nowPermission" @getPermission="(value)=>{this.permission=value}"></permission-table>
          </el-form-item>
          <el-form-item class="submit">
            <el-button type="success" @click="submitForm()">确认分配</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import permissionTable from "../../components/permissionTableOne";
import { getPermissionByRole, getRoleById } from "../../api/permission";
import { alterRolePermissionSup } from "../../api/supplier_per";
export default {
  data() {
    return {
      roleForm: {
        id: "" /* 角色的id */,
        name: ""
      },
      permission: [] /* 权限数组 */,
      nowPermission: [] /* 现在的权限 */
    };
  },
  mounted() {
    /* 获取当前角色 */
    getRoleById(this.$route.query.id).then(data => {
      if (data.data.status == 200) {
        this.roleForm = data.data.content;
      }
    });
    /* 把 nowPermission 赋值 */
    getPermissionByRole(this.$route.query.id).then(data => {
      if (Array.isArray(data.data.content) && data.data.content.length > 0) {
        this.nowPermission = data.data.content.map(item => {
          return item.id;
        });
      }
    });
  },
  methods: {
    /* 提交表单 */
    submitForm() {
      alterRolePermissionSup(this.permission, this.roleForm.id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            message: "角色分配权限成功",
            type: "success"
          });
          this.$router.go(-1);
        } else {
          this.$message.error("角色分配权限失败");
        }
      });
    }
  },
  components: { permissionTable }
};
</script>

<style lang='less'>
#roleSetPermissionSup {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        margin-left: 20px;
        width: 100%;
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      text-align: left;
      .editOptional {
        .el-form-item__label {
          text-align: left;
          font-size: 20px;
          font-weight: 500;
        }
      }
      .submit {
        .el-form-item__content {
          margin-left: 0 !important;
        }
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>
