<template>
  <div id="addTopic">
    <!-- 话题的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加话题</span>
        </div>
      </div>
      <!-- 话题的 表数据验证 -->
      <div class="content">
        <el-form :model="topicform" ref="topicform" :rules="topicRules" label-width="110px" class="demo-ruleForm">
          <el-form-item label="话题标题" required prop="name">
            <el-input v-model="topicform.name"></el-input>
          </el-form-item>
          <el-form-item label="话题描述" required prop="describes">
            <el-input v-model="topicform.describes"></el-input>
          </el-form-item>
          <el-form-item label="是否显示">
            <el-switch v-model="topicform.status" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item label="话题图片" required prop="img">
            <upload-img
              @getimgArr="(imgarr)=>{this.topicform.img = imgarr}"
              :imgArr="topicform.img"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('topicform')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import { insertOrUpdateChannel } from "../../api/circle";
export default {
  data() {
    return {
      topicform: {
        name: "" /* 话题名称 */,
        describes: "" /* 话题描述 */,
        img: "" /* 话题图片 */,
        status: true /* 是否显示 */
      },
      topicRules: {
        name: [{ required: true, message: "请填写话题名称", trigger: "blur" }],
        describes: [{ required: true, message: "请填写话题描述", trigger: "blur" }],
        img: [{ required: true, message: "请上传话题图片", trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      /* 添加话题 */
      this.$refs[formName].validate(valid => {
        if (valid) {
          insertOrUpdateChannel(this.topicform).then(data => {
            if (data.status == 200) {
              this.$message({
                type: "success",
                message: "添加话题成功"
              });
              this.$router.push({ name: "topic_Idx" });
            }
          });
        } else {
          this.$message({
            showClose: true,
            message: "请检查参数是否填写完整！！",
            type: "error"
          });
          return false;
        }
      });
    }
  },
  //是否有富文本编辑
  components: { uploadImg }
};
</script>

<style lang='less'>
#addTopic {
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
      .cascader {
        .el-form-item__content {
          .el-cascader {
            width: 100%;
          }
          span.remind {
            color: red;
          }
        }
      }
    }
  }
}
</style>
