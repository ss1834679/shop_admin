<template>
  <div id="editPromanage">
    <!-- 编辑项目经理-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">{{$route.params.routerTitle||"编辑项目经理"}}</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="promanageForm" ref="promanageForm" :rules="promanageRules" label-width="150px">
          <el-form-item label="项目经理名" prop="projectManagerName">
            <el-input v-model.trim="promanageForm.projectManagerName" placeholder="请输入项目经理名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="accountNum">
            <span v-if="$route.query.id">{{promanageForm.accountNum}}</span>
            <el-input v-else v-model="promanageForm.accountNum" placeholder="请输入手机号作为账号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="promanageForm.sort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <div class="infoItem">
            <p class="itemTitle">收款所需信息</p>
            <el-form-item label="账户性质" prop="acctType">
              <el-radio-group v-model="promanageForm.acctType">
                <el-radio label="BUSINESS">对公账户</el-radio>
                <el-radio label="PERSON">私人账户</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="promanageForm.acctType == 'PERSON'">
              <el-form-item label="真实姓名" prop="corName">
                <el-input v-model.trim="promanageForm.corName" placeholder="请输入服务商真实姓名" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="lePerId">
                <el-input v-model.trim="promanageForm.lePerId" placeholder="请输入身份证号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model.trim="promanageForm.mobile" placeholder="请输入联系电话" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="银行账号" prop="bankCardNo">
                <el-input v-model.trim="promanageForm.bankCardNo" placeholder="请输入银行账号" style="width:300px"></el-input>
              </el-form-item>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="身份证正面" prop="idcardfront">
                  <UploadImg :imgArr.sync="promanageForm.idcardfront" :limit="1" :notMultiple="true" />
                </el-form-item>
                <el-form-item label="身份证反面" prop="idcardreverse">
                  <UploadImg :imgArr.sync="promanageForm.idcardreverse" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
            </template>
            <template v-if="promanageForm.acctType == 'BUSINESS'">
              <el-form-item label="法人姓名" prop="corpName">
                <el-input v-model.trim="promanageForm.corpName" placeholder="请输入服务商法人姓名" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证号" prop="legPerId">
                <el-input v-model.trim="promanageForm.legPerId" placeholder="请输入法人身份证号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model.trim="promanageForm.mobile" placeholder="请输入联系电话" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="对公银行账号" prop="bankCardNo">
                <el-input v-model.trim="promanageForm.bankCardNo" placeholder="请输入对公银行账号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="税务登记号" prop="taxCert">
                <el-input v-model.trim="promanageForm.taxCert" placeholder="请输入税务登记号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码" prop="orgCode">
                <el-input v-model.trim="promanageForm.orgCode" placeholder="请输入组织机构代码" style="width:300px"></el-input>
              </el-form-item>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="身份证正面" prop="idcardfront">
                  <UploadImg :imgArr.sync="promanageForm.idcardfront" :limit="1" :notMultiple="true" />
                </el-form-item>
                <el-form-item label="身份证反面" prop="idcardreverse">
                  <UploadImg :imgArr.sync="promanageForm.idcardreverse" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="营业执照" prop="certificate">
                  <UploadImg :imgArr.sync="promanageForm.certificate" :limit="1" :notMultiple="true" />
                </el-form-item>
                <el-form-item label="税务登记证" prop="authority">
                  <UploadImg :imgArr.sync="promanageForm.authority" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="组织机构代码证" prop="organization">
                  <UploadImg :imgArr.sync="promanageForm.organization" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
            </template>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('promanageForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { editProjectManager, getProjectManagerOne } from "../../../api/trim";
import UploadImg from "../../../components/uploadImg";
import { openAccount } from "../../../api/pay";
export default {
  components: { UploadImg },
  data() {
    return {
      promanageForm: {
        /* 项目经理数据 */
        projectManagerName: "",
        sort: undefined,
        accountNum: "",
        acctType: "BUSINESS" /* 个人: PERSON 企业: BUSINESS */,
        corpName: "" /* 法人名称 */,
        corName: "" /* 真实姓名 */,
        legPerId: "" /* 法人身份证号 */,
        lePerId: "" /* 身份证号 */,
        mobile: "" /* 联系电话 */,
        bankCardNo: "" /* 对公银行账号 */,
        taxCert: "" /* 税务登记号 */,
        orgCode: "" /* 组织机构代码 */,
        idcardfront: "" /* 身份证正面 */,
        idcardreverse: "" /* 身份证反面 */,
        certificate: "" /* 营业执照 */,
        authority: "" /* 税务登记证 */,
        organization: "" /* 组织机构代码证 */
      },
      promanageRules: {},
      showImg: true
    };
  },
  created() {
    this.promanageRules = {
      projectManagerName: [
        { required: true, message: "请输入项目经理名", trigger: "blur" },
        { min: 0, max: 10, message: "项目经理名不能大于10个字", trigger: "blur" }
      ],
      accountNum: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: this.$checkPhone, trigger: "blur" }
      ],
      sort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
      corpName: [{ required: true, message: "请输入法人姓名", trigger: "blur" }],
      corName: [{ required: true, message: "请输入真实姓名", trigger: "blur" }],
      legPerId: [{ required: true, message: "请输入法人身份证号", trigger: "blur" }, { validator: this.$checkCardId }],
      lePerId: [{ required: true, message: "请输入身份证号", trigger: "blur" }, { validator: this.$checkCardId }],
      mobile: [{ required: true, message: "请输入联系电话", trigger: "blur" }, { validator: this.$checkPhone }],
      bankCardNo: [
        { required: true, message: "请输入银行账号", trigger: "blur" },
        { validator: this.checkBankId, trigger: "change" }
      ],
      taxCert: [{ required: true, message: "请输入税务登记号", trigger: "blur" }],
      orgCode: [{ required: true, message: "请输入组织机构代码号", trigger: "blur" }],
      idcardfront: [{ required: true, message: "请上传身份证正面", trigger: "blur" }],
      idcardreverse: [{ required: true, message: "请上传身份证反面", trigger: "blur" }],
      certificate: [{ required: true, message: "请上传营业执照", trigger: "blur" }],
      authority: [{ required: true, message: "请上传税务登记证", trigger: "blur" }],
      organization: [{ required: true, message: "请上传组织机构代码证", trigger: "blur" }]
    };
  },
  mounted() {
    if (this.$route.query.id || this.$route.query.outUserId) {
      getProjectManagerOne({ id: this.$route.query.id, outUserId: this.$route.query.outUserId }).then(data => {
        if (data.data.status == 200) {
          let {
            accountNum,
            acctType,
            accountStatus,
            authority,
            bankCardNo,
            certificate,
            corpName,
            idcardfront,
            idcardreverse,
            legPerId,
            mobile,
            name,
            orgCode,
            organization,
            projectManagerName,
            sort,
            taxCert
          } = data.data.content;
          this.promanageForm = {
            projectManagerName: projectManagerName,
            sort: sort,
            accountNum: accountNum,
            acctType: acctType,
            accountStatus,
            corpName: acctType == "BUSINESS" ? corpName : "",
            corName: acctType == "BUSINESS" ? "" : corpName,
            legPerId: acctType == "BUSINESS" ? legPerId : "",
            lePerId: acctType == "BUSINESS" ? "" : legPerId,
            mobile: mobile,
            bankCardNo: bankCardNo,
            taxCert: taxCert,
            orgCode: orgCode,
            idcardfront: idcardfront,
            idcardreverse: idcardreverse,
            certificate: certificate,
            authority: authority,
            organization: organization
          };
          this.refreshImg();
        }
      });
    }
  },
  methods: {
    checkBankId(rule, value, callback) {
      if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(value)) {
        callback(new Error("请输入正确的银行账号"));
      } else {
        callback();
      }
    },
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editProjectManager({
            accountNum: this.promanageForm.accountNum,
            acctType: this.promanageForm.acctType,
            accountStatus: this.promanageForm.accountStatus,
            authority: this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.authority : undefined,
            bankCardNo: this.promanageForm.bankCardNo,
            certificate: this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.certificate : undefined,
            corpName:
              this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.corpName : this.promanageForm.corName,
            id: this.$route.query.id ? this.$route.query.id : undefined,
            idcardfront: this.promanageForm.idcardfront,
            idcardreverse: this.promanageForm.idcardreverse,
            legPerId:
              this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.legPerId : this.promanageForm.lePerId,
            mobile: this.promanageForm.mobile,
            orgCode: this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.orgCode : undefined,
            organization: this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.organization : undefined,
            projectManagerName: this.promanageForm.projectManagerName,
            sort: this.promanageForm.sort,
            taxCert: this.promanageForm.acctType == "BUSINESS" ? this.promanageForm.taxCert : undefined
          }).then(data => {
            if (data.data.status == 200) {
              if (this.$route.query.id) {
                this.$message.success("编辑成功");
                this.$router.go(-1);
              } else {
                openAccount({ outUserId: data.data.content, roleType: 3 }).then(res => {
                  window.open(res.data, "_blank");
                  this.$message.success("添加成功");
                  this.$router.go(-1);
                });
              }
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
#editPromanage {
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