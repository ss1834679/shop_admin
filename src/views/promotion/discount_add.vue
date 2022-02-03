<template>
  <div id="addDisount">
    <!-- 活动的添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">添加活动</span>
        </div>
      </div>
      <!-- 活动的 表数据验证 -->
      <div class="content">
        <el-form :model="discountform" ref="adform" label-width="110px" class="demo-ruleForm">
          <el-form-item label="活动名称">
            <el-input v-model="adform.name" placeholder="活动名称只是作为辨别多个活动条目之用，并不显示在活动中"></el-input>
          </el-form-item>
          <el-form-item label="活动位置">
            <el-select v-model="adform.position" placeholder="选择活动位置">
              <el-option v-for="item in position" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="adform.startTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker v-model="adform.invalidTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择结束时间"></el-date-picker>
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
export default {
  data() {
    return {
      discountform: {
        id: "",
        name: "" /* 活动名称 */,
        position: "" /* 活动位置 */,
        imgFileId: "" /* 活动图片 */,
        url: "" /* 活动连接 */,
        startTime: "" /* 开始时间 */,
        invalidTime: "" /* 失效时间 */,
        comment: "" /* 备注 */,
        isOnline: 1 /* 是否上线 */
      },
      size: null /* 图片上传的尺寸 */,
      showImg: false /* 刷新img */
    };
  },
  methods: {
    submitForm() {
    //   addAdvert(this.adform).then(data => {
    //     if (data.data.state == "Success") {
    //       this.$message({
    //         message: "添加成功",
    //         type: "success"
    //       });
    //       this.$router.push({ name: "ad_Idx" });
    //     }
    //   });
    }
  },
  //是否有富文本编辑
  components: { }
};
</script>

<style lang='less'>
#addAD {
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
    }
  }
}
</style>
