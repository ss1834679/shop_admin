<template>
  <div id="houseStyleCategory_add">
    <!-- 添加风格分类-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">添加风格分类</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>

      <div class="content">
        <el-form
          :model="houseStyleCategoryForm"
          ref="houseStyleCategoryForm"
          :rules="houseStyleCategoryRules"
          label-width="150px"
          class="demo-ruleForm"
        >
          <el-form-item label="分类名称" prop="title">
            <el-input v-model="houseStyleCategoryForm.title" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <template slot-scope>
              <el-input placeholder="0" v-model="houseStyleCategoryForm.sort" style="width:300px"></el-input>
              <div style="font-size:13px;color:#888">数字越大前端显示越靠前，数字相同按添加时间先后排序</div>
            </template>
          </el-form-item>
          <el-form-item label="是否显示" prop="status">
            <el-radio-group v-model="houseStyleCategoryForm.status">
              <el-radio :label="'1'">显示</el-radio>
              <el-radio :label="'0'">隐藏</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="上传图片：" v-if="showImg" prop="imageUrl">
            <upload-img
              @getimgArr="(imgarr)=>{this.houseStyleCategoryForm.imageUrl = imgarr}"
              :imgArr="this.houseStyleCategoryForm.imageUrl"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('houseStyleCategoryForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import { addOrEditDecorateStyle } from "../../api/setings";
import uploadImg from "../../components/uploadImg";
export default {
  components: {
    uploadImg
  },
  data() {
    return {
      showImg: true,
      houseStyleCategoryForm: {
        /* 户型风格数据 */
        id: "",
        imageUrl: "",
        title: "" /* 名称 */,
        sort: "" /* 排序 */,
        status: "1" /* 状态判断 */
      },
      houseStyleCategoryRules: {
        /* 添加风格输入验证 */
        title: [{ required: true, message: "请填写名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序，只能输入整数", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.type == "2") {
      this.houseStyleCategoryForm = this.$route.query.rows;
      if (this.$route.query.rows.status == true) {
        this.houseStyleCategoryForm.status = "1";
      } else {
        this.houseStyleCategoryForm.status = "0";
      }
      this.refreshImg();
    }
  },
  methods: {
    // 刷新图片
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    },
    submitForm(houseStyleCategoryForm) {
      this.$refs[houseStyleCategoryForm].validate(valid => {
        if (valid) {
          if (this.$route.query.type == "1") {
            addOrEditDecorateStyle({
              title: this.houseStyleCategoryForm.title,
              imageUrl: this.houseStyleCategoryForm.imageUrl,
              sort: this.houseStyleCategoryForm.sort,
              status: this.houseStyleCategoryForm.status
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: data.data.data,
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: data.data.msg,
                  type: "error"
                });
              }
            });
          } else if (this.$route.query.type == "2") {
            addOrEditDecorateStyle({
              id: this.$route.query.rows.id,
              title: this.houseStyleCategoryForm.title,
              imageUrl: this.houseStyleCategoryForm.imageUrl,
              sort: this.houseStyleCategoryForm.sort,
              status: this.houseStyleCategoryForm.status
            }).then(data => {
              if (data.data.status == 0) {
                this.$message({
                  message: "修改成功",
                  type: "success"
                });
                this.$router.go(-1);
              } else {
                this.$message({
                  message: "修改失败",
                  type: "error"
                });
              }
            });
          }
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang='less'>
#houseStyleCategory_add {
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
        span.title {
          line-height: 50px;
          margin-left: 12px;
        }
      }
    }
    .content {
      //   width: 60%;
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
.se-box {
  width: 50%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
