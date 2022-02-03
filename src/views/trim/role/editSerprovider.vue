<template>
  <div id="editSerprovider">
    <!-- 编辑服务商-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">{{$route.params.routerTitle||"编辑服务商"}}</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="serproviderForm" ref="serproviderForm" :rules="serproviderRules" label-width="150px">
          <el-form-item label="服务商名" prop="name">
            <el-input v-model.trim="serproviderForm.name" placeholder="请输入服务商名称" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="账号" prop="account">
            <span v-if="$route.query.id">{{serproviderForm.account}}</span>
            <el-input v-else v-model.trim="serproviderForm.account" placeholder="请输入手机号" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="服务商角色" prop="roleId">
            <el-select v-model="serproviderForm.roleId" placeholder="请选择角色">
              <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="排序" prop="serviceProvidersSort">
            <el-input-number v-model="serproviderForm.serviceProvidersSort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <div class="infoItem">
            <p class="itemTitle">收款所需信息</p>
            <el-form-item label="账户性质" prop="acctType">
              <el-radio-group v-model="serproviderForm.acctType">
                <el-radio label="BUSINESS">对公账户</el-radio>
                <el-radio label="PERSON">私人账户</el-radio>
              </el-radio-group>
            </el-form-item>
            <template v-if="serproviderForm.acctType == 'PERSON'">
              <el-form-item label="真实姓名" prop="corName">
                <el-input v-model.trim="serproviderForm.corName" placeholder="请输入服务商真实姓名" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="身份证号" prop="lePerId">
                <el-input v-model.trim="serproviderForm.lePerId" placeholder="请输入身份证号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model.trim="serproviderForm.mobile" placeholder="请输入联系电话" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="银行账号" prop="bankCardNo">
                <el-input v-model.trim="serproviderForm.bankCardNo" placeholder="请输入银行账号" style="width:300px"></el-input>
              </el-form-item>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="身份证正面" prop="idcardfront">
                  <UploadImg :imgArr.sync="serproviderForm.idcardfront" :limit="1" :notMultiple="true" />
                </el-form-item>
                <el-form-item label="身份证反面" prop="idcardreverse">
                  <UploadImg :imgArr.sync="serproviderForm.idcardreverse" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
            </template>
            <template v-if="serproviderForm.acctType == 'BUSINESS'">
              <el-form-item label="法人姓名" prop="corpName">
                <el-input v-model.trim="serproviderForm.corpName" placeholder="请输入服务商法人姓名" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="法人身份证号" prop="legPerId">
                <el-input v-model.trim="serproviderForm.legPerId" placeholder="请输入法人身份证号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="联系电话" prop="mobile">
                <el-input v-model.trim="serproviderForm.mobile" placeholder="请输入联系电话" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="对公银行账号" prop="bankCardNo">
                <el-input v-model.trim="serproviderForm.bankCardNo" placeholder="请输入对公银行账号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="税务登记号" prop="taxCert">
                <el-input v-model.trim="serproviderForm.taxCert" placeholder="请输入税务登记号" style="width:300px"></el-input>
              </el-form-item>
              <el-form-item label="组织机构代码" prop="orgCode">
                <el-input v-model.trim="serproviderForm.orgCode" placeholder="请输入组织机构代码" style="width:300px"></el-input>
              </el-form-item>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="身份证正面" prop="idcardfront">
                  <UploadImg :imgArr.sync="serproviderForm.idcardfront" :limit="1" :notMultiple="true" />
                </el-form-item>
                <el-form-item label="身份证反面" prop="idcardreverse">
                  <UploadImg :imgArr.sync="serproviderForm.idcardreverse" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="营业执照" prop="certificate">
                  <UploadImg :imgArr.sync="serproviderForm.certificate" :limit="1" :notMultiple="true" />
                </el-form-item>
                <el-form-item label="税务登记证" prop="authority">
                  <UploadImg :imgArr.sync="serproviderForm.authority" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
              <div class="towPhoto" v-if="showImg">
                <el-form-item label="组织机构代码证" prop="organization">
                  <UploadImg :imgArr.sync="serproviderForm.organization" :limit="1" :notMultiple="true" />
                </el-form-item>
              </div>
            </template>
          </div>
          <el-form-item>
            <el-button type="primary" @click="submitForm('serproviderForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  addServiceProviders,
  getServiceProvidersRoleSelect,
  checkAccountIsExistServiceProviders,
  getServiceProvidersById,
  updateServiceProviders
} from "../../../api/trim";
import UploadImg from "../../../components/uploadImg";
import { openAccount } from "../../../api/pay";
export default {
  components: { UploadImg },
  data() {
    return {
      serproviderForm: {
        /* 服务商数据 */
        name: "" /* 服务商名 */,
        account: "" /* 账号 */,
        roleId: "" /* 角色id */,
        serviceProvidersSort: undefined /* 排序 */,
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
      roleList: [] /* 角色选择列表 */,
      trimmanageRules: {},
      showImg: true
    };
  },
  created() {
    this.serproviderRules = {
      name: [
        { required: true, message: "请输入服务商名", trigger: "blur" },
        { min: 0, max: 10, message: "服务商名不能大于10个字", trigger: "blur" }
      ],
      account: [
        { required: true, message: "请输入手机号", trigger: "blur" },
        { validator: this.$checkPhone },
        { validator: this.checkIsExit, trigger: "change" }
      ],
      roleId: [{ required: true, message: "请选择服务商角色", trigger: "blur" }],
      serviceProvidersSort: [{ required: true, message: "请输入排序值", trigger: "blur" }],
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
      getServiceProvidersById({ id: this.$route.query.id, outUserId: this.$route.query.outUserId }).then(data => {
        if (data.data.status == 0) {
          let {
            account,
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
            roleId,
            serviceProvidersSort,
            taxCert
          } = data.data.data;
          this.serproviderForm = {
            name: name,
            account: account,
            accountStatus,
            roleId: roleId,
            serviceProvidersSort: serviceProvidersSort,
            acctType: acctType,
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
    getServiceProvidersRoleSelect().then(data => {
      if (data.data.status == 0) {
        this.roleList = data.data.data;
      }
    });
  },
  methods: {
    checkBankId(rule, value, callback) {
      if (!/^([1-9]{1})(\d{15}|\d{18})$/.test(value)) {
        callback(new Error("请输入正确的银行账号"));
      } else {
        callback();
      }
    },
    checkIsExit(rule, value, callback) {
      checkAccountIsExistServiceProviders({ account: value, id: this.$route.query.id }).then(data => {
        if (data.data.data) {
          callback(new Error("该账号已成为服务商，请重新输入"));
        } else {
          callback();
        }
      });
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
          if (this.$route.query.id) {
            updateServiceProviders({
              id: this.$route.query.id,
              account: this.serproviderForm.account,
              acctType: this.serproviderForm.acctType,
              accountStatus: this.serproviderForm.accountStatus,
              authority: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.authority : undefined,
              bankCardNo: this.serproviderForm.bankCardNo,
              certificate: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.certificate : undefined,
              corpName:
                this.serproviderForm.acctType == "BUSINESS"
                  ? this.serproviderForm.corpName
                  : this.serproviderForm.corName,
              idcardfront: this.serproviderForm.idcardfront,
              idcardreverse: this.serproviderForm.idcardreverse,
              legPerId:
                this.serproviderForm.acctType == "BUSINESS"
                  ? this.serproviderForm.legPerId
                  : this.serproviderForm.lePerId,
              mobile: this.serproviderForm.mobile,
              name: this.serproviderForm.name,
              orgCode: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.orgCode : undefined,
              organization: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.organization : undefined,
              roleId: this.serproviderForm.roleId,
              serviceProvidersSort: this.serproviderForm.serviceProvidersSort,
              taxCert: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.taxCert : undefined
            }).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改服务商成功");
                this.$router.push({ name: "trimSerprovider" });
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            addServiceProviders({
              account: this.serproviderForm.account,
              acctType: this.serproviderForm.acctType,
              authority: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.authority : undefined,
              bankCardNo: this.serproviderForm.bankCardNo,
              certificate: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.certificate : undefined,
              corpName:
                this.serproviderForm.acctType == "BUSINESS"
                  ? this.serproviderForm.corpName
                  : this.serproviderForm.corName,
              idcardfront: this.serproviderForm.idcardfront,
              idcardreverse: this.serproviderForm.idcardreverse,
              legPerId:
                this.serproviderForm.acctType == "BUSINESS"
                  ? this.serproviderForm.legPerId
                  : this.serproviderForm.lePerId,
              mobile: this.serproviderForm.mobile,
              name: this.serproviderForm.name,
              orgCode: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.orgCode : undefined,
              organization: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.organization : undefined,
              roleId: this.serproviderForm.roleId,
              serviceProvidersSort: this.serproviderForm.serviceProvidersSort,
              taxCert: this.serproviderForm.acctType == "BUSINESS" ? this.serproviderForm.taxCert : undefined
            }).then(data => {
              if (data.data.status == 0) {
                openAccount({ outUserId: data.data.data, roleType: 2 }).then(res => {
                  window.open(res.data, "_blank");
                  this.$message.success("添加服务商成功");
                  this.$router.push({ name: "trimSerprovider" });
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
#editSerprovider {
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