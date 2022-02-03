<template>
  <div id="addAlter">
    <!-- 店铺的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.id">修改店铺</span>
          <span class="title" v-else>添加店铺</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="supplierform" ref="supplierform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="名称">
            <el-input v-model="supplierform.supplierName"></el-input>
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="supplierform.supplierDesc"></el-input>
          </el-form-item>
          <el-form-item label="店铺头像">
            <upload-img
              @getimgArr="(imgarr)=>{this.supplierform.supplierIcon = imgarr}"
              :imgArr="this.supplierform.supplierIcon"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="店铺主图">
            <upload-img
              @getimgArr="(imgarr)=>{this.supplierform.supplierImage = imgarr}"
              :imgArr="this.supplierform.supplierImage"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="店铺描述">
            <wang-editor
              :value="supplierform.supplierDetails"
              @getHtmlFromWang="(value)=>{this.supplierform.supplierDetails = value}"
            ></wang-editor>
          </el-form-item>
          <el-form-item label="发货地址">
            <el-input v-model="supplierform.supplierAdress"></el-input>
          </el-form-item>
          <el-form-item label="联系电话1">
            <el-input v-model="supplierform.supplierPhoneOne"></el-input>
          </el-form-item>
          <el-form-item label="联系电话2">
            <el-input v-model="supplierform.supplierPhoneTwo"></el-input>
          </el-form-item>
          <el-form-item label="供应商综合评分">
            <el-input v-model="supplierform.supplierScore"></el-input>
          </el-form-item>
          <el-form-item label="用户评分">
            <el-input v-model="supplierform.userScore"></el-input>
          </el-form-item>
          <el-form-item label="服务评分">
            <el-input v-model="supplierform.serviceScore"></el-input>
          </el-form-item>
          <el-form-item label="物流评分">
            <el-input v-model="supplierform.logisticsScore"></el-input>
          </el-form-item>
          <!-- 还有一个添加用户的操作 返回用户id supplierUserId 传输这个值 -->
          <el-form-item label="用户名">
            <span v-if="this.$route.params.data">{{supplierform.supplierUserName}}</span>
            <el-input v-else v-model="supplierform.supplierUserName"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="supplierform.supplierUserPwd"></el-input>
          </el-form-item>
          <el-form-item label="类型">
            <el-radio-group v-model="supplierform.supplierType">
              <!-- label就是值 -->
              <el-radio :label="1">商家</el-radio>
              <el-radio :label="0">自营</el-radio>
            </el-radio-group>
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
import {
  getSupplierById,
  updateSupplier,
  addSupplier
} from "../../api/supplier";
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
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getSupplierById({ id: this.$route.query.id }).then(data => {
        if (data.data.status == 0) {
          this.supplierform = data.data.data;
        }
      });
    }
  },
  methods: {
    submitForm() {
      if (this.$route.query.id) {
        updateSupplier(this.supplierform).then(data => {
          if (data.data.status == 0) {
            this.$message({
              type: "success",
              message: "店铺修改成功",
              center: true
            });
            this.$router.go(-1);
          }
        });
      } else {
        addSupplier(this.supplierform).then(data => {
          if (data.data.status == 0) {
            this.$message({
              type: "success",
              message: "店铺添加成功",
              center: true
            });
            this.$router.go(-1);
          }
        });
      }
    },
    imgJoin(arr) {
      return arr.join(",");
    }
  },
  //是否有富文本编辑
  components: { uploadImg, wangEditor }
};
</script>

<style lang='less'>
#addAlter {
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
    .content {
      text-align: left;
      .img_box {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        img {
          width: 100px;
          height: 100px;
          margin-left: 25px;
        }
      }
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
</style>
