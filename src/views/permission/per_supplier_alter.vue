<template>
  <div id="supplier_add">
    <!-- 供应商的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加供应商</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="supplierForm" ref="supplierForm" :rules="supplierAddRules" label-width="120px" class="demo-ruleForm">
          <el-form-item label="公司名称" required prop="companyName">
            <el-input v-model="supplierForm.companyName"></el-input>
          </el-form-item>
          <el-form-item label="公司描述">
            <el-input v-model="supplierForm.companyDesc"></el-input>
          </el-form-item>
          <el-form-item label="店铺类型" required prop="supplierType">
            <el-radio-group v-model="supplierForm.supplierType">
              <el-radio :label="0">自营</el-radio>
              <el-radio :label="1">入驻</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="店铺名称" required prop="supplierName">
            <el-input v-model="supplierForm.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="登录账号" required prop="username">
            <span>{{supplierForm.username}}</span>
            <el-button @click="creatAUser()">获取未使用的登录名</el-button>
          </el-form-item>
          <el-form-item label="登录密码" required prop="password">
            <el-input v-model="supplierForm.password"></el-input>
          </el-form-item>
          <el-form-item>添加完成之后，剪切板中是当前供应商的信息，请粘贴到文本妥善管理</el-form-item>
          <el-form-item>
            <el-button @click="submitForm('supplierForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { updateCompany, getCompanyById } from "../../api/permission";
export default {
  data() {
    return {
      supplierForm: {
        companyDesc: "" /* 公司描述 */,
        companyName: "" /* 公司名称 */,
        supplierType: 0 /* 店铺类型 0自营，1代表入驻 */,
        supplierName: "" /* 店铺名称 */,
        username: "",
        password: ""
      },
      s: {
        id: "",
        name: "",
        parentId: "1243456383387967488",
        isParent: false,
        level: 2,
        supplierId: "1245524430361731077",
        type: 1
      },
      supplierAddRules: {
        companyName: [{ required: true, message: "请填写公司名称", trigger: "blur" }],
        supplierType: [{ required: true, message: "请选择店铺类型" }],
        supplierName: [{ required: true, message: "请填写店铺名称" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getCompanyById(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.supplierForm = data.data.content;
        }
      });
    }
  },
  methods: {
    /* 获取不重复的用户名 */
    // creatAUser() {
    //   creatUsername().then(data => {
    //     if (data.data.status == 200) {
    //       this.supplierForm.username = data.data.content;
    //     } else {
    //       this.$message.error("生成失败，等一等吧");
    //     }
    //   });
    // },
    /* 提交表单 */
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateCompany(this.supplierForm).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "修改成功"
              });
              //   this.copyText(
              //     `公司名称：${this.supplierForm.companyName}  公司账号：${this.supplierForm.username}  公司密码：${this.supplierForm.password}`
              //   );
              this.$router.push({ name: "per_supplier_index" });
            } else {
              this.$message.error("修改失败");
            }
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
    }
    // copyText(text) {
    //   let textarea = document.createElement("textarea"); //创建input对象
    //   let bodyEle = document.getElementById("app");
    //   bodyEle.appendChild(textarea); //添加元素
    //   textarea.value = text;
    //   textarea.focus();
    //   if (textarea.setSelectionRange) {
    //     textarea.setSelectionRange(0, textarea.value.length); //获取光标起始位置到结束位置
    //   } else {
    //     textarea.select();
    //   }
    //   try {
    //     document.execCommand("copy"); //执行复制
    //   } catch (eo) {
    //     console.log(eo);
    //   }
    //   bodyEle.removeChild(textarea); //删除元素
    // }
  },
  components: {}
};
</script>

<style lang='less'>
#supplier_add {
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
  }
}
</style>
