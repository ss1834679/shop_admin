<template>
  <div id="roleSetMenuSup">
    <!-- 角色菜单的分配 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">分配角色菜单</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="roleForm" label-width="120px" class="demo-ruleForm">
          <el-form-item label="角色名称" required prop="name">{{roleForm.name}}</el-form-item>
          <el-form-item label="分配菜单" class="editOptional" required>
            <permission-table @getMenu="(value)=>{this.roleForm.menu=value}" :nowMenu="nowMenu"></permission-table>
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
import permissionTable from "../../components/menuTableOne";
import { getMenuByRole, getRoleById } from "../../api/permission";
import { alterRoleMenuSup } from "../../api/supplier_per";
export default {
  data() {
    return {
      roleForm: {
        id: "" /* 角色的id */,
        name: "",
        menu: [] /* 菜单数组 */
      },
      nowMenu: [] /* 现在的菜单的数组 */
    };
  },
  mounted() {
    /* 获取当前角色 */
    getRoleById(this.$route.query.id).then(data => {
      if (data.data.status == 200) {
        this.roleForm = data.data.content;
      }
    });
    /* 把 nowMenu 赋值 */
    getMenuByRole(this.$route.query.id).then(data => {
      if (Array.isArray(data.data.content) && data.data.content.length > 0) {
        this.nowMenu = this.exchangeMenu(data.data.content);
      }
    });
  },
  methods: {
    /* 提交表单 */
    submitForm() {
      alterRoleMenuSup(this.roleForm.menu, this.roleForm.id).then(data => {
        if (data.data.status == 200) {
          this.$message({
            message: "角色分配菜单成功",
            type: "success"
          });
          this.$router.go(-1);
        } else {
          this.$message.error("角色分配菜单失败");
        }
      });
    },
    exchangeMenu(arr) {
      let arr1 = [];
      if (Array.isArray(arr)) {
        arr.forEach(item => {
          arr1.push(item.sysMenu.id);
          arr1 = arr1.concat(this.exchangeMenu(item.menuModelList));
        });
        return arr1;
      } else {
        return [];
      }
    }
  },
  components: { permissionTable }
};
</script>

<style lang='less'>
#roleSetMenuSup {
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
