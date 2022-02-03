<template>
  <!-- 添加订单页 -->
  <div id="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>添加订单</span>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>

      <div class="add-content">
        <el-form :model="ruleForms" :rules="ruleses" ref="ruleForms" label-width="100px" class="demo-ruleForm">
          <el-form-item label="账号类型：" prop="type" required>
            <el-checkbox-group v-model="ruleForms.type">
              <el-checkbox label="新用户" name="type"></el-checkbox>
              <el-checkbox label="已有账号" name="type"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="手机号:" prop="phone">
            <el-input v-model="ruleForms.phone"></el-input>
          </el-form-item>

          <el-form-item label="昵称:" prop="nickName" required>
            <div>
              <span>{{nickName}}</span>
            </div>
          </el-form-item>
          <el-form-item label="支付方式：" prop="type2" required>
            <el-checkbox-group v-model="ruleForms.payType">
              <el-checkbox label="线上" name="type2"></el-checkbox>
              <el-checkbox label="线下" name="type2"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="金额" prop="money" >
            <el-input v-model="ruleForms.money">
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
          <el-form-item label="来源:" prop="from" required>
            <div>
              <span class="spa">{{from}}</span>
            </div>
          </el-form-item>
          <el-form-item label="商品:" prop="shop" required>
            <div>
              <span class="spa">自定义商品</span>
            </div>
          </el-form-item>
          <el-form-item label="备注:" prop="desc">
            <el-input type="textarea" v-model="ruleForms.desc" rows="6" show-word-limit></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForms')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      textarea: "",
      input: "",
      nickName: "dfsdf",
      from: "重庆市大渡口区城市运营中心",
      shop: "",
      ruleForms: {
        phone: "",
        money: "",
        desc: "",
        type: [],
        payType: []
      },
      ruleses: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在11数字", trigger: "blur" }
        ],
        money: [
          { required: true, message: "请输入金额", trigger: "blur" },
          { min: 1, max: 50, message: "请输入金额", trigger: "blur" }
        ],
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>
<style lang="less" scoped>
#add-page {
  padding: 20px;
    .clearfix{
display: flex;
justify-content: space-between;
align-items: center;
}
}
.add-content {
  margin: 0 auto;
  width: 500px;
}

.spa {
  color: #cccccc;
  margin-right: 20px;
  font-size: 12px;
}
.el-card .el-card__header{
  background: #f2f2f2 !important;
  height: 50px;
}
</style>