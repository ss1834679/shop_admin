<template>
  <div id="editSerproviderRole">
    <!-- 编辑服务商角色-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">{{$route.params.routerTitle||"编辑服务商角色"}}</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="serproviderRoleForm" ref="serproviderRoleForm" :rules="serproviderRoleRules" label-width="150px">
          <el-form-item label="角色名" prop="roleName">
            <el-input v-model.trim="serproviderRoleForm.roleName" placeholder="请输入角色名称" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="roleSort">
            <el-input-number v-model="serproviderRoleForm.roleSort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('serproviderRoleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  addServiceProvidersRole,
  checkNameIsExistServiceProvidersRole,
  getServiceProvidersRoleById,
  updateServiceProvidersRole
} from "../../../api/trim";
export default {
  data() {
    return {
      serproviderRoleForm: {
        /* 服务商角色数据 */
        roleName: "",
        roleSort: undefined
      },
      serproviderRoleRules: {}
    };
  },
  created() {
    this.serproviderRoleRules = {
      roleName: [{ validator: this.checkIsRepeat, trigger: "change" }],
      roleSort: [{ required: true, message: "请输入排序值", trigger: "blur" }]
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getServiceProvidersRoleById(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.serproviderRoleForm = data.data.data;
        }
      });
    }
  },
  methods: {
    checkIsRepeat(rule, value, callback) {
      if (
        this.serproviderRoleForm.roleName == undefined ||
        this.serproviderRoleForm.roleName == "" ||
        this.serproviderRoleForm.roleName == null
      ) {
        callback(new Error("请输入角色名"));
      } else if (this.serproviderRoleForm.roleName.length > 10) {
        callback(new Error("角色名不能大于10个字"));
      } else {
        checkNameIsExistServiceProvidersRole({
          roleName: this.serproviderRoleForm.roleName,
          id: this.$route.query.id ? this.$route.query.id : undefined
        }).then(data => {
          if (data.data.data) {
            callback(new Error("该角色名已存在，请重新输入"));
          } else {
            callback();
          }
        });
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            updateServiceProvidersRole(this.serproviderRoleForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success(data.data.msg);
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            addServiceProvidersRole(this.serproviderRoleForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success(data.data.msg);
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          }
        }
      });
    }
  }
};
</script>

<style lang='less'>
#editSerproviderRole {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        div {
          margin-left: 15px;
        }
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
  }
}
</style>