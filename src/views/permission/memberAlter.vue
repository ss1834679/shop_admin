<template>
  <div id="memberAlter">
    <!-- 成员的修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">修改成员</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="memberForm" ref="memberForm" label-width="120px">
          <el-form-item label="昵称">
            <el-input v-model="memberForm.fullName"></el-input>
          </el-form-item>
          <el-form-item label="用户姓名">
            <el-input v-model="memberForm.nickName"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="memberForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="数据范围">
            <el-radio-group v-model="memberForm.dataRange">
              <el-radio :label="0">全部</el-radio>
              <el-radio :label="1">部门</el-radio>
              <el-radio :label="2">个人</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="所属部门">
            <el-select v-model="memberForm.branchId" filterable placeholder="请选择部门(可搜索)">
              <el-option v-for="(item,index) in branchList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属角色">
            <el-cascader :options="roleLoginList" :show-all-levels="false" :props="props" v-model="roleId" clearable class="longlong"></el-cascader>
          </el-form-item>
          <el-form-item label="登录账号">
            <span>{{memberForm.username}}</span>
          </el-form-item>
          <el-form-item label="登录密码">
            <el-input v-model="memberForm.password" disabled></el-input>
          </el-form-item>
          <el-form-item label="成员备注">
            <el-input v-model="memberForm.userDesc" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getBranchListLogin, updateUser, getUserById, getRoleLogin } from "../../api/permission";
export default {
  data() {
    return {
      memberForm: {
        nickName: "" /* 用户姓名 */,
        fullName: "" /* 成员昵称 */,
        phone: "" /* 用户手机号码 */,
        icon: "5e58e7d096ad4c3634e1d8fd" /* 用户头像 */,
        dataRange: 0 /* 数据范围 0代表全部 1代表部门 2代表个人 */,
        branchId: "" /* 部门id */,
        username: "" /* 用户账号 */,
        password: "" /* 登录密码 */,
        userDesc: "" /* 用户介绍 */
      },
      roleId: [] /* 部门中的角色id */,
      branchList: [] /* 部门列表 */,
      roleLoginList: [],
      props: {
        multiple: true,
        expandTrigger: "hover",
        label: "name",
        emitPath: false,
        value: "id"
      }
    };
  },
  mounted() {
    getUserById(this.$route.query.id).then(data => {
      if (data.data.status == 200) {
        this.memberForm = data.data.content.sysUser;
        this.roleId = data.data.content.sysRoleList.map(item => {
          return item.id;
        });
      } else {
        this.$message.error("获取数据失败 请刷新页面");
      }
    });
    /* 获取部门列表 */
    getBranchListLogin().then(data => {
      if (data.data.status == 200) {
        this.branchList = data.data.content;
      }
    });
    getRoleLogin().then(data => {
      if (data.data.status == 200) {
        this.roleLoginList = this.exchangeRole(data.data.content);
      }
    });
  },
  methods: {
    /* 提交表单 */
    submitForm() {
      updateUser(this.roleId, this.memberForm).then(data => {
        if (data.data.status == 200) {
          this.$router.go(-1);
          this.$message({
            message: "修改成功",
            type: "success"
          });
        } else {
          throw data.data.msg;
        }
      });
    },
    exchangeRole(arr) {
      let arr2 = [];
      if (Array.isArray(arr) && arr.length > 0) {
        arr2 = arr.map(item => {
          let obj = {
            id: item.sysBranch.id,
            name: item.sysBranch.name,
            children: item.sysRoleList
          };
          return obj;
        });
      }
      return arr2;
    }
  }
};
</script>

<style lang='less'>
#memberAlter {
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
    .longlong {
      width: 100%;
    }
  }
}
</style>
