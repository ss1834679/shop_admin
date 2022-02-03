<template>
  <div id="editSupplier">
    <!-- 店铺的修改 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <span class="title">修改店铺</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="supplierform" ref="supplierform" label-width="100px">
          <el-form-item label="名称">
            <el-input v-model="supplierform.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="supplierform.supplierDesc"></el-input>
          </el-form-item>
          <el-form-item label="店铺头像">
            <upload-img
              v-if="showImg"
              @getimgArr="(imgarr)=>{this.supplierform.supplierIcon = imgarr}"
              :imgArr="this.supplierform.supplierIcon"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="店铺主图">
            <upload-img
              v-if="showImg"
              @getimgArr="(imgarr)=>{this.supplierform.supplierImage = imgarr}"
              :imgArr="this.supplierform.supplierImage"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="店铺描述">
            <wang-editor :value="supplierform.supplierDetails" @getHtmlFromWang="(value)=>{this.supplierform.supplierDetails = value}"></wang-editor>
          </el-form-item>
          <el-form-item label="联系电话1">
            <el-input v-model="supplierform.supplierPhoneOne"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import uploadImg from "../../components/uploadImg";
import wangEditor from "../../components/wangEditor";
import { updateSupplier } from "../../api/supplier";
import { getSupplierLogin } from "../../api/supplier_per";
export default {
  data() {
    return {
      supplierform: {
        supplierName: "" /* 供应商名称 */,
        supplierDesc: "" /* 供应商简介 */,
        supplierIcon: "" /* 店铺LOGO */,
        supplierImage: "" /* 店铺轮播图 */,
        supplierUserId: "fafa" /* 供应商登录后台的用户 */,
        supplierUserName: "" /* 供应商登录后台的用户名 */,
        supplierUserPwd: "" /* 供应商登录后台的密码 */,
        supplierDetails: "" /* 店铺描述 富文本 */,
        supplierAdress: "" /* 供应商发货地址 */,
        supplierType: 0 /* 供应商类型，0代表自营，1代表商家 */,
        supplierPhoneOne: "" /* 供应商联系电话 */,
        supplierPhoneTwo: "" /* 供应商联系电话 */,
        supplierScore: 5 /* 供应商综合评分 */,
        userScore: 5 /* 用户评分 */,
        serviceScore: 5 /* 售后服务评分 */,
        logisticsScore: 5 /* 物流评分 */,
        isDelete: 0 /* 逻辑删除 */
      },
      showImg: true
    };
  },
  mounted() {
    getSupplierLogin().then(data => {
      if (data.data.status == 200) {
        this.supplierform = data.data.content;
        this.refreshImg();
      }
    });
  },
  methods: {
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    submitForm() {
      updateSupplier(this.supplierform).then(() => {
        this.$message({
          type: "success",
          message: "店铺修改成功"
        });
      });
    }
  },
  //是否有富文本编辑
  components: { uploadImg, wangEditor }
};
</script>

<style lang='less'>
#editSupplier {
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
