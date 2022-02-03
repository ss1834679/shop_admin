
<template>
  <div>
    <!-- {{boolen}} -->
    <el-switch v-model="value" :disabled="disAbled" :active-text="activeText" :inactive-text="inactiveText" @change="submit">123</el-switch>
    <!-- <span v-if="value&&activeText">{{activeText}}</span> -->
    <!-- <span v-if="!value&&inactiveText">{{inactiveText}}</span> -->
  </div>
</template>
<script>
export default {
  name: "switchCom",
  props: {
    boolen: { required: true },
    type: { type: String },
    activeText: { required: false },
    inactiveText: { required: false }
  },
  data() {
    return {
      value: null,
      disAbled: false
    };
  },
  mounted() {
    if (this.type == "good") {
      this.boolen === 0 && ((this.value = false), (this.disAbled = false));
      this.boolen === 1 && ((this.value = true), (this.disAbled = false));
      (this.boolen === -1 || this.boolen === 2) && ((this.disAbled = true), (this.value = false));
    } else {
      this.value = this.boolen == 1 ? true : false;
    }
  },
  methods: {
    submit(event) {
      if (event) {
        this.$emit("changeValue", 1);
        this.$emit("changeIndex", 1);
        this.$emit("changeBoolen", true);
      } else {
        this.$emit("changeValue", 0);
        this.$emit("changeIndex", 0);
        this.$emit("changeBoolen", false);
      }
    }
  }
};
</script>
<style lang="less">
.el-switch__label {
  position: absolute;
  display: none;
  color: #fff;
}
.el-switch__label--left {
  z-index: 9;
  left: 6px;
}
.el-switch__label--right {
  z-index: 9;
  left: -15px;
}
.el-switch__label.is-active {
  display: block;
}
.el-switch .el-switch__core,
.el-switch .el-switch__label {
  width: 70px !important;
  color: white;
}
.el-switch .el-switch__core {
  background-color: rgba(0, 0, 0, 0.25);
}
</style>