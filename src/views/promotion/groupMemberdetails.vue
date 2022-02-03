<template>
  <!-- 分销用户详情 -->
  <div class="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>分销用户详情</span>
      </div>

      <div class="add-content">
        <el-form :model="groupMemberdetailsForm" ref="groupMemberdetailsForm" :rules="markRules" label-width="140px" class="set">
          <el-form-item label="用户：" class="userdetails">
            <div class="list-item">
              <div class="imgbox">
                <img
                  :src="groupMemberdetailsForm.avatar.includes('http')?`${groupMemberdetailsForm.avatar}`:`${base}${groupMemberdetailsForm.avatar}`"
                />
              </div>
              <div class="userdetils">
                <span class="nickname">{{groupMemberdetailsForm.nickname}}</span>
                <div>
                  <span>{{groupMemberdetailsForm.phone}}</span>
                </div>
              </div>
            </div>
          </el-form-item>
          <el-form-item label="上级：" class="userdetails">
            <div
              class="list-item"
              v-if="groupMemberdetailsForm.superiorAvatar||groupMemberdetailsForm.superiorNickname||groupMemberdetailsForm.superiorPhone"
            >
              <div class="imgbox">
                <img
                  :src="groupMemberdetailsForm.superiorAvatar.includes('http')?`${groupMemberdetailsForm.superiorAvatar}`:`${base}${groupMemberdetailsForm.superiorAvatar}`"
                />
              </div>
              <div class="userdetils">
                <span class="nickname">{{groupMemberdetailsForm.superiorNickname}}</span>
                <div>
                  <span>{{groupMemberdetailsForm.superiorPhone}}</span>
                </div>
              </div>
            </div>
            <div v-else style="line-height: 80px">平台</div>
          </el-form-item>
          <el-form-item label="注册时间：">
            <span>{{groupMemberdetailsForm.registrationTime}}</span>
          </el-form-item>
          <el-form-item label="成为分销时间：">
            <span>{{groupMemberdetailsForm.distributionTime}}</span>
          </el-form-item>
          <el-form-item label="当前个人业绩：">
            <span>{{"¥"+(groupMemberdetailsForm.resultsAmount/100).toFixed(2)}}</span>
          </el-form-item>
          <el-form-item label="当前可提现金额：">
            <span>{{"¥"+(groupMemberdetailsForm.withdrawalAmount/100).toFixed(2)}}</span>
          </el-form-item>
          <el-form-item label="累计提现：">
            <span>{{"¥"+(groupMemberdetailsForm.extractAmount/100).toFixed(2)}}</span>
          </el-form-item>
          <el-form-item label="推广订单数：">
            <span>{{groupMemberdetailsForm.orderNumber}}</span>
          </el-form-item>
          <el-form-item label="备注：" prop="agreement" class="is-required">
            <el-input type="textarea" :rows="3" style="width:300px" v-model="form.mark"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('groupMemberdetailsForm')">提交</el-button>
            <el-button type="primary" @click="$router.go(-1)">返回列表</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getGroupMemberDetail, updatePerformanceMark } from "../../api/distribuManage";
export default {
  data() {
    return {
      groupMemberdetailsForm: {
        nickname: "" /* 用户昵称 */,
        phone: "" /* 用户账号 */,
        avatar: "" /* 用户头像 */,
        superiorNickname: "" /* 上级用户昵称 */,
        superiorPhone: "" /* 上级用户账号 */,
        superiorAvatar: "" /* 上级用户头像 */,
        registrationTime: "" /* 注册时间 */,
        distributionTime: "" /* 成为分销时间 */,
        resultsAmount: "" /* 个人业绩 */,
        withdrawalAmount: 0 /* 可提现金额 */,
        extractAmount: 0 /* 累计提现金额 */,
        orderNumber: 0 /* 推广订单数 */,
        mark: "" /* 备注 */,
        level: 1 /* 等级 */
      },
      form: {
        mark: "",
        id: ""
      },
      base: "",
      markRules: {
        mark: [{ required: true, message: "请填写备注" }]
      }
    };
  },
  mounted() {
    this.base = this.$store.state.base_url;
    getGroupMemberDetail(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        this.groupMemberdetailsForm = data.data.data;
        this.form.id = this.groupMemberdetailsForm.uid;
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.form.id != "" && this.form.mark != "") {
            updatePerformanceMark(this.form).then(data => {
              if (data.data.status == 0) {
                this.$message({ type: "success", message: "编辑成功" });
              } else {
                this.$message.error("编辑失败");
              }
            });
          } else {
            this.$message.warning("信息不全");
          }
        } else {
          this.$message.error("请检查是否填完所有参数");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="less">
.add-page {
  .set {
    .el-form-item {
      margin-bottom: 8px;
    }
  }
  .userdetails {
    .el-form-item__content {
      height: 80px;
    }
    .el-form-item__label {
      height: 80px;
      line-height: 80px;
    }
  }
  .list-item {
    height: 100%;
    display: flex;
    align-items: center;
    .imgbox {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      border: none;
      overflow: hidden;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .userdetils {
      height: 80px;
      margin-left: 10px;
      display: flex;
      flex-direction: column;
      .nickname {
        display: inline-block;
        max-width: 100px;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card .el-card__header {
    background: #f2f2f2 !important;
    height: 50px;
  }
}
</style>