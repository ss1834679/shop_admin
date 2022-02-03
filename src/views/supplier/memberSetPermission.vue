<template>
  <div id="addAlter">
    <!-- 成员权限的分配 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">分配成员权限</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="userForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="成员账号" required prop="name">{{userForm.username}}</el-form-item>
          <el-form-item label="分配权限" class="editOptional" required>
            <permission-table :nowPermission="nowPermission" @getPermission="(value)=>{this.userForm.permission=value}"></permission-table>
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
import { getPermissionByUserId, getUserById, updateUserPermission } from "../../api/permission";
export default {
  data() {
    return {
      userForm: {
        id: "" /* 成员的id */,
        name: "",
        permission: [] /* 权限数组 */
      },
      nowPermission: [] /* 现在的权限 */,
      showTable: true
    };
  },
  mounted() {
    /* 获取当前成员 */
    getUserById(this.$route.query.id).then(data => {
      if (data.data.status == 200) {
        this.userForm = data.data.content.sysUser;
      }
    });
    /* 把 nowPermission 赋值 */
    getPermissionByUserId(this.$route.query.id).then(data => {
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
      updateUserPermission(this.userForm.permission, this.userForm.id)
        .then(data => {
          if (data.data.status == 200) {
            this.$message({
              message: "成员分配权限成功",
              type: "success"
            });
            this.$router.go(-1);
          } else {
            this.$message({
              message: "成员分配权限失败",
              type: "error"
            });
          }
        })
        
    }
  },
  components: { permissionTable }
};
</script>

<style lang='less'>
#addAlter {
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
      .gosteps {
        display: flex;
        justify-content: center;
      }
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
