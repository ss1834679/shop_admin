<template>
  <div id="addAlter">
    <!-- 秒杀活动的修改和添加 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <div>
          <el-button type="text" @click="$router.go(-1)">
            <i class="el-icon-back"></i>
          </el-button>
          <span class="title" v-if="this.$route.query.id">修改秒杀活动</span>
          <span class="title" v-else>添加秒杀活动</span>
        </div>
      </div>
      <div class="content">
        <el-form :model="seckillform" ref="seckillform" label-width="100px" class="demo-ruleForm">
          <el-form-item label="活动标题">
            <el-input v-model="seckillform.seckillTitle"></el-input>
          </el-form-item>
          <el-form-item label="起始时间">
            <el-date-picker
              v-model="timeRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="秒杀展示图">
            <upload-img @getimgArr="(imgarr)=>{this.seckillform.seckillImage = imgarr}" :imgArr="this.seckillform.seckillImage" :limit="1"></upload-img>
          </el-form-item>
          <el-form-item label="SKU码">
            <el-input v-model="seckillform.goodsItemId"></el-input>
          </el-form-item>
          <el-form-item label="秒杀数量">
            <el-input v-model.number="seckillform.seckillNum"></el-input>
          </el-form-item>
          <el-form-item label="秒杀价格">
            <el-input v-model.number="seckillform.seckillPrice" class="red">
              <template slot="append">分</template>
            </el-input>
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
// import { getSeckillById, updateSeckill, addSeckill } from "../../api/seckill";
export default {
  data() {
    return {
      seckillform: {
        id: "1",
        goodsItemId: "123144536" /* 所属SKU商品ID */,
        seckillStart: "2013-12-12" /* 秒杀开始时间 */,
        seckillEnd: "2013-12-12" /* 秒杀结束时间 */,
        seckillNum: 12 /* 秒杀商品数量 */,
        seckillPrice: 3000 /* 秒杀商品价格到分 */,
        seckillImage: "1231sfws3" /* 秒杀展示图 */,
        isDelete: 0 /* 是否删除 */
      },
      timeRange: [] /* 活动时间范围 */
    };
  },
  watch: {
    timeRange: {
      handler() {
        console.log(this.timeRange);
        this.seckillform.seckillStart = this.timeRange[0];
        this.seckillform.seckillEnd = this.timeRange[1];
      }
    }
  },
  mounted() {
    if (this.$route.query.id) {
      //   const loading = this.$loading({
      //     lock: true,
      //     text: "Loading",
      //     spinner: "el-icon-loading",
      //     background: "rgba(0, 0, 0, 0.7)"
      //   });
      //   getSeckillById({ id: this.$route.query.id }).then(data => {
      //     if (data.data.status == 0) {
      //       this.seckillform = data.data.data;
      //       loading.close();
      //     }
      //   });
      console.log("修改");
    }
  },
  methods: {
    submitForm() {
      console.log(this.seckillform);
      if (this.$route.query.id) {
        // updateSeckill(this.seckillform).then(data => {
        //   console.log(data);
        //   this.$message({
        //     type: "success",
        //     message: "秒杀活动修改成功",
        //     center: true
        //   });
        //   this.$router.go(-1);
        // });
      } else {
        // addSeckill(this.seckillform).then(data => {
        //   console.log(data);
        //   this.$message({
        //     type: "success",
        //     message: "秒杀活动添加成功",
        //     center: true
        //   });
        //   this.$router.go(-1);
        // });
      }
    },
    imgJoin(arr) {
      return arr.join(",");
    }
  }
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
      .el-cascader .el-input__inner {
        width: 300px; //搜索框宽度
      }
    }
  }
}
</style>
