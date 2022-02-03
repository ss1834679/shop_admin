<template>
  <!-- 装小鲤设置页 -->
  <div class="add-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>装小鲤活动设置</span>
      </div>

      <div class="add-content">
        <el-form :model="luckyCharmForm" ref="luckyCharmForm" :rules="luckyCharmRules" label-width="120px">
          <el-form-item label="活动标题：" prop="title" class="is-required">
            <el-input v-model="luckyCharmForm.title"></el-input>
          </el-form-item>
          <el-form-item label="活动时间：" v-if="showImg" class="is-required">
            <el-date-picker
              v-model="searchTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始"
              end-placeholder="结束"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="活动头图：" v-if="showImg" prop="headImage" class="is-required">
            <upload-img
              @getimgArr="(imgarr)=>{this.luckyCharmForm.headImage = imgarr}"
              :imgArr="this.luckyCharmForm.headImage"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
            <p class="mind">支持jpg、png，建议尺寸: 750*380</p>
          </el-form-item>
          <el-form-item label="活动背景图：" v-if="showImg" prop="image" class="is-required">
            <upload-img
              @getimgArr="(imgarr)=>{this.luckyCharmForm.image = imgarr}"
              :imgArr="this.luckyCharmForm.image"
              :limit="1"
              :notMultiple="true"
            ></upload-img>
            <p class="mind">支持jpg、png，建议尺寸: 宽750  高度不限</p>
          </el-form-item>
          <el-form-item label="活动规则：" prop="content" class="is-required">
            <wang-editor :value="luckyCharmForm.content" @getHtmlFromWang="(value)=>{this.luckyCharmForm.content=value}"></wang-editor>
          </el-form-item>
          <el-form-item label="入围票数：" prop="shortListed" class="is-required">
            <el-input-number v-model="luckyCharmForm.shortListed" :min="0" :max="100000000" :controls="false"></el-input-number>张
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('luckyCharmForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import wangEditor from "../../components/wangEditor";
import uploadImg from "../../components/uploadImg";
import { getLuckyCharmSet, saveOrUpdateLuckyCharmSet } from "../../api/luckyCharm";
export default {
  components: { wangEditor, uploadImg },
  data() {
    return {
      luckyCharmForm: {
        content: null /* 活动规则 */,
        effectiveEndTime: "" /* 活动结束时间 */,
        effectiveStartTime: "" /* 活动开始时间 */,
        headImage: null /* 活动头图 */,
        image: null /* 活动背景图 */,
        shortListed: 0 /* 入围票数 */,
        title: null /* 标题 */
      },
      searchTime: [],
      showImg: true,
      luckyCharmRules: {
        content: [{ required: true, message: "填写活动规则", trigger: "blur" }],
        headImage: [{ required: true, message: "请上传活动头图", trigger: "blur" }],
        image: [{ required: true, message: "请上传活动背景图", trigger: "blur" }],
        shortListed: [{ required: true, message: "请填写入围票数", trigger: "blur" }],
        title: [{ required: true, message: "请填写活动标题", trigger: "blur" }]
      }
    };
  },
  watch: {
    searchTime: {
      handler() {
        if (this.searchTime && this.searchTime.length > 0) {
          this.luckyCharmForm.effectiveStartTime = this.searchTime[0];
          this.luckyCharmForm.effectiveEndTime = this.searchTime[1];
        } else {
          this.luckyCharmForm.effectiveStartTime = "";
          this.luckyCharmForm.effectiveEndTime = "";
        }
      }
    }
  },
  mounted() {
    getLuckyCharmSet().then(data => {
      if (data.data.status == 0) {
        data.data.data[0] ? (this.luckyCharmForm = data.data.data[0]) : this.$message.warning("添加装小鲤设置");
        this.searchTime[0] = this.luckyCharmForm.effectiveStartTime;
        this.searchTime[1] = this.luckyCharmForm.effectiveEndTime;
        this.refreshImg();
      }
    });
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveOrUpdateLuckyCharmSet(this.luckyCharmForm).then(data => {
            if (data.data.status == 0) {
              this.$message({ type: "success", message: "编辑成功" });
            } else {
              this.$message.error("编辑失败");
            }
          });
        } else {
          this.$message.error("请检查是否填完所有参数");
          return false;
        }
      });
    },
    /* 刷新 */
    refreshImg() {
      this.showImg = false;
      this.$nextTick(() => {
        this.showImg = true;
      });
    }
  }
};
</script>
<style lang="less">
.add-page {
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-card .el-card__header {
    background: #f2f2f2 !important;
    height: 50px;
  }
  .mind {
    margin: 0;
    padding: 0;
    line-height: normal;
    color: #999999;
  }
}
</style>