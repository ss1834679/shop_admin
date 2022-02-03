<template>
  <div id="memberAdd">
    <!-- 成员的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加成员</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="memberForm" ref="memberForm" :rules="memberRules" label-width="120px">
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
          <el-form-item label="所属部门" required prop="branchId">
            <el-select v-model="memberForm.branchId" filterable placeholder="请选择部门(可搜索)">
              <el-option v-for="(item,index) in branchList" :key="index" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属角色" required>
            <el-cascader :options="roleLoginList" :show-all-levels="false" :props="props" v-model="memberForm.roleId" clearable class="longlong"></el-cascader>
          </el-form-item>
          <el-form-item label="登录账号" required prop="username">
            <span>{{memberForm.username}}</span>
            <el-button @click="creatAUser()">获取未使用的登录名</el-button>
          </el-form-item>
          <el-form-item label="登录密码" required prop="password">
            <el-input v-model="memberForm.password"></el-input>
          </el-form-item>
          <el-form-item label="成员备注">
            <el-input v-model="memberForm.userDesc" type="textarea"></el-input>
          </el-form-item>
          <el-form-item>添加完成之后，剪切板中是当前用户的信息，请粘贴到文本妥善管理</el-form-item>
          <el-form-item>
            <el-button type="success" @click="submitForm('memberForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getBranchListLogin, insertUser, getRoleLogin, creatUsername } from "../../api/permission";
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
        roleId: [] /* 部门中的角色id */,
        username: "" /* 用户账号 */,
        password: "" /* 登录密码 */,
        userDesc: "" /* 用户介绍 */
      },
      memberRules: {
        branchId: [{ required: true, message: "请选择所属部门", trigger: "blur" }],
        username: [{ required: true, message: "请输入登录账户", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }]
      },
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          insertUser(this.memberForm).then(data => {
            if (data.data.status == 200) {
              this.$router.go(-1);
              this.$message({
                message: "添加成功",
                type: "success"
              });
              this.copyText(
                `用户姓名：${this.memberForm.nickName}  用户账号：${this.memberForm.username}  用户密码：${this.memberForm.password}`
              );
            } else {
              this.$message.error(data.data.msg);
            }
          });
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    },
    /* 获取不重复的用户名 */
    creatAUser() {
      creatUsername().then(data => {
        if (data.data.status == 200) {
          this.memberForm.username = data.data.content;
        } else {
          this.$message.error("生成失败，等一等吧");
        }
      });
    },
    copyText(text) {
      let textarea = document.createElement("textarea"); //创建input对象
      let bodyEle = document.getElementById("app");
      bodyEle.appendChild(textarea); //添加元素
      textarea.value = text;
      textarea.focus();
      if (textarea.setSelectionRange) {
        textarea.setSelectionRange(0, textarea.value.length); //获取光标起始位置到结束位置
      } else {
        textarea.select();
      }
      try {
        document.execCommand("copy"); //执行复制
      } catch (eo) {
        this.$message.error(eo);
      }
      bodyEle.removeChild(textarea); //删除元素
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
  },
  components: {}
};
</script>

<style lang='less'>
#memberAdd {
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
