<template>
  <div id="editproprietor">
    <!-- 编辑业主-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">{{$route.params.routerTitle||"编辑业主"}}</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="proprietorForm" ref="proprietorForm" :rules="proprietorRules" label-width="150px">
          <el-form-item label="业主名" prop="name">
            <el-input v-model.trim="proprietorForm.name" placeholder="请输入业主名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <span v-if="$route.query.id">{{proprietorForm.account}}</span>
            <el-input v-else v-model="proprietorForm.account" placeholder="请输入手机号作为账号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="身份证号" prop="legPerId">
            <el-input v-model.trim="proprietorForm.legPerId" placeholder="请输入身份证号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="银行账号" prop="bankCardNo">
            <el-input v-model.trim="proprietorForm.bankCardNo" placeholder="请输入银行账号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="开户行" prop="bankOfDeposit">
            <el-input v-model.trim="proprietorForm.bankOfDeposit" placeholder="请输入开户行" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="ownerSort">
            <el-input-number v-model="proprietorForm.ownerSort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <div class="towPhoto" v-if="showImg">
            <el-form-item label="身份证正面" prop="idcardfront">
              <UploadImg :imgArr.sync="proprietorForm.idcardfront" :limit="1" :notMultiple="true" />
            </el-form-item>
            <el-form-item label="身份证反面" prop="idcardreverse">
              <UploadImg :imgArr.sync="proprietorForm.idcardreverse" :limit="1" :notMultiple="true" />
            </el-form-item>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('proprietorForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addOwner, getOwnerById, updateOwner } from "../../../api/trim";
import UploadImg from "../../../components/uploadImg";
import { openAccount } from "../../../api/pay";
export default {
  components: { UploadImg },
  data() {
    return {
      proprietorForm: {
        /* 业主数据 */
        name: "",
        ownerSort: undefined,
        account: "",
        legPerId: "" /* 身份证号 */,
        bankCardNo: "" /* 银行卡号 */,
        bankOfDeposit: "" /* 开户行 */,
        idcardfront: "" /* 个人身份证正面 */,
        idcardreverse: "" /* 个人身份证反面 */
      },
      proprietorRules: {},
      showImg: true
    };
  },
  created() {
    this.proprietorRules = {
      name: [
        { required: true, message: "请输入业主名", trigger: "blur" },
        { min: 0, max: 10, message: "业主名不能大于10个字", trigger: "blur" }
      ],
      account: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: this.$checkPhone, trigger: "change" }
      ],
      ownerSort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
      bankOfDeposit: [{ max: 200, message: "开户行不能大于200字", trigger: "blur" }],
      bankCardNo: [
        { required: true, message: "请输入银行账号", trigger: "blur" },
        { validator: this.checkBankId, trigger: "change" }
      ],
      legPerId: [
        { required: true, message: "请输入身份证号", trigger: "blur" },
        { validator: this.$checkCardId, trigger: "change" }
      ],
      idcardfront: [{ required: true, message: "请上传身份证正面", trigger: "blur" }],
      idcardreverse: [{ required: true, message: "请上传身份证反面", trigger: "blur" }]
    };
  },
  mounted() {
    if (this.$route.query.id || this.$route.query.outUserId) {
      getOwnerById({ id: this.$route.query.id, outUserId: this.$route.query.outUserId }).then(data => {
        if (data.data.status == 0) {
          this.proprietorForm = data.data.data;
          this.refreshImg();
        }
      });
    }
  },
  methods: {
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    checkBankId(rule, value, callback) {
      if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(value)) {
        callback(new Error("请输入正确的银行账号"));
      } else {
        callback();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            updateOwner(this.proprietorForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success(data.data.msg);
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            addOwner(this.proprietorForm).then(data => {
              if (data.data.status == 0) {
                openAccount({ outUserId: data.data.data, roleType: 1 }).then(res => {
                  window.open(res.data, "_blank");
                  this.$message.success("添加业主成功");
                  this.$router.go(-1);
                });
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
#editproprietor {
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
    .content {
      .infoItem {
        p.itemTitle {
          font-size: 16px;
          padding-left: 6px;
          position: relative;
        }
        p.itemTitle::before {
          display: block;
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background-color: red;
          content: "";
        }
      }
      .towPhoto {
        display: flex;
        flex-wrap: wrap;
      }
    }
  }
}
</style>