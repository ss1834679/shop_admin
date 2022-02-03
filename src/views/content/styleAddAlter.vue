<template>
  <div id="styleAddAlter">
    <!-- 编辑风格-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">编辑风格</span>
        <div>
          <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
        </div>
      </div>
      <div class="content">
        <el-form :model="styleForm" ref="styleForm" :rules="houseStyleCategoryRules" label-width="150px">
          <el-form-item label="风格名称" prop="title">
            <el-input v-model="styleForm.title" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序:" prop="sort">
            <el-input-number v-model="styleForm.sort" :controls="false" :min="0" :max="1000000"></el-input-number>
            <div style="font-size:13px;color:#888">数字越大前端显示越靠前，数字相同按添加时间先后排序</div>
          </el-form-item>
          <el-form-item label="上传图片：" v-if="showImg" prop="imageUrl">
            <upload-img @getimgArr="(imgarr)=>{this.styleForm.imageUrl = imgarr}" remindText="支持jpg、png，建议尺寸330px*220px" :imgArr="this.styleForm.imageUrl" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="是否显示" prop="status">
            <el-radio-group v-model="styleForm.status">
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
import { getOneDecorateStyle, saveDecorateStyle, updateDecorateStyle } from "../../api/promanage";
import uploadImg from "../../components/uploadImg";
export default {
  components: { uploadImg },
  data() {
    return {
      showImg: true,
      styleForm: {
        /* 户型风格数据 */
        imageUrl: "",
        title: "" /* 名称 */,
        sort: "" /* 排序 */,
        status: 1 /* 状态判断 */
      },
      houseStyleCategoryRules: {
        /* 添加风格输入验证 */
        title: [{ required: true, message: "请填写名称", trigger: "blur" }],
        sort: [{ required: true, message: "请输入排序，只能输入整数", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getOneDecorateStyle(this.$route.query.id).then(data => {
        if (data.data.status == 200) {
          this.styleForm = data.data.content;
          this.refreshImg();
        }
      });
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
    submitForm(styleForm) {
      this.$refs[styleForm].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            updateDecorateStyle(this.styleForm).then(data => {
              if (data.data.status == 200) {
                this.$message({ message: "修改成功", type: "success" });
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            saveDecorateStyle(this.styleForm).then(data => {
              if (data.data.status == 200) {
                this.$message({ message: "添加成功", type: "success" });
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
#styleAddAlter {
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
  }
}
</style>