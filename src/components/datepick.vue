<template>
  <div class="datepick">
    <div
      v-for="item in option"
      :key="item.key"
      :class="key==item.key?'shortcut active':'shortcut'"
      @click="getdaterange({key:item.key})"
    >{{item.title}}</div>
    <el-date-picker
      v-if="showDate"
      :clearable="false"
      style="width:230px"
      v-model="datearr"
      type="datetimerange"
      :value-format="format=='time'?'yyyy-MM-dd HH:mm:ss':'yyyy-MM-dd'"
      range-separator="~"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      @change="changeDate"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: "datepick",
  props: {
    dateOpt: { required: false },
    format: {
      required: false,
      default: "day"
    }
  },
  data() {
    return {
      datearr: [],
      showDate: true,
      key: "",
      option: [
        { key: "day", title: "今日" },
        { key: "week", title: "近七天" },
        { key: "month", title: "近30天" }
      ]
    };
  },
  watch: {
    dateOpt: {
      handler() {
        this.datearr[0] = this.dateOpt.startDate ? this.dateOpt.startDate : "";
        this.datearr[1] = this.dateOpt.endDate ? this.dateOpt.endDate : "";
        this.refreshTable();
      },
      deep: true
    }
  },
  mounted() {
    this.getdaterange({ key: "week" });
  },
  methods: {
    refreshTable() {
      this.showDate = false;
      this.$nextTick(() => {
        this.showDate = true;
      });
    },
    getdaterange({ key }) {
      this.key = key;
      let obj = {
        endDate: "",
        startDate: ""
      };
      if (key == "day") {
        if (this.format == "time") {
          obj.startDate = new Date().format("yyyy-MM-dd") + " 00:00:00";
          obj.endDate = new Date().format("yyyy-MM-dd") + " 23:59:59";
        } else {
          obj.startDate = new Date().format("yyyy-MM-dd");
          obj.endDate = new Date().format("yyyy-MM-dd");
        }
      }
      if (key == "week") {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        if (this.format == "time") {
          obj.startDate = start.format("yyyy-MM-dd") + " 00:00:00";
          obj.endDate = end.format("yyyy-MM-dd") + " 23:59:59";
        } else {
          obj.startDate = start.format("yyyy-MM-dd");
          obj.endDate = end.format("yyyy-MM-dd");
        }
      }
      if (key == "month") {
        const end = new Date();
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        if (this.format == "time") {
          obj.startDate = start.format("yyyy-MM-dd") + " 00:00:00";
          obj.endDate = end.format("yyyy-MM-dd") + " 23:59:59";
        } else {
          obj.startDate = start.format("yyyy-MM-dd");
          obj.endDate = end.format("yyyy-MM-dd");
        }
      }
      this.$emit("update:dateOpt", obj);
    },
    changeDate(value) {
      this.key = "";
      let obj = {
        endDate: "",
        startDate: ""
      };
      if (value && value.length > 0) {
        obj.startDate = value[0];
        obj.endDate = value[1];
      }
      this.$emit("update:dateOpt", obj);
    }
  }
};
</script>

<style lang="less">
.datepick {
  display: flex;
  .shortcut {
    width: 40px;
    font-size: 12px;
    line-height: 40px;
    color: #656565;
    margin: 0 10px;
    cursor: pointer;
  }
  .active {
    color: #1abc9c;
  }
}
</style>