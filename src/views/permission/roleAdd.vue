<template>
  <div id="addAlter">
    <!-- 角色的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加角色</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="form.sysRole" ref="sysRole" :rules="roleRules" label-width="120px" class="demo-ruleForm">
          <div class="steps" v-show="active==0">
            <el-form-item label="角色名称" required prop="name">
              <el-input v-model="form.sysRole.name"></el-input>
            </el-form-item>
            <el-form-item label="角色状态" required>
              <switch-com :boolen="form.sysRole.status" @changeValue="(value)=>{this.form.sysRole.status=value}"></switch-com>
            </el-form-item>
            <el-form-item label="分配菜单" class="editOptional" required>
              <menu-table @getMenu="(value)=>{this.form.menu=value}"></menu-table>
            </el-form-item>
          </div>
          <div class="steps" v-show="active==1">
            <el-form-item label="分配权限" class="editOptional" required>
              <permission-table @getPermission="(value)=>{this.form.permission=value}"></permission-table>
            </el-form-item>
          </div>
        </el-form>
        <div class="gosteps">
          <el-button type="success" v-if="active!=0" plain @click="goSteps('prev')">上一步</el-button>
          <el-button type="success" v-if="active!=1" @click="goSteps('next')">分配权限</el-button>
          <el-button type="success" v-if="active==1" @click="submitForm('sysRole')">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import switchCom from "../../components/switch";
import menuTable from "../../components/menuTableOne";
import permissionTable from "../../components/permissionTableOne";
import { insertRole } from "../../api/permission";
export default {
  data() {
    return {
      form: {
        sysRole: {
          name: "" /* 角色名称 */,
          status: 1 /* 状态 0代表停用 1代表启用 */,
          branchId: "" /* 部门id */
        },
        permission: [] /* 权限数组 */,
        menu: [] /* 菜单数组 */
      },
      active: 0 /* 步骤 */,
      roleRules: {
        name: [{ required: true, message: "请填写角色名称", trigger: "blur" }],
        goodsTitle: [{ required: true, message: "请填写商品名称", trigger: "blur" }],
        goodsSubtitle: [{ required: true, message: "请填写商品简介", trigger: "blur" }]
      }
    };
  },
  mounted() {},
  methods: {
    /* 提交表单 */
    submitForm(formName) {
      this.form.sysRole.branchId = this.$route.query.branchId;
      this.$refs[formName].validate(valid => {
        if (valid) {
          insertRole(this.form)
            .then(data => {
              if (data.data.status == 200) {
                this.$message({
                  message: "添加成功",
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
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
        } else {
          this.$message({
            showClose: true,
            message: "请检查参数是否填写完整！！",
            type: "error"
          });
          return false;
        }
      });
    },
    /* 上一步 下一步 */
    goSteps(type) {
      if (type == "prev") {
        this.active--;
      } else if (type == "next") {
        this.active++;
      }
    },
    /* 获取菜单转化格式 */
    initMenu(arr) {
      if (Array.isArray(arr)) {
        let arr1 = new Array(arr.length);
        arr.forEach((item, index) => {
          arr1[index] = item.sysMenu;
          arr1[index]["children"] = this.initMenu(item.menuModelList);
        });
        return arr1;
      } else {
        return null;
      }
    }
  },
  components: { switchCom, menuTable, permissionTable }
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
    }
  }
}
</style>
