<template>
  <div id="editTrimProcess">
    <!-- 编辑装修流程-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">编辑装修流程</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="trimProcessForm" ref="trimProcessForm" :rules="trimProcessRules" label-width="100px">
          <el-form-item label="流程名" prop="processName">
            <el-input v-model.trim="trimProcessForm.processName" placeholder="请输入流程名" style="width:300px"></el-input>
          </el-form-item>
          <el-form-item label="排序" prop="processSort">
            <el-input-number v-model="trimProcessForm.processSort" :controls="false" :min="0" placeholder="排序"></el-input-number>
          </el-form-item>
          <el-form-item label="分类" prop="processClassify">
            <el-select v-model="trimProcessForm.processClassify" placeholder="请选择分类">
              <el-option v-for="item in cateList" :key="item.id" :label="item.flagDesc" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="是否启用" prop="status">
            <el-radio-group v-model="trimProcessForm.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">不启用</el-radio>
            </el-radio-group>
          </el-form-item>-->
          <el-form-item>
            <el-button type="primary" @click="submitForm('trimProcessForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>

<script>
import {
  getDecorateDictProcess,
  addDecorateProcess,
  getDecorateProcessOne,
  updateDecorateProcess
} from "../../../api/trim";
export default {
  data() {
    return {
      trimProcessForm: {
        /* 装修流程数据 */
        processClassify: "",
        processName: "",
        processSort: undefined
      },
      cateList: [],
      trimProcessRules: {
        processName: [
          { required: true, message: "请输入流程名", trigger: "blur" },
          { min: 0, max: 50, message: "流程名不能大于50个字", trigger: "blur" }
        ],
        processClassify: [{ required: true, message: "请选择分类", trigger: "blur" }],
        processSort: [{ required: true, message: "请输入排序值", trigger: "blur" }]
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getDecorateProcessOne(this.$route.query.id).then(data => {
        if (data.data.status == 0) {
          this.trimProcessForm = data.data.data;
        }
      });
    }
    getDecorateDictProcess().then(data => {
      if (data.data.status == 0) {
        this.cateList = data.data.data;
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$route.query.id) {
            updateDecorateProcess(this.trimProcessForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("修改流程成功");
                this.$router.go(-1);
              } else {
                this.$message.error(data.data.msg);
              }
            });
          } else {
            addDecorateProcess(this.trimProcessForm).then(data => {
              if (data.data.status == 0) {
                this.$message.success("添加流程成功");
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
#editTrimProcess {
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