<template>
  <div id="shopDataView">
    <!-- 店铺数据详情 -->
    <el-card class="box-card" shadow="never">
      <div slot="header" class="clearfix">
        <span class="title">店铺数据详情</span>
      </div>
      <div class="content">
        <div class="se-content">
          <div>
            <span>店铺交易概况</span>
          </div>
          <Datepick format="time" :dateOpt.sync="shopDate" />
        </div>
        <div class="shopDetails">
          <div class="redline">
            <span>支付转化率{{shopDetails.payTransferRate}}</span>
          </div>
          <div class="shopLine">
            <p class="lineTitle">访客</p>
            <div class="shopLinItem">
              <p>{{shopDetails.accessNumber}}</p>
              <span>访问次数</span>
            </div>
            <div class="shopLinItem">
              <p>{{shopDetails.accessUserNumber}}</p>
              <span>访问用户数</span>
            </div>
            <div class="arrow arrow1">
              <span>下单转化率{{shopDetails.orderTransferRate}}</span>
            </div>
          </div>
          <div class="shopLine">
            <div class="arrow arrow2">
              <span>下单支付转化率{{shopDetails.orderPayTransferRate}}</span>
            </div>
            <p class="lineTitle">下单</p>
            <div class="right">
              <div class="shopLinItem">
                <p>{{shopDetails.newOrderNum}}</p>
                <span>新增订单数</span>
              </div>
              <div class="shopLinItem">
                <p>{{shopDetails.newOrderUserNum}}</p>
                <span>下单用户数</span>
              </div>
              <div class="shopLinItem">
                <p>{{shopDetails.newUserOrderNum}}</p>
                <span>首次下单用户数</span>
              </div>
              <div class="shopLinItem">
                <p>{{shopDetails.repeatUserOrderNum}}</p>
                <span>复购用户数</span>
              </div>
            </div>
          </div>
          <div class="shopLine">
            <p class="lineTitle">支付</p>
            <div class="right">
              <div class="shopLinItem">
                <p>{{shopDetails.payOrderNum}}</p>
                <span>支付订单数</span>
              </div>
              <div class="shopLinItem">
                <p>{{shopDetails.payOrderUserNum}}</p>
                <span>支付用户数</span>
              </div>
              <div class="shopLinItem">
                <p>{{shopDetails.payOrderPaid}}</p>
                <span>支付金额</span>
              </div>
              <div class="shopLinItem">
                <p>{{shopDetails.singleOrderPaid}}</p>
                <span>客单价</span>
              </div>
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
              <el-tab-pane label="新增订单数" name="order"></el-tab-pane>
              <el-tab-pane label="支付订单数" name="trade"></el-tab-pane>
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
  getShopTradeStatistic,
  getShopVisitStatistic,
  getNewAddOrderNumStatistic,
  getPayOrderNumStatistic
} from "../../../api/statistics";
export default {
  components: { Datepick, Echarts },
  data() {
    return {
      shopDate: {} /* 店铺交易概况时间选择 */,
      normDate: {} /* 指标分析时间选择 */,
      shopDetails: {} /* 店铺交易概况 */,
      status: "pv" /* 统计图tab */,
      options: {} /* 统计图配置 */
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
    shopDate: {
      handler() {
        this.getShopStatOne();
      }
    }
  },
  mounted() {
    // this.getShopStatOne();
    // this.getChart(this.status);
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
    getShopStatOne() {
      let { startDate: startTime, endDate: endTime } = this.shopDate;
      getShopTradeStatistic({ id: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          this.shopDetails = data.data.data;
        }
      });
    },
    getShopVisitChart() {
      let { startDate: startTime, endDate: endTime } = this.normDate;
      getShopVisitStatistic({ id: this.$route.query.id, startTime, endTime }).then(data => {
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
    getShopOrderNumChart() {
      let { startDate: startTime, endDate: endTime } = this.normDate;
      getNewAddOrderNumStatistic({ id: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["新增订单数", "下单用户数"]
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
                name: "新增订单数",
                data: diagramData.valueList
              },
              {
                type: "line",
                showSymbol: true,
                name: "下单用户数",
                smooth: true,
                data: diagramData.userValueList
              }
            ]
          };
          this.options = opt;
        }
      });
    },
    getShopPayNumChart() {
      let { startDate: startTime, endDate: endTime } = this.normDate;
      getPayOrderNumStatistic({ id: this.$route.query.id, startTime, endTime }).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            legend: {
              data: ["支付订单数", "支付用户数"]
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
                name: "支付订单数",
                data: diagramData.valueList
              },
              {
                type: "line",
                showSymbol: true,
                name: "支付用户数",
                smooth: true,
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
          this.getShopVisitChart();
          break;
        case "order":
          this.getShopOrderNumChart();
          break;
        case "trade":
          this.getShopPayNumChart();
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style lang='less'>
#shopDataView {
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
      .shopDetails {
        position: relative;
        .redline {
          position: absolute;
          z-index: 4;
          top: 60px;
          left: 155px;
          width: 100px;
          height: calc(~"100% - 120px");
          background-color: transparent;
          border-top: 5px solid red;
          border-right: 5px solid red;
          border-bottom: 5px solid red;
          box-sizing: border-box;
          border-radius: 5px;
          span {
            position: absolute;
            display: inline-block;
            width: 115px;
            height: 30px;
            line-height: 30px;
            font-size: 12px;
            text-align: center;
            right: -60px;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgb(242, 242, 242);
          }
        }
        * {
          padding: 0;
          margin: 0;
        }
        .shopLine {
          display: flex;
          margin-bottom: 20px;
          background-color: rgb(242, 242, 242);
          margin-top: 20px;
          position: relative;
          .right {
            display: flex;
            flex-wrap: wrap;
          }
          .arrow {
            font-size: 14px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            position: absolute;
            bottom: -40px;
            left: 20px;
            z-index: 3;
            background-position: center;
            background-size: 100% 100%;
            width: 200px;
            height: 60px;
          }
          .arrow1 {
            background-image: url(../../../../public/img/arrow1.png);
          }
          .arrow2 {
            background-image: url(../../../../public/img/arrow2.png);
          }
          .shopLinItem {
            margin-right: 50px;
            display: flex;
            width: 100px;
            height: 80px;
            flex-direction: column;
            flex-wrap: wrap;
            justify-content: space-evenly;
            align-items: center;
            p {
              font-size: 20px;
              color: #333;
              font-weight: 700;
              text-align: center;
            }
            span {
              font-size: 14px;
              color: #333;
            }
          }
          p.lineTitle {
            margin-right: 120px;
            width: 240px;
            min-width: 240px;
            line-height: 80px;
            text-align: center;
            font-size: 20px;
            font-weight: 700;
            color: #7f7f7f;
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