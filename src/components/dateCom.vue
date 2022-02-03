<template>
  <!-- 时间选择器 组件 -->
  <div>
    <el-date-picker
      v-model="datetime"
      :type="type||'datetime'"
      :disabled="disable"
      :placeholder="place||''"
      :clearable="clear"
      :picker-options="pickerOptions"
      class="dateCom"
      :value-format="value"
      @change="handlerChangeTime"
    ></el-date-picker>
  </div>
</template>

<script>
export default {
  name: "DateCom",
  props: {
    time: { required: true },
    place: { required: false } /* 提示框 */,
    type: { required: false } /* datetime/datetimerange/date/daterange */,
    clear: { required: false, default: true, type: Boolean } /* 是否可清空 */,
    value: { required: false, type: String, default: "yyyy-MM-dd" } /* 返回值的格式化 */,
    format: { required: false, type: String, default: "yyyy-MM-dd hh:mm:ss" },
    start: { required: false } /* 选择的开始时间 之前的都disable */,
    end: { required: false } /* 选择的结束时间 之后的都disable */,
    disable: { required: false, type: Boolean, default: false } /* 禁用 true 为禁用 false 为不禁用 */
  },
  data() {
    return {
      datetime: undefined /* 组件中 选择的时间 */,
      pickerOptions: {} /* Date配置 */
    };
  },
  created() {
    let _this = this;
    this.pickerOptions = {
      disabledDate(time) {
        if (_this.start && !_this.end) {
          return time.getTime() < new Date(_this.start);
        }
        if (!_this.start && _this.end) {
          return time.getTime() > new Date(_this.end);
        }
        if (_this.start && _this.end) {
          return time.getTime() > new Date(_this.end) || time.getTime() < new Date(_this.start);
        }
        if (!_this.start && !_this.end) {
          return true;
        }
      }
    };
    this.datetime = this.time;
  },
  mounted() {
    this.time && this.$emit("update:time", new Date(this.datetime).format(this.format));
  },
  methods: {
    handlerChangeTime() {
      this.$emit("update:time", new Date(this.datetime).format(this.format));
    }
  }
};
</script>

<style lang='less'>
// .dateCom {
// }
</style>
