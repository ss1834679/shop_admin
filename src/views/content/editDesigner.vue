<template>
  <div id="editDesigner">
    <!-- 设计师编辑基本信息 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">设计师编辑基本信息</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>
      <div class="add-content">
        <el-form :model="designerForm" :rules="designerRules" ref="designerForm" label-width="120px" v-if="showForm">
          <el-form-item label="设计师姓名:" prop="name">
            <el-input v-model="designerForm.name"></el-input>
          </el-form-item>
          <el-form-item label="设计师等级:" prop="level">
            <el-select v-model="designerForm.level" placeholder="设计师等级">
              <el-option v-for="item in levelList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设计师图片:" prop="image">
            <upload-img @getimgArr="(imgarr)=>{this.designerForm.image = imgarr}" :imgArr="this.designerForm.image" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="设计师头像:" prop="head">
            <upload-img @getimgArr="(imgarr)=>{this.designerForm.head = imgarr}" :imgArr="this.designerForm.head" :limit="1" :notMultiple="true"></upload-img>
          </el-form-item>
          <el-form-item label="设计师简介：" prop="details">
            <el-input v-model="designerForm.details" type="textarea" :rows="3"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="text" @click="()=>{this.designerVisible = true}">查看对应位置</el-button>
            <el-button type="primary" @click="submitForm('designerForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
      <el-dialog title="设计师信息效果" :visible.sync="designerVisible" center>
        <img :src="base_url+'5e90350575555a5b59de1bde'" alt />
      </el-dialog>
    </el-card>
  </div>
</template>
<script>
import { getDesignerByLogin, updateDesignerInfo } from "../../api/circle";
import uploadImg from "../../components/uploadImg";
export default {
  data() {
    return {
      designerForm: {
        name: "" /* 设计师姓名 */,
        details: "" /* 设计师详情 */,
        image: "" /* 设计师图片（轮播位置） */,
        head: "" /* 设计师头像 */,
        level: null /* 设计师等级 */
      },
      levelList: [
        { value: 1, label: "精英设计师" },
        { value: 2, label: "主任设计师" },
        { value: 3, label: "首席设计师" }
      ],
      showForm: true,
      designerRules: {
        head: [{ required: true, message: "请填写设计师头像", trigger: "blur" }],
        image: [{ required: true, message: "请上传设计师图片", trigger: "blur" }],
        details: [{ required: true, message: "请填写设计师简介", trigger: "blur" }],
        name: [{ required: true, message: "请填写设计师姓名", trigger: "blur" }],
        level: [{ required: true, message: "请选择设计师等级", trigger: "blur" }]
      },
      designerVisible: false,
      base_url: ""
    };
  },
  mounted() {
    this.base_url = this.$store.state.base_url;
    /* 获取当前用户的设计师信息 */
    getDesignerByLogin().then(data => {
      if (data.data.status == 200) {
        if (data.data.content && Array.isArray(data.data.content)) {
          this.$message("首次填写！");
        } else {
          this.designerForm = data.data.content;
          this.refreshTable();
        }
      }
    });
  },
  methods: {
    /* 刷新 */
    refreshTable() {
      this.showForm = false;
      this.$nextTick(() => {
        this.showForm = true;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateDesignerInfo(this.designerForm).then(data => {
            if (data.data.status == 200) {
              this.$message({
                type: "success",
                message: "编辑成功"
              });
              this.$router.go(0);
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          this.$message.error("请填写完必填参数");
          return false;
        }
      });
    }
  },
  components: { uploadImg }
};
</script>
<style lang="less">
#editDesigner {
  width: 100%;
  height: auto;
  .el-card .el-card__header {
    height: 50px;
  }
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .add-content {
    margin: 0 auto;
    width: 500px;
  }
  .el-dialog--center .el-dialog__body {
    text-align: center;
  }
}
</style>