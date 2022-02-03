<template>
  <div id="attrStyleAddAlter">
    <!-- 编辑商品风格-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑风格</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="styleForm" ref="styleForm" :rules="attrStyleRules" label-width="150px">
          <el-form-item label="风格名称" prop="name">
            <el-input v-model="styleForm.name" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <el-input-number v-model="styleForm.sort" :controls="false" :min="0" :max="10000"></el-input-number>
            <div style="font-size:13px;color:#888">数字越大前端显示越靠前，数字相同按添加时间先后排序</div>
          </el-form-item>
          <el-form-item label="商品类型：">{{this.$route.query.cateName}}</el-form-item>
          <el-form-item label="是否显示" class="is-required" prop="isShow">
            <el-radio-group v-model="styleForm.isShow">
              <el-radio :label="1">显示</el-radio>
              <el-radio :label="0">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('styleForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addGoodsStyle, editGoodsStyle, getGoodsStyleById } from "../../api/good";
export default {
  data() {
    return {
      styleForm: {
        /* 商品风格数据 */
        name: null,
        categoryId: null,
        sort: null,
        isShow: 1
      },
      attrStyleRules: {
        /* 添加风格输入验证 */
        name: [
          { required: true, message: "请输入风格名称", trigger: "blur" },
          { min: 0, max: 10, message: "风格名称不能大于10个字", trigger: "blur" }
        ],
        sort: [{ required: true, message: "请输入排序值", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      /* 编辑商品风格 */
      getGoodsStyleById(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.styleForm = data.data.data;
        } else {
          this.$message.error(data.data.msg);
        }
      });
    }
  },
  methods: {
    submitForm(styleForm) {
      this.$refs[styleForm].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            editGoodsStyle({
              id: this.styleForm.id,
              isShow: this.styleForm.isShow,
              name: this.styleForm.name,
              sort: this.styleForm.sort
            }).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            this.styleForm.categoryId = this.$route.query.cateId;
            addGoodsStyle(this.styleForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("添加成功");
                this.$router.go(-1);
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
#attrStyleAddAlter {
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