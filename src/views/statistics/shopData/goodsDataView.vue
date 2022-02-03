<template>
  <div id="goodsDataView">
    <!-- 商品数据详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">商品数据详情</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <span>商品概况</span>
          </div>
          <Datepick format="time" :dateOpt.sync="goodDate" />
        </div>
        <div class="goodsDetails">
          <div class="goodImg">
            <img v-if="goodsDetails.image" :src="goodsDetails.image.includes('http')?`${goodsDetails.image}`:`${base}${goodsDetails.image}`" alt />
          </div>
          <div class="goodMsg">
            <div class="goodMsgItem large">
              <span class="goodTitle">商品名称：</span>
              <span class="ellipsis">{{goodsDetails.title}}</span>
            </div>
            <div class="goodMsgItem">
              <span>访问次数：{{goodsDetails.views}}</span>
            </div>
            <div class="goodMsgItem">
              <span>访问用户数：{{goodsDetails.viewsUser}}</span>
            </div>
            <div class="goodMsgItem">
              <span>销量：{{goodsDetails.orderCount}}</span>
            </div>
            <div class="goodMsgItem">
              <span>订单占比：{{goodsDetails.orderRate}}</span>
            </div>
            <div class="goodMsgItem">
              <span>平均停留时长：{{goodsDetails.avgTime}}s</span>
            </div>
            <div class="goodMsgItem large">
              <span>商品ID：{{goodsDetails.id}}</span>
            </div>
            <div class="goodMsgItem">
              <span>加入购物车次数：{{goodsDetails.shopCarNum}}</span>
            </div>
            <div class="goodMsgItem">
              <span>收藏次数：{{goodsDetails.collectionNum}}</span>
            </div>
            <div class="goodMsgItem">
              <span>交易额：￥{{(goodsDetails.orderPaid/100).toFixed(2)}}</span>
            </div>
            <div class="goodMsgItem">
              <span>交易额占比：{{goodsDetails.payRate}}</span>
            </div>
          </div>
        </div>
        <div class="se-content">
          <div>
            <span>指标分析</span>
          </div>
          <Datepick format="time" :dateOpt.sync="normDate" />
        </div>
        <div class="chartTab">
          <div class="status">
            <el-tabs v-model="status" type="card">
              <el-tab-pane label="PV/UV" name="pv"></el-tab-pane>
              <el-tab-pane label="订单量" name="order"></el-tab-pane>
              <el-tab-pane label="交易额" name="trade"></el-tab-pane>
            </el-tabs>
          </div>
          <div class="chart">
            <Echarts chartId="goodsDataChart" :options="options" />
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script>
import Datepick from "../../../components/datepick";
import Echarts from "../../../components/echarts";
import {
  getGoodsStatisticsOne,
  getGoodsVisitStatistic,
  getGoodsOrderNumStatistic,
  getGoodsPayNumStatistic
} from "../../../api/statistics";
export default {
  components: { Datepick, Echarts },
  data() {
    return {
      goodDate: {} /* 商品概况时间选择 */,
      normDate: {} /* 指标分析时间选择 */,
      goodsDetails: {} /* 商品概况 */,
      status: "pv" /* 统计图tab */,
      options: {} /* 统计图配置 */,
      base: ""
    };
  },
  watch: {
    status: {
      handler() {
        /* 切换chart */
        this.getChart(this.status);
      }
    },
    normDate: {
      handler() {
        this.getChart(this.status);
      }
    },
    goodDate: {
      handler() {
        this.getGoodsStatOne();
      }
    }
  },
  mounted() {
    this.base = this.$store.state.base_url;
  },
  methods: {
    getValueAndTime(arr = []) {
      const chartObj = {
        valueList: [],
        timeList: [],
        userValueList: []
      };
      chartObj.valueList = arr.map(item => {
        return item.value;
      });
      chartObj.timeList = arr.map(item => {
        return item.time;
      });
      chartObj.userValueList = arr.map(item => {
        if (item.userValue) {
          return item.userValue;
        } else {
          return null;
        }
      });
      return chartObj;
    },
    getGoodsStatOne() {
      let { startDate: startTime, endDate: endTime } = this.goodDate;
      getGoodsStatisticsOne({ goodsId: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          this.goodsDetails = data.data.data;
        }
      });
    },
    getGoodsVisitChart() {
      let { startDate: startTime, endDate: endTime } = this.normDate;
      getGoodsVisitStatistic({ goodsId: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["访问次数", "访问用户数"]
            },
            xAxis: {
              data: diagramData.timeList
            },
            yAxis: [
              {
                splitLine: { show: false }
              }
            ],
            series: [
              {
                type: "line",
                showSymbol: true,
                name: "访问次数",
                data: diagramData.valueList
              },
              {
                type: "line",
                showSymbol: true,
                name: "访问用户数",
                smooth: true,
                data: diagramData.userValueList
              }
            ]
          };
          this.options = opt;
        }
      });
    },
    getGoodsOrderNumChart() {
      let { startDate: startTime, endDate: endTime } = this.normDate;
      getGoodsOrderNumStatistic({ goodsId: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["订单量"]
            },
            xAxis: {
              data: diagramData.timeList
            },
            yAxis: [
              {
                splitLine: { show: false }
              }
            ],
            series: [
              {
                type: "line",
                showSymbol: true,
                name: "订单量",
                data: diagramData.valueList
              }
            ]
          };
          this.options = opt;
        }
      });
    },
    getGoodsPayNumChart() {
      let { startDate: startTime, endDate: endTime } = this.normDate;
      getGoodsPayNumStatistic({ goodsId: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["交易额"]
            },
            xAxis: {
              data: diagramData.timeList
            },
            yAxis: [
              {
                splitLine: { show: false }
              }
            ],
            series: [
              {
                type: "line",
                showSymbol: true,
                name: "交易额(￥)",
                data: diagramData.valueList
              }
            ]
          };
          this.options = opt;
        }
      });
    },
    getChart(status) {
      switch (status) {
        case "pv":
          this.getGoodsVisitChart();
          break;
        case "order":
          this.getGoodsOrderNumChart();
          break;
        case "trade":
          this.getGoodsPayNumChart();
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang='less'>
#goodsDataView {
  width: 100%;
  height: auto;

  .el-card {
    height: 100%;
    .el-card__header {
      //头部标题
      padding: 0;
      .clearfix {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span.title {
          line-height: 50px;
          margin-left: 20px;
        }
      }
    }
    .content {
      height: 100%;
      display: flex;
      flex-direction: column;
      .se-content {
        span {
          font-size: 15px;
        }
      }
      .goodsDetails {
        // height: 100px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid rgba(215, 215, 215, 1);
        .goodImg {
          width: 100px;
          height: 100px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .goodMsg {
          width: calc(~"100% - 100px");
          padding: 0 10px;
          display: flex;
          flex-wrap: wrap;
          .goodTitle {
            display: inline;
            line-height: 25px;
            min-width: 80px;
          }
          .goodMsgItem {
            font-size: 14px;
            width: 15%;
            height: 50px;
            line-height: 25px;
            padding: 0 10px;
            display: flex;
            .ellipsis {
              line-height: 25px;
              text-overflow: -o-ellipsis-lastline;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }
          }
        }
      }
      .chartTab {
        .status {
          .el-tabs--card > .el-tabs__header .el-tabs__nav {
            border: 1px solid #e4e7ed;
          }
          .el-tabs__item {
            border-bottom: none;
          }
        }
        .chart {
          height: 350px;
        }
      }
    }
  }
}
</style>