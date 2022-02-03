<template>
  <div>
    <section class="idnexSection totleData">
      <div class="dataItem dataWithImg">
        <div class="itemImg">
          <img src="../../../../public/img/totle.png" alt />
        </div>
        <div class="itemTotle">
          <p class="dataTitle">成交总额</p>
          <p class="dataNum">¥{{totalTurnover}}</p>
        </div>
      </div>
      <div class="dataItem">
        <p>
          <span class="dataTitle">今日支付订单</span>
          <span class="dataNum">{{todayPayOrderNum}}</span>
        </p>
        <p>
          <span class="dataTitle">昨日全天</span>
          <span class="dataNum">{{yesterdayPayOrderNum}}</span>
        </p>
      </div>
      <div class="dataItem">
        <p>
          <span class="dataTitle">今日支付金额</span>
          <span class="dataNum">¥{{todayPayMoneyNum}}</span>
        </p>
        <p>
          <span class="dataTitle">昨日全天</span>
          <span class="dataNum">¥{{yesterdayPayMoneyNum}}</span>
        </p>
      </div>
      <div class="dataItem">
        <p>
          <span class="dataTitle">今日新增用户</span>
          <span class="dataNum">{{todayNewUsers}}</span>
        </p>
        <p>
          <span class="dataTitle">昨日全天</span>
          <span class="dataNum">{{yesterdayNewUsers}}</span>
        </p>
      </div>
      <div class="dataItem">
        <p>
          <span class="dataTitle">今日客单价</span>
          <span class="dataNum">¥{{todayCustomerUnitPrice}}</span>
        </p>
        <p>
          <span class="dataTitle">昨日全天</span>
          <span class="dataNum">¥{{yesterdayCustomerUnitPrice}}</span>
        </p>
      </div>
    </section>
    <section class="idnexSection sectionCard">
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>待处理事务</span>
        </div>
        <div class="cardContent">
          <div class="linkItem">
            <span class="linkText">待付款订单</span>
            <router-link :to="{name:'order_Idx',query:{type:'newTag',status:'1'}}" target="_blank">{{waitPayOrder}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">待处理退货</span>
            <router-link :to="{name:'return_Goods',query:{type:'newTag',status:'1'}}" target="_blank">{{waitHandleReturn}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">待处理退款</span>
            <router-link :to="{name:'return_Money',query:{type:'newTag',status:'1'}}" target="_blank">{{waitHandleRefund}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">待发货订单</span>
            <router-link :to="{name:'order_Idx',query:{type:'newTag',status:'2'}}" target="_blank">{{waitSendOrder}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">待审核商品</span>
            <router-link :to="{name:'goods_checkIdx',query:{type:'newTag'}}" target="_blank">{{waitExamineGoods}}</router-link>
          </div>
        </div>
      </el-card>
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>商城信息</span>
        </div>
        <div class="cardContent">
          <div class="linkItem">
            <span class="linkText">用户总数</span>
            <router-link :to="{name:'userList',query:{type:'newTag'}}" target="_blank">{{totalUsers}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">入驻商家数</span>
            <router-link :to="{name:'per_supplier_index',query:{type:'newTag'}}" target="_blank">{{entryBusinesses}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">商品总数</span>
            <router-link :to="{name:'goods_Idx',query:{type:'newTag'}}" target="_blank">{{goodsNum}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">已上架商品</span>
            <router-link :to="{name:'goods_Idx',query:{type:'newTag',status:'1'}}" target="_blank">{{listingGoodsNum}}</router-link>
          </div>
          <div class="linkItem">
            <span class="linkText">订单总数</span>
            <router-link :to="{name:'order_Idx',query:{type:'newTag'}}" target="_blank">{{totalOrderNum}}</router-link>
          </div>
        </div>
      </el-card>
    </section>
    <section class="idnexSection saleSection">
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>销售统计</span>
        </div>
        <div class="cardContent">
          <div class="linkRatio">
            <div class="linkRatioItem">
              <p style="color:#989898;font-size:12px">上月成交总额</p>
              <p style="color:#666;font-size:20px">¥{{salesTotalTurnoverOfThisMonth.currentValue}}</p>
              <p style="font-size:12px" v-if="salesTotalTurnoverOfThisMonth.linkRatio!=null">
                <span v-if="salesTotalTurnoverOfThisMonth.linkRatio>=0" style="color:#00A950">
                  <i class="el-icon-caret-top"></i>
                  <span>{{Math.abs(salesTotalTurnoverOfThisMonth.linkRatio)}}%</span>
                </span>
                <span v-else style="color:#F04844">
                  <i class="el-icon-caret-bottom"></i>
                  <span>{{Math.abs(salesTotalTurnoverOfThisMonth.linkRatio)}}%</span>
                </span>
                <span style="color:#ccc">环比</span>
              </p>
            </div>
            <div class="linkRatioItem">
              <p style="color:#989898;font-size:12px">上周成交总额</p>
              <p style="color:#666;font-size:20px">¥{{salesTurnoverThisWeek.currentValue}}</p>
              <p style="font-size:12px" v-if="salesTurnoverThisWeek.linkRatio!=null">
                <span v-if="salesTurnoverThisWeek.linkRatio>=0" style="color:#00A950">
                  <i class="el-icon-caret-top"></i>
                  <span>{{Math.abs(salesTurnoverThisWeek.linkRatio)}}%</span>
                </span>
                <span v-else style="color:#F04844">
                  <i class="el-icon-caret-bottom"></i>
                  <span>{{Math.abs(salesTurnoverThisWeek.linkRatio)}}%</span>
                </span>
                <span style="color:#ccc">环比</span>
              </p>
            </div>
          </div>
          <div class="chartBox">
            <div class="datepickbox">
              <Datepick :dateOpt.sync="saleDate" />
            </div>
            <Echart chartId="saleDiagram" :options="saleOpt" />
          </div>
        </div>
      </el-card>
    </section>
    <section class="idnexSection">
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>订单统计</span>
        </div>
        <div class="cardContent">
          <div class="linkRatio">
            <div class="linkRatioItem">
              <p style="color:#989898;font-size:12px">上月订单总数</p>
              <p style="color:#666;font-size:20px">{{orderTotalTurnoverOfThisMonth.currentValue}}</p>
              <p style="font-size:12px" v-if="orderTotalTurnoverOfThisMonth.linkRatio!=null">
                <span v-if="orderTotalTurnoverOfThisMonth.linkRatio>=0" style="color:#00A950">
                  <i class="el-icon-caret-top"></i>
                  <span>{{Math.abs(orderTotalTurnoverOfThisMonth.linkRatio)}}%</span>
                </span>
                <span v-else style="color:#F04844">
                  <i class="el-icon-caret-bottom"></i>
                  <span>{{Math.abs(orderTotalTurnoverOfThisMonth.linkRatio)}}%</span>
                </span>
                <span style="color:#ccc">环比</span>
              </p>
            </div>
            <div class="linkRatioItem">
              <p style="color:#989898;font-size:12px">上周订单数量</p>
              <p style="color:#666;font-size:20px">{{orderTotalTurnoverThisWeek.currentValue}}</p>
              <p style="font-size:12px" v-if="orderTotalTurnoverThisWeek.linkRatio!=null">
                <span v-if="orderTotalTurnoverThisWeek.linkRatio>=0" style="color:#00A950">
                  <i class="el-icon-caret-top"></i>
                  <span>{{Math.abs(orderTotalTurnoverThisWeek.linkRatio)}}%</span>
                </span>
                <span v-else style="color:#F04844">
                  <i class="el-icon-caret-bottom"></i>
                  <span>{{Math.abs(orderTotalTurnoverThisWeek.linkRatio)}}%</span>
                </span>
                <span style="color:#ccc">环比</span>
              </p>
            </div>
          </div>
          <div class="chartBox">
            <div class="datepickbox">
              <Datepick :dateOpt.sync="orderDate" />
            </div>
            <Echart chartId="orderDiagram" :options="orderOpt" />
          </div>
        </div>
      </el-card>
    </section>
    <section class="idnexSection pieSection">
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>商品销量排行榜</span>
          <div class="datepickbox">
            <Datepick :dateOpt.sync="goodSaleDate" />
          </div>
        </div>
        <div class="cardContent">
          <Echart v-if="goodVisible" chartId="goodDiagram" :options="goodOpt" />
          <div v-else class="nomsg">暂无数据</div>
        </div>
      </el-card>
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>用户购买力排行榜</span>
          <div class="datepickbox">
            <Datepick :dateOpt.sync="userDate" />
          </div>
        </div>
        <div class="cardContent">
          <Echart v-if="userVisible" chartId="userDiagram" :options="userOpt" />
          <div v-else class="nomsg">暂无数据</div>
        </div>
      </el-card>
      <el-card class="card">
        <div slot="header" class="cardHead">
          <span>店铺成交额排行榜</span>
          <div class="datepickbox">
            <Datepick :dateOpt.sync="suppDate" />
          </div>
        </div>
        <div class="cardContent">
          <Echart v-if="suppVisible" chartId="suppDiagram" :options="suppOpt" />
          <div v-else class="nomsg">暂无数据</div>
        </div>
      </el-card>
    </section>
  </div>
</template>

<script>
import Echart from "../../../components/echarts";
import Datepick from "../../../components/datepick";
import dataApi from "../../../api/dataApi";
export default {
  components: { Echart, Datepick },
  data() {
    return {
      saleOpt: {} /* 销售统计chart option */,
      orderOpt: {} /* 订单统计chart option */,
      goodOpt: {} /* 商品销量chart option */,
      userOpt: {} /* 用户购买力chart option */,
      suppOpt: {} /* 店铺成交chart option */,
      saleDate: {} /* 销售统计日期查询 */,
      orderDate: {} /* 订单统计日期查询 */,
      goodSaleDate: {} /* 商品销量日期查询 */,
      userDate: {} /* 用户购买力日期查询 */,
      suppDate: {} /* 店铺成交日期查询 */,
      goodVisible: true /* 是否有 商品销量 数据*/,
      userVisible: true /* 是否有 用户购买力 数据 */,
      suppVisible: true /* 是否有 店铺成交 数据 */,
      totalTurnover: null /* 成交总额 */,
      todayPayOrderNum: null /* 今日支付订单 */,
      yesterdayPayOrderNum: null /* 今日支付订单 */,
      todayPayMoneyNum: null /* 今日支付金额 */,
      yesterdayPayMoneyNum: null /* 昨日支付金额 */,
      todayNewUsers: null /* 今日新增用户 */,
      yesterdayNewUsers: null /* 昨日新增用户 */,
      todayCustomerUnitPrice: null /* 今日客单价 */,
      yesterdayCustomerUnitPrice: null /* 昨日客单价 */,
      waitPayOrder: null /* 待付款订单 */,
      waitHandleReturn: null /* 待处理退货 */,
      waitHandleRefund: null /* 待处理退款 */,
      waitSendOrder: null /* 待发货订单 */,
      waitExamineGoods: null /* 待审核商品 */,
      totalUsers: null /* 用户总数 */,
      entryBusinesses: null /* 入驻商家数 */,
      goodsNum: null /* 商品总数 */,
      listingGoodsNum: null /* 已上架商品数量 */,
      totalOrderNum: null /* 订单总数 */,
      salesTotalTurnoverOfThisMonth: {} /* 本月成交总额 */,
      salesTurnoverThisWeek: {} /* 本周成交总额 */,
      orderTotalTurnoverOfThisMonth: {} /* 本月订单总数 */,
      orderTotalTurnoverThisWeek: {} /* 本周订单数量 */
    };
  },
  watch: {
    saleDate: {
      handler() {
        this.getSalesStatistics();
      }
    },
    orderDate: {
      handler() {
        this.getOrderStatistics();
      }
    },
    goodSaleDate: {
      handler() {
        this.getGoodsRanking();
      }
    },
    userDate: {
      handler() {
        this.getPurchasingPower();
      }
    },
    suppDate: {
      handler() {
        this.getTurnoverOfStores();
      }
    }
  },
  mounted() {
    dataApi.getTotalTurnover().then(data => {
      if (data.data.status == 0) {
        this.totalTurnover = data.data.data;
      }
    });
    dataApi.getTodayPayOrderNum().then(data => {
      if (data.data.status == 0) {
        this.todayPayOrderNum = data.data.data;
      }
    });
    dataApi.getYesterdayPayOrderNum().then(data => {
      if (data.data.status == 0) {
        this.yesterdayPayOrderNum = data.data.data;
      }
    });
    dataApi.getTodayPayMoneyNum().then(data => {
      if (data.data.status == 0) {
        this.todayPayMoneyNum = data.data.data;
      }
    });
    dataApi.getYesterdayPayMoneyNum().then(data => {
      if (data.data.status == 0) {
        this.yesterdayPayMoneyNum = data.data.data;
      }
    });
    dataApi.getTodayNewUsers().then(data => {
      if (data.data.status == 0) {
        this.todayNewUsers = data.data.data;
      }
    });
    dataApi.getYesterdayNewUsers().then(data => {
      if (data.data.status == 0) {
        this.yesterdayNewUsers = data.data.data;
      }
    });
    dataApi.getTodayCustomerUnitPrice().then(data => {
      if (data.data.status == 0) {
        this.todayCustomerUnitPrice = data.data.data;
      }
    });
    dataApi.getYesterdayCustomerUnitPrice().then(data => {
      if (data.data.status == 0) {
        this.yesterdayCustomerUnitPrice = data.data.data;
      }
    });
    dataApi.getWaitPayOrder().then(data => {
      if (data.data.status == 0) {
        this.waitPayOrder = data.data.data;
      }
    });
    dataApi.getWaitHandleReturn().then(data => {
      if (data.data.status == 0) {
        this.waitHandleReturn = data.data.data;
      }
    });
    dataApi.getWaitHandleRefund().then(data => {
      if (data.data.status == 0) {
        this.waitHandleRefund = data.data.data;
      }
    });
    dataApi.getWaitSendOrder().then(data => {
      if (data.data.status == 0) {
        this.waitSendOrder = data.data.data;
      }
    });
    dataApi.getWaitExamineGoods().then(data => {
      if (data.data.status == 0) {
        this.waitExamineGoods = data.data.data;
      }
    });
    dataApi.getTotalUsers().then(data => {
      if (data.data.status == 0) {
        this.totalUsers = data.data.data;
      }
    });
    dataApi.getEntryBusinesses().then(data => {
      if (data.data.status == 0) {
        this.entryBusinesses = data.data.data;
      }
    });
    dataApi.getGoodsNum().then(data => {
      if (data.data.status == 0) {
        this.goodsNum = data.data.data;
      }
    });
    dataApi.getListingGoodsNum().then(data => {
      if (data.data.status == 0) {
        this.listingGoodsNum = data.data.data;
      }
    });
    dataApi.getTotalOrderNum().then(data => {
      if (data.data.status == 0) {
        this.totalOrderNum = data.data.data;
      }
    });
    dataApi.getSalesTotalTurnoverOfThisMonth().then(data => {
      if (data.data.status == 0) {
        this.salesTotalTurnoverOfThisMonth = data.data.data;
      }
    });
    dataApi.getSalesTurnoverThisWeek().then(data => {
      if (data.data.status == 0) {
        this.salesTurnoverThisWeek = data.data.data;
      }
    });
    dataApi.getOrderTotalTurnoverOfThisMonth().then(data => {
      if (data.data.status == 0) {
        this.orderTotalTurnoverOfThisMonth = data.data.data;
      }
    });
    dataApi.getOrderTotalTurnoverThisWeek().then(data => {
      if (data.data.status == 0) {
        this.orderTotalTurnoverThisWeek = data.data.data;
      }
    });
  },
  methods: {
    /**
     * 获取time和value数组
     */
    getValueAndTime(arr = []) {
      const chartObj = {
        valueList: [],
        timeList: []
      };
      chartObj.valueList = arr.map(item => {
        return item.value;
      });
      chartObj.timeList = arr.map(item => {
        return item.time;
      });
      return chartObj;
    },
    getSalesStatistics() {
      dataApi.getSalesStatisticsDiagram(this.saleDate).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            xAxis: [
              {
                data: diagramData.timeList
              }
            ],
            yAxis: [
              {
                splitLine: { show: false }
              }
            ],
            series: [
              {
                type: "line",
                showSymbol: true,
                name: "成交额(¥)",
                smooth: true,
                data: diagramData.valueList
              }
            ]
          };
          this.saleOpt = opt;
        }
      });
    },
    getOrderStatistics() {
      dataApi.getOrderStatisticsDiagram(this.orderDate).then(data => {
        if (data.data.status == 0) {
          const diagramData = this.getValueAndTime(data.data.data);
          let opt = {
            tooltip: {
              trigger: "axis"
            },
            xAxis: [
              {
                data: diagramData.timeList
              }
            ],
            yAxis: [
              {
                splitLine: { show: false }
              }
            ],
            series: [
              {
                type: "line",
                showSymbol: true,
                name: "订单数量",
                smooth: true,
                data: diagramData.valueList
              }
            ]
          };
          this.orderOpt = opt;
        }
      });
    },
    getGoodsRanking() {
      dataApi.getGoodsSalesRanking(this.goodSaleDate).then(data => {
        if (data.data.status == 0) {
          if (data.data.data.length > 0) {
            this.goodVisible = true;
            const legendData = data.data.data.map(item => {
              let ld = {};
              ld.name = `${item.title}\n${item.phone ? "ID:" + item.phone + " " : ""}销量：${item.num}`;
              return ld;
            });
            const seriesData = data.data.data.map(item => {
              let ld = {};
              ld.name = `${item.title}\n${item.phone ? "ID:" + item.phone + " " : ""}销量：${item.num}`;
              ld.value = item.num;
              ld.tooltip = {
                formatter: `${item.title}</br>销量：${item.num} ，¥${item.price}（{d}%）`
              };
              return ld;
            });
            let opt = {
              tooltip: {
                trigger: "item"
              },
              legend: {
                type: "scroll",
                orient: "vertical",
                left: 10,
                top: 20,
                bottom: 20,
                data: legendData
              },
              series: [
                {
                  label: {
                    show: false,
                    position: "center"
                  },
                  center: ["60%", "50%"],
                  type: "pie",
                  data: seriesData
                }
              ]
            };
            this.goodOpt = opt;
          } else {
            this.goodVisible = false;
          }
        }
      });
    },
    getPurchasingPower() {
      dataApi.getPurchasingPowerOfUsersRanking(this.userDate).then(data => {
        if (data.data.status == 0) {
          if (data.data.data.length > 0) {
            this.userVisible = true;
            const legendData = data.data.data.map(item => {
              let ld = {};
              ld.name = `${item.title}   ${item.phone ? item.phone : ""}\n 下单：${item.num}   下单金额：¥${
                item.price
              }`;
              return ld;
            });
            const seriesData = data.data.data.map(item => {
              let ld = {};
              ld.name = `${item.title}   ${item.phone ? item.phone : ""}\n 下单：${item.num}   下单金额：¥${
                item.price
              }`;
              ld.value = item.price;
              ld.tooltip = {
                formatter: `${item.phone ? item.phone : ""}</br>下单：${item.num} ，¥${item.price}（{d}%）`
              };
              return ld;
            });
            let opt = {
              tooltip: {
                trigger: "item"
              },
              legend: {
                type: "scroll",
                orient: "vertical",
                left: 10,
                top: 20,
                bottom: 20,
                data: legendData
              },
              series: [
                {
                  label: {
                    show: false,
                    position: "center"
                  },
                  center: ["60%", "50%"],
                  type: "pie",
                  data: seriesData
                }
              ]
            };
            this.userOpt = opt;
          } else {
            this.userVisible = false;
          }
        }
      });
    },
    getTurnoverOfStores() {
      dataApi.getTurnoverOfStoresRanking(this.suppDate).then(data => {
        if (data.data.status == 0) {
          if (data.data.data.length > 0) {
            this.suppVisible = true;
            const legendData = data.data.data.map(item => {
              let ld = {};
              ld.name = `${item.title}\n订单：${item.num}   成交额：¥${item.price}`;
              return ld;
            });
            const seriesData = data.data.data.map(item => {
              let ld = {};
              ld.name = `${item.title}\n订单：${item.num}   成交额：¥${item.price}`;
              ld.value = item.price;
              ld.tooltip = {
                formatter: `${item.title}</br>订单：${item.num} ，¥${item.price}（{d}%）`
              };
              return ld;
            });
            let opt = {
              tooltip: {
                trigger: "item"
              },
              legend: {
                type: "scroll",
                orient: "vertical",
                left: 10,
                top: 20,
                bottom: 20,
                data: legendData
              },
              series: [
                {
                  label: {
                    show: false,
                    position: "center"
                  },
                  center: ["60%", "50%"],
                  type: "pie",
                  data: seriesData
                }
              ]
            };
            this.suppOpt = opt;
          } else {
            this.suppVisible = false;
          }
        }
      });
    }
  }
};
</script>

<style lang="less">
.totleData {
  min-height: 100px;
  width: 100%;
  display: flex;
  .dataItem {
    width: 20%;
    box-sizing: border-box;
    min-height: 100px;
    padding: 0 20px;
    border: 1px solid rgb(228, 228, 228);
    p {
      display: flex;
      justify-content: space-between;
    }
    .itemImg {
      width: 50px;
      height: 50px;
      img {
        margin: 0 auto;
        display: block;
      }
    }
  }
  .dataWithImg {
    display: flex;
    align-items: center;
    flex-direction: row;
    justify-content: space-evenly;
  }
  .dataTitle {
    font-size: 16px;
    color: #999;
  }
  .dataNum {
    font-size: 20px;
    color: #666;
  }
}
.idnexSection {
  margin-bottom: 15px;
  .card {
    width: 100%;
    box-shadow: none;
    .el-card__header {
      background-color: rgb(243, 243, 243);
    }
    .el-card__body {
      padding: 0;
      margin: 0;
      .cardContent {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        .nomsg {
          width: 100%;
          height: 100px;
          line-height: 100px;
          text-align: center;
        }
        .linkItem {
          position: relative;
          width: calc(~"33% - 20px");
          padding: 10px 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          a {
            color: red;
          }
          span {
            display: inline-block;
          }
        }
        .linkItem::after {
          content: "";
          display: block;
          position: absolute;
          bottom: 2px;
          left: 50%;
          width: 88%;
          height: 1px;
          background-color: #ebeef5;
          transform: translateX(-50%);
        }
        .linkRatio {
          width: 150px;
          border-right: 1px solid #ebeef5;
          .linkRatioItem {
            padding: 0 15px;
          }
        }
        .chartBox {
          width: calc(~"100% - 152px");
        }
      }
    }
  }
}
.card {
  .cardHead {
    span {
      font-size: 14px;
      font-weight: 700;
    }
  }
}
.pieSection {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  margin: 0;
  .card {
    width: calc(~"50% - 5px");
    min-width: 535px;
    margin-bottom: 8px;
    .cardHead {
      display: flex;
      justify-content: space-between;
    }
  }
}
.datepickbox {
  padding: 5px 0px;
  display: flex;
  justify-content: flex-end;
}
.sectionCard {
  display: flex;
  justify-content: space-between;
  .card {
    width: 49%;
  }
}
</style>