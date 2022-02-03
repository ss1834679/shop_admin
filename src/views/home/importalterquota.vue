<template>
  <div id="importalterquota">
    <!-- 导入报价-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div style="margin-left:15px">
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title">导入报价</span>
        </div>
      </div>

      <div class="content">
        <div class="projectInfo">
          <div>{{projectform.name}}</div>
          <div class="projectVHAA">
            <span>{{projectform.villageId}}</span>
            <span>{{projectform.houseTypeId}}</span>
            <span>{{projectform.area}}㎡</span>
            <span>{{projectform.address}}</span>
          </div>
        </div>
        <div style="margin-top:8px" class="projectInfo">
          <span class="projectRemind">功能介绍: 使用excel快速导入方案报价，仅支持上传xls、xlsx文件导入前请认真检查数据是否正确，模板文件中*标字段为必填项一次仅支持一份文件上传，再次导入将覆盖已导入的数据</span>
        </div>
        <div class="projectInfo">
          <el-upload
            ref="uploadquota"
            action="https://file.tbzj.net/fileserver/file/uploadFile"
            :limit="1"
            :multiple="false"
            :on-remove="handleRemove"
            :file-list="fileList"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
          </el-upload>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getHouseDetailById } from "../../api/house";
export default {
  data() {
    return {
      isqouta: false /* 是否报价 */,
      projectform: {
        name: "融创凡尔赛现代轻奢" /* 方案标题 */,
        bigimg: "" /* 封面图 */,
        villageId: "天安数码城小区" /* 小区 */,
        houseimg: "" /* 户型图 */,
        area: 98 /* 面积 */,
        houseStyleId: "" /* 风格id */,
        houseTypeId: "3室1厅" /* 户型字符串 */,
        threedLink: "https://720.tbzj.net/" /* 3D链接 */,
        isDisplay: 1 /* 是否显示 */,
        zhengwen: "" /* 正文 */,
        address: "重庆重庆市大渡口区天安数码路23号"
      },
      fileList: []
    };
  },
  mounted() {
    if (this.$route.query.id) {
      getHouseDetailById({ id: this.$route.query.id }).then(data => {
        this.projectform = data.data.data;
        this.refreshImg();
      });
    }
  },
  methods: {
    handleRemove() {},
    submitUpload() {}
  }
};
</script>

<style lang='less'>
#importalterquota {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
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
  .projectInfo {
    border: 1px solid #ccc;
    padding: 8px 10px;
    .projectVHAA {
      max-width: 1000px;
      min-width: 700px;
      display: flex;
      justify-content: space-between;
    }
    .projectRemind {
      display: inline-block;
      width: 500px;
      color: #aaa;
    }
  }
}
</style>
