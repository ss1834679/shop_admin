<template>
  <div id="addAlter">
    <!-- 优惠券的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.params.data">修改优惠券</span>
          <span class="title" v-else>添加优惠券</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="couponform" ref="couponform" label-width="120px" class="demo-ruleForm">
          <el-form-item label="优惠券名称">
            <el-input v-model="couponform.couponName"></el-input>
          </el-form-item>
          <el-form-item label="优惠券起始时间">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="优惠券金额(分为单位)">
            <el-input v-model.number="couponform.couponPrice" placeholder="满减的金额" class="red">
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="优惠券金额满减(分为单位)">
            <el-input v-model.number="couponform.couponFullMoney" placeholder="满减所需的金额" class="red">
              <template slot="append">分</template>
            </el-input>
          </el-form-item>
          <el-form-item label="优惠券图片">
            <upload-img
              @getimgArr="(imgarr)=>{this.couponform.couponImg = imgarr}"
              :imgArr="this.couponform.couponImg"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="优惠券类型">
            <el-radio-group v-model="couponform.couponType">
              <el-radio :label="'1'">满减券</el-radio>
              <el-radio :label="'2'">叠加满减券</el-radio>
              <el-radio :label="'3'">无门槛券</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠券可用于">
            <el-radio-group v-model="couponform.couponUsed">
              <el-radio :label="'1'">商品</el-radio>
              <el-radio :label="'2'">个人</el-radio>
              <el-radio :label="'3'">设计师</el-radio>
              <el-radio :label="'4'">家政</el-radio>
              <el-radio :label="'5'">全场</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="优惠券说明">
            <el-input v-model="couponform.couponRemarks"></el-input>
          </el-form-item>
          <el-form-item label="优惠券数量">
            <el-input v-model.number="couponform.couponQuota"></el-input>
          </el-form-item>
          <el-form-item label="优惠券状态">
            <el-radio-group v-model="couponform.couponStatus">
              <el-radio :label="'0'">无效</el-radio>
              <el-radio :label="'1'">有效</el-radio>
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
export default {
  data() {
    return {
      couponform: {
        couponName: "" /* 优惠券名称 */,
        couponImg: "" /* 优惠券图片地址 */,
        couponPrice: null /* 优惠券金额单位到分 */,
        couponStart: "" /* 优惠券开始时间 */,
        couponEnd: "" /* 优惠券结束时间 */,
        couponStatus: '1' /* 0无效 1有效 */,
        couponRemarks: "" /* 优惠券说明 */,
        couponQuota: 0 /* 优惠券数量 */,
        couponFullMoney: null /* 优惠券金额满减 */,
        couponType: '1' /* 优惠券类型 1满减券 2叠加满减券 3无门槛券(需要限制大小) */,
        couponUsed: '1' /* 可用于：1商品 2工人 3设计师 4家政 5全场 */,
        isDelete: 0 /* 是否删除 */
      },
      timeRange: [] /* 起始时间 */
    };
  },
  watch: {
    timeRange: {
      handler() {
        console.log(this.timeRange);
        this.couponform.couponStart = this.timeRange[0];
        this.couponform.couponEnd = this.timeRange[1];
      }
    }
  },
  mounted() {
    if (this.$route.params.data) {
      this.couponform = this.$route.params.data;
      console.log(this.$route.params.data);
    }
  },
  methods: {
    submitForm() {
      if (this.$route.params.data) {
        this.couponform.id = this.$route.params.data.id;
        console.log(this.$route.params.data.id);
      }
      console.log(this.couponform);
      //   addProduct(this.productform).then(res => {
      //     if (res.data.status == 0) {
      //       this.$message({
      //         type: "success",
      //         message: "商品添加成功",
      //         center: true
      //       });
      //       this.$router.go(-1);
      //     }
      //   });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  //是否有富文本编辑
  components: { uploadImg }
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
