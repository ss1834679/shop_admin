
<template>
  <div id="precisionInput">
    <el-input-number
      :style="width?`width:${width}px`:''"
      v-model="writeNum"
      :precision="2"
      @change="submit"
      @keydown.native.enter="submit"
      :controls="false"
      :placeholder="placeholder"
      :min="0"
    ></el-input-number>
    <span v-if="text" class="text">{{text}}</span>
  </div>
</template>
<script>
export default {
  name: "precisionInput",
  props: {
    num: { required: true },
    type: { type: String },
    text: { type: String },
    placeholder: { type: String },
    width: { type: Number, required: false }
  },
  data() {
    return {
      writeNum: null
    };
  },
  mounted() {
    this.initNum();
  },
  watch: {
    num: {
      handler() {
        this.initNum();
      }
    }
  },
  methods: {
    initNum() {
      // console.log(this.num);
      if (this.type == "price") {
        /* 价格 */
        if (this.num == 0 || this.num == null) {
          this.writeNum = undefined;
        } else {
          this.writeNum = this.num / 100;
        }
      } else if (this.type == "weight") {
        /* 重量 */
        if (this.num == 0 || this.num == null) {
          this.writeNum = undefined;
        } else {
          this.writeNum = this.num / 1000;
        }
      }
    },
    submit() {
      if (this.type == "price") {
        console.log(this.writeNum);
        if (this.writeNum === undefined) {
          this.$emit("update:num", undefined);
          this.$emit("getNum", undefined);
        } else {
          this.$emit("update:num", Number.parseInt((this.writeNum * 100).toFixed()));
          this.$emit("getNum", Number.parseInt((this.writeNum * 100).toFixed()));
        }
      } else if (this.type == "weight") {
        if (this.writeNum === undefined) {
          this.$emit("update:num", undefined);
          this.$emit("getNum", undefined);
        } else {
          this.$emit("getNum", Number.parseInt((this.writeNum * 1000).toFixed()));
          this.$emit("update:num", Number.parseInt((this.writeNum * 1000).toFixed()));
        }
      }
    }
  }
};
</script>
<style lang="less">
#precisionInput {
  line-height: 40px;
  display: inline-block;
  span.text {
    margin-left: 4px;
  }
  .el-input-number {
    width: 120px;
  }
}
</style>