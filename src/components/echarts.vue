<template>
  <div :id="chartId" class="echartStyle"></div>
</template>

<script>
export default {
  name: "Echart",
  props: {
    chartId: { requirsed: true },
    options: { required: true }
  },
  data() {
    return {
      myChart: {}
    };
  },
  created() {
    this.$nextTick(() => {
      this.loadEchart();
    });
  },
  watch: {
    options: {
      handler() {
        this.loadEchart();
      },
      deep: true
    }
  },
  mounted() {
    window.addEventListener("resize", () => this.myChart.resize(), false);
  },
  methods: {
    loadEchart() {
      this.myChart = this.$echarts.init(document.getElementById(this.chartId));
      this.myChart.setOption(this.options, true);
    }
  }
};
</script>
<style lang="less">
.echartStyle {
  min-width: 300px;
  min-height: 300px;
  max-width: 1500px;
  width: 100%;
  height: 100%;
}
</style>