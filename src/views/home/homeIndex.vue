<template>
  <div class="home">
    <div id="myChart" :style="{width: '500px', height: '500px'}"></div>
  </div>
</template>
<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
export default {
  data() {
    return {
      optionsData: {
        legendData: [
          { name: "邬邹\naaa" },
          "卫喻·皮苏时",
          "任元",
          "安梁安",
          "戴卫毛费·蓝",
          "邹祝明萧汤·米许",
          "郎董",
          "酆常汪"
        ],
        seriesData: [
          { name: "邬邹\naaa", value: 16163, tooltip: { formatter: "邬邹<br/>500  $1000{d}%" } },
          { name: "卫喻·皮苏时", value: 43809 },
          { name: "任元", value: 96619 },
          { name: "安梁安", value: 34382 },
          { name: "戴卫毛费·蓝", value: 16629 },
          { name: "邹祝明萧汤·米许", value: 83765 },
          { name: "郎董", value: 29673 },
          { name: "酆常汪", value: 36418 }
        ]
      },
      line: {
        title: {
          text: "折线图堆叠"
        },
        tooltip: {
          trigger: "item" // 移上去触发的区域
        },
        legend: {
          data: ["邮件营销", "联盟广告", "视频广告", "直接访问", "搜索引擎"]
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"]
        },
        yAxis: {
          type: "value"
        },
        series: [
          {
            name: "邮件营销",
            type: "line",
            stack: "总量",
            data: [120, 132, 101, 134, 90, 230, 210],
            smooth: true // 把折线变曲线
          },
          {
            name: "搜索引擎",
            type: "line",
            stack: "总量",
            data: [820, 932, 901, 934, 1290, 1330, 1320]
          }
        ]
      }
    };
  },
  mounted() {
    this.creatChart();
  },
  methods: {
    creatChart() {
      let options = {
        title: {
          text: "同名数量统计",
          subtext: "纯属虚构",
          left: "center"
        },
        tooltip: {
          trigger: "item",
          formatter: "{b} : {c} ({d}%)"
        },
        legend: {
          // type: "scroll",
          orient: "vertical",
          right: 10,
          top: 20,
          bottom: 20,
          data: this.optionsData.legendData
        },
        series: [
          {
            name: "姓名",
            type: "pie",
            radius: "55%",
            center: ["40%", "50%"],
            label: { show: false },
            data: this.optionsData.seriesData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: "rgba(0, 0, 0, 0.5)"
              }
            }
          }
        ]
      };
      let myChart = this.$echarts.init(document.getElementById("myChart"));
      myChart.setOption(options);
    }
  }
};
</script>
<style lang="less">
</style>