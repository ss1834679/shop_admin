<template>
  <div id="addAlter">
    <!-- 广告的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.id">修改广告</span>
          <span class="title" v-else>添加广告</span>
        </div>
      </div>
      <!-- 广告的 表数据验证 -->
      <div class="content">
        <el-form :model="adform" ref="adform" label-width="110px" class="demo-ruleForm">
          <el-form-item label="广告名称">
            <el-input v-model="adform.adName" placeholder="广告名称只是作为辨别多个广告条目之用，并不显示在广告中"></el-input>
          </el-form-item>
          <el-form-item label="广告位置">
            <el-select v-model="adform.position" placeholder="广告位置">
              <el-option label="APP首页轮播" value="APP首页轮播"></el-option>
              <el-option label="PC端首页轮播" value="PC端首页轮播"></el-option>
              <el-option label="PC端分类广告" value="PC端分类广告"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="开始时间">
            <el-date-picker v-model="adform.startTime" type="datetime" placeholder="选择开始时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="到期时间">
            <el-date-picker v-model="adform.endTime" type="datetime" placeholder="选择结束时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="上线/下线">
            <el-radio-group v-model="adform.isOnline">
              <el-radio :label="true">上线</el-radio>
              <el-radio :label="false">下线</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="广告图片">
            <!-- 有限制宽高比例 -->
            <upload-img @getimgArr="(imgarr)=>{this.adform.img = imgarr}" :imgArr="this.adform.img" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="广告链接">
            <el-input v-model="adform.link"></el-input>
          </el-form-item>
          <el-form-item label="广告备注">
            <el-input v-model="adform.note"></el-input>
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
      adform: {
        adName: "首页广告1" /* 广告名称 */,
        position: "APP首页轮播" /* 广告位置 */,
        startTime: "2020-01-06 15:11:12" /* 开始时间 */,
        endTime: "2020-01-06 15:11:12" /* 结束时间 */,
        isOnline: true /* 上线 / 下线 */,
        img: "5e12ecf9a1a09a0baeb14607" /* 广告图片 */,
        link: "www.baidu.com" /* 广告连接 */,
        note: "beizhu 1234" /* 广告备注 */,
        isDelete: 0 /* 是否删除 */
      }
    };
  },
  mounted() {
    if (this.$route.query.id) {
      /* 通过id获取广告信息 */
      // getAd({ id: this.$route.query.id }).then(data => {
      //   if (data.data.status == 0) {
      //     console.log(data);
      //   }
      // });
    }
  },
  methods: {
    submitForm() {
      if (this.$route.query.id) {
        this.adform.id = this.$route.query.id;
        /* 对分类id进行拼接 */
        console.log(this.adform);
        // updateAd(this.adform).then(data => {
        //   console.log(data);
        //   if (data.data.status == 0) {
        //     this.$message({
        //       type: "success",
        //       message: "广告修改成功",
        //       center: true
        //     });
        //     this.$router.go(-1);
        //   }
        // });
      } else {
        console.log(this.adform);
        // addAd(this.adform).then(data => {
        //   if (data.data.status == 0) {
        //     this.$message({
        //       type: "success",
        //       message: "广告添加成功",
        //       center: true
        //     });
        //     this.$router.go(-1);
        //   }
        // });
      }
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
