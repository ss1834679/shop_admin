<template>
  <!-- 订单跟踪页 -->
  <div id="tracking-page">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>订单跟踪</span>
        <el-button size="mini" @click="$router.go(-1)" icon="el-icon-arrow-left" style="margin-right:30px">返回</el-button>
      </div>
      <div class="timeline-content">
        <el-timeline>
          <el-timeline-item v-for="(activity, index) in activities" :key="index" :color="index==0 ? colors2 : colors" :timestamp="activity.ftime">
            <span class="t-content">{{activity.context}}</span>
          </el-timeline-item>
          <el-timeline-item :color="colors">
            <span class="t-content">商家已发货，等待物流公司取件</span>
          </el-timeline-item>
        </el-timeline>
      </div>
    </el-card>
  </div>
</template>
<script>
import { getExpress } from "../../api/pay";
export default {
  data() {
    return {
      reverse: true,
      colors: "#ccc",
      colors2: "red",
      activities: [],
      activitiesLength: 0
    };
  },
  mounted() {
    // 调用订单物流信息接口
    if (this.$route.query.expressNumber && this.$route.query.deliveryCode) {
      getExpress(this.$route.query.deliveryCode, this.$route.query.expressNumber).then(data => {
        if (data.data.status == 200) {
          if (data.data.content.message == "ok") {
            this.activities = data.data.content.data;
            this.activitiesLength = this.activities.length;
            this.$message({ message: "查询快递成功", type: "success" });
          } else {
            this.$message.warning(data.data.content.message);
          }
        } else {
          this.$message.error(data.data.msg);
        }
      });
    } else {
      this.$message.warning("该订单物流信息不全！");
    }
  },
  methods: {}
};
</script>
<style lang="less" scoped>
#tracking-page {
  padding: 20px;
  .clearfix {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
.t-content {
  font-size: 12px;
  color: #888;
}
.el-card .el-card__header {
  background: #f2f2f2 !important;
  height: 50px;
}
</style>