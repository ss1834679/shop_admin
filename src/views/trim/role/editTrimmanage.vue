<template>
  <div id="editTrimmanage">
    <!-- 编辑装修管家-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑装修管家</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="trimmanageForm" ref="trimmanageForm" :rules="trimmanageRules" label-width="150px">
          <el-form-item label="管家名" prop="houseKeeperName">
            <el-input v-model.trim="trimmanageForm.houseKeeperName" placeholder="请输入管家名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="accountNum">
            <span v-if="$route.query.id">{{trimmanageForm.accountNum}}</span>
            <el-input v-else v-model="trimmanageForm.accountNum" placeholder="请输入手机号作为账号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="trimmanageForm.sort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('trimmanageForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getHouseKeeperOne, editHouseKeeper } from "../../../api/trim";
export default {
  data() {
    return {
      trimmanageForm: {
        /* 装修管家数据 */
        houseKeeperName: "",
        sort: undefined,
        accountNum: ""
      },
      trimmanageRules: {}
    };
  },
  created() {
    this.trimmanageRules = {
      houseKeeperName: [
        { required: true, message: "请输入管家名", trigger: "blur" },
        { min: 0, max: 10, message: "管家名不能大于10个字", trigger: "blur" }
      ],
      accountNum: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: this.$checkPhone, trigger: "blur" }
      ],
      sort: [{ required: true, message: "请输入排序值", trigger: "blur" }]
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getHouseKeeperOne(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.trimmanageForm = data.data.content;
        }
      });
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editHouseKeeper(this.trimmanageForm).then(data => {
            if (data.data.status == 200) {
              this.$message.success("编辑成功");
              this.$router.go(-1);
            } else {
              this.$message.error(data.data.msg);
            }
          });
        }
      });
    }
  }
};
</script>

<style lang='less'>
#editTrimmanage {
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