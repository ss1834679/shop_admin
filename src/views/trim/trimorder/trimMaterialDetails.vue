<template>
  <div id="trimMaterialDetails">
    <!-- 装修资料详情-->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" icon="el-icon-back" @click="$router.go(-1)"></el-button>
          <span class="title">装修资料详情</span>
        </div>
      </div>
      <div class="content">
        <template v-for="item in detailsList">
          <div class="infoinfoItem" v-if="item.value" :key="item.title">
            <div class="leftInfo">{{item.title}}</div>
            <div class="infoContent" v-html="item.value"></div>
          </div>
        </template>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getDecorationInfoOne } from "../../../api/trim";
export default {
  data() {
    return {
      detailsList: [
        { title: "标题", value: "" },
        { title: "大节点", value: "" },
        { title: "小节点", value: "" },
        { title: "详情", value: "" }
      ]
    };
  },
  mounted() {
    getDecorationInfoOne(this.$route.query.id).then(data => {
      if (data.data.status == 0) {
        let res = data.data.data;
        this.detailsList[0].value = res.title;
        this.detailsList[1].value = res.bigNodeTitle;
        this.detailsList[2].value = res.smallNodeTitle;
        this.detailsList[3].value = res.content;
      } else {
        this.$message.error(data.data.msg);
      }
    });
  }
};
</script>
<style lang="less">
#trimMaterialDetails {
  .box-card {
    height: 100%;
  }
  .el-card {
    .el-card__header {
      padding: 0;
      .clearfix {
        width: calc(~"100% - 40px");
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 20px;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .content {
      .infoinfoItem {
        // height: 35px;
        font-size: 16px;
        line-height: 35px;
        .leftInfo {
          height: 100%;
          width: 100px;
          float: left;
          text-align: right;
        }
        .infoContent {
          // height: 35px;
          width: calc(~"100% - 120px");
          margin-left: 120px;
        }
      }
    }
  }
}
</style>