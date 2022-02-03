<template>
  <div id="tbinformation-add">
    <!-- 编辑资讯 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑资讯</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="tbinformationAddForm" ref="tbinformationAddForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="资讯标题" required prop="newsTitle">
            <el-input v-model="tbinformationAddForm.newsTitle"></el-input>
          </el-form-item>
          <el-form-item label="部门:" required>
            <el-select v-model="tbinformationAddForm.department" placeholder="选择部门">
              <el-option v-for="(item,idx) in departmentList" :key="idx" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="显示设置" required prop="isDisplay">
            <el-switch v-model="tbinformationAddForm.isDisplay" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
          </el-form-item>
          <el-form-item v-if="showImg" label="资讯图片" required prop="newsImagePath">
            <upload-img
              @getimgArr="(imgarr)=>{this.tbinformationAddForm.newsImagePath = imgarr}"
              :imgArr="this.tbinformationAddForm.newsImagePath"
              :limit="1"
            ></upload-img>
          </el-form-item>
          <el-form-item label="资讯描述:" required prop="newsDesc">
            <el-input v-model="tbinformationAddForm.newsDesc" type="textarea" :rows="5" width="60%"></el-input>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="资讯正文" required prop="newsContent">
            <wang-editor :value="tbinformationAddForm.newsContent" @getHtmlFromWang="(value)=>{this.tbinformationAddForm.newsContent=value}"></wang-editor>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item>
            <el-button type="primary" @click="submitForm2('tbinformationAddForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import uploadImg from "../../components/uploadImg";
import wangEditor from "../../components/wangEditor";
import { editNews, getNewDetailBy } from "../../api/tbinformation";
export default {
  components: {
    uploadImg,
    wangEditor
  },
  data() {
    return {
      tbinformationAddForm: {
        isDisplay: true /* 是否显示 */,
        department: "", /* 部门 */
        newsContent: "" /* 富文本 灵感内容 */,
        newsTitle: "" /* 资讯标题 */,
        newsImagePath: "",/* 资讯图片 */
        newsDesc: "",
        id: ""
      },
      showImg: true,
      departmentList: [{ label: "公关部", value: "公关部" }],
      appendShow: true
    };
  },
  watch: {},
  mounted() {
    if (this.$route.query.id) {
      getNewDetailBy({ newId: this.$route.query.id }).then(data => {
        if (data.status == 200) {
          this.tbinformationAddForm = data.data.content;
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
    submitForm2(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          editNews(this.tbinformationAddForm).then(data => {
            if (data.status == 200) {
              this.$router.push({ name: "tbinformation-idx" });
              this.$message({
                type: "success",
                message: "编辑成功"
              });
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          this.$message.error("请检查参数是否填写完整！！");
          return false;
        }
      });
    }
  }
};
</script>

<style lang='less'>
#tbinformation-add {
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
      .relatGoodsbox {
        height: 300px;
        display: flex;
        .relatGoodsRight {
          width: 700px;
          border: 1px solid #ccc;
          border-radius: 4px;
          text-align: center;
          overflow-y: scroll;
          label.el-checkbox {
            display: block;
            text-align: left;
            margin-left: 10px;
            margin-right: 0px;
            border-bottom: 1px solid #ccc;
          }
        }
      }
    }
  }
}
</style>
